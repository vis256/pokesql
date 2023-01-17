use rocket::State;
use rocket::serde::json::Json;

use sqlx::Error;
use sqlx::{Pool, Postgres};

use super::Pokemon;

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
