use rocket::State;
use rocket::serde::json::Json;

use sqlx::Error;
use sqlx::{Pool, Postgres};

use super::Pokemon;
use super::PokemonAttack;

use crate::attacks::Attack;
use crate::user::AuthStatus;
use crate::response::{ErrInfo, Response};

pub async fn get_all_user(
    pool: &Pool<Postgres>,
    login: String
) -> Result<Vec<Pokemon>, Error> {
    sqlx::query_as!(Pokemon, r#"SELECT id as "id?", name, level, sex, pokedex_num, pokeball, owner FROM Pokemons WHERE owner = $1"#, login).fetch_all(&*pool).await
}

pub async fn get_one(
    pool: &Pool<Postgres>,
    id: i64
) -> Result<Pokemon, Error> {
    sqlx::query_as!(Pokemon, r#"SELECT id as "id?", name, level, sex, pokedex_num, pokeball, owner FROM Pokemons WHERE id = $1"#, id).fetch_one(&*pool).await
}

pub async fn add_one(
    pool: &Pool<Postgres>,
    pokemon: &Pokemon
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Pokemons(\
            id, name, level, sex, \
            pokedex_num, pokeball, owner) \
         VALUES ($1, $2, $3, $4, $5, $6, $7)",
         pokemon.id, pokemon.name, pokemon.level, pokemon.sex,
         pokemon.pokedex_num, pokemon.pokeball, pokemon.owner
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn get_attacks(pool: &Pool<Postgres>, id: i64) -> Result<Vec<Attack>, Error> {
    sqlx::query_as!(Attack, r#"SELECT a.name, a.power, a.hit_chance, a.type as "type_" FROM AttacksPokemons p JOIN Attacks a ON a.name = p.attack WHERE p.pokemon_id = $1"#, id)
        .fetch_all(pool).await
}

async fn add_attack(pool: &Pool<Postgres>, pa: &PokemonAttack) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO AttacksPokemons(pokemon_id, attack) VALUES ($1, $2)",
        pa.pokemon_id, pa.attack).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn update_one(
    pool: &Pool<Postgres>,
    id: i64,
    p: &Pokemon
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"UPDATE Pokemons SET
            name = $1,
            sex = $2,
            pokeball = $3 WHERE id = $4"#,
        p.name, p.sex, p.pokeball, id).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/pokemons/<id>/update", data = "<poke>")]
pub async fn update_pokemon(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    id: i64,
    poke: Json<Pokemon>
) -> Response<()> {
    let pa = poke.into_inner();
    let owner = match sqlx::query!(
        "SELECT owner FROM Pokemons WHERE id = $1", pa.id
    ).fetch_one(&**pool).await {
        Ok(o) => o.owner,
        Err(e) => return Response::NotFound(Some(Json(ErrInfo::from(e))))
    };

    if owner != pa.owner { return Response::Unauthorized(()); }

    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            if name == owner {
                if let Err(e) = update_one(pool, id, &pa).await {
                    if let Error::RowNotFound = e {
                        Response::NotFound(Some(Json(ErrInfo::from(e))))
                    } else {
                        Response::BadRequest(Some(Json(ErrInfo::from(e))))
                    }
                } else {
                    Response::Success(Some(()))
                }
            } else {
                Response::Unauthorized(())
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[get("/pokemon/<id>")]
pub async fn get_pokemon(
    pool: &State<Pool<Postgres>>,
    id: i64
) -> Option<Json<Pokemon>> {
    match get_one(pool, id).await {
        Ok(pokemon) => Some(Json(pokemon)),
        Err(_) => None
    }
}

#[get("/pokemons/<login>")]
pub async fn user_pokemons_get(
    pool: &State<Pool<Postgres>>,
    login: String,
) -> Response<Json<Vec<Pokemon>>> {
    match get_all_user(&pool, login).await {
        Ok(users) => Response::Success(Some(Json(users))),
        Err(e) => Response::BadRequest(
            Some(Json(ErrInfo::from(e))))
    }
}

#[post("/pokemons/<login>/attacks/new", data = "<pa>")]
pub async fn new_attack(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    login: &str,
    pa: Json<PokemonAttack>
) -> Response<()> {
    // check if the pokemon belongs to the given user
    let owner = match sqlx::query!(
        "SELECT owner FROM Pokemons WHERE id = $1", pa.pokemon_id
    ).fetch_one(&**pool).await {
        Ok(o) => o.owner,
        Err(e) => return Response::NotFound(Some(Json(ErrInfo::from(e))))
    };
    if owner != login { return Response::Unauthorized(()); }

    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            if name == owner {
                match add_attack(pool, &pa).await {
                    Ok(()) => Response::Success(Some(())),
                    Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Unauthorized(())
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[get("/pokemons/<id>/attacks")]
pub async fn pokemon_attacks(pool: &State<Pool<Postgres>>, id: i64) -> Json<Vec<Attack>> {
    Json(get_attacks(pool, id).await.unwrap())
}

#[post("/pokemons/<login>/new", data = "<entry>")]
pub async fn user_new_pokemon(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    entry: Json<Pokemon>,
    login: String
) -> Response<()> {
    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            if name != login {
                return Response::Unauthorized(());
            }
            match add_one(pool, &entry.into_inner()).await {
                Ok(()) => Response::Success(None),
                Err(e) => Response::BadRequest(
                    Some(Json(ErrInfo::from(e))))
            }
        }
        AuthStatus::Unauthorized => Response::Unauthorized(()),
    }
}
