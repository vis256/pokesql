use rocket::State;
use rocket::serde::Deserialize;
use rocket::serde::json::Json;

use sqlx::{Error, Pool, Postgres};

use super::PokedexEntry;
use crate::user::AuthStatus;

use crate::attacks::Attack;
use crate::pokeballs::Pokeball;
use crate::response::{ErrInfo, Response};

#[derive(Deserialize)]
pub struct AttackPokedex {
    attack: String,
    pokedex_num: i32
}

#[derive(Deserialize)]
pub struct PokeballPokedex {
    pokeball: String,
    pokedex_num: i32
}

pub async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<PokedexEntry>, Error> {
    sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex").fetch_all(&*pool).await
}

pub async fn get_pokedex_entry(pool: &Pool<Postgres>, id: i32) -> Result<PokedexEntry, Error> {
    sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex WHERE number = $1", id).fetch_one(&*pool).await
}

pub async fn delete_one(
    pool: &Pool<Postgres>,
    number: i32
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "DELETE FROM Pokedex WHERE number = $1", number
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/pokedex/<number>/delete")]
pub async fn del_pokedex_entry(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    number: i32
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match delete_one(pool, number).await {
                Ok(()) => Response::Success(Some(())),
                Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
            }
        }
        _ => Response::Unauthorized(())
    }
}

async fn pokeball_pokedex(
    pool: &Pool<Postgres>,
    pokeball: &str
) -> Result<Vec<PokedexEntry>, Error> {
    sqlx::query_as!(
        PokedexEntry,
        r#"SELECT p.number, p.name, p.min_level, p.primary_type, p.secondary_type, p.region
            FROM PokeballsPokedex x JOIN Pokedex p ON x.pokedex = p.number WHERE x.pokeball = $1"#,
        pokeball).fetch_all(pool).await
}

async fn pokedex_pokeballs(
    pool: &Pool<Postgres>,
    pokedex: i32
) -> Result<Vec<Pokeball>, Error> {
    sqlx::query_as!(
        Pokeball,
        r#"SELECT x.pokeball as name FROM PokeballsPokedex x JOIN Pokedex p
            ON x.pokedex = p.number WHERE x.pokedex = $1"#, pokedex
    ).fetch_all(pool).await
}

async fn new_pokedex_pokeball(
    pool: &Pool<Postgres>,
    pp: &PokeballPokedex
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"INSERT INTO PokeballsPokedex(pokeball, pokedex)
            VALUES($1, $2)"#, pp.pokeball, pp.pokedex_num
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/pokedex/<num>/pokeballs")]
pub async fn get_pokedex_pokeballs(
    pool: &State<Pool<Postgres>>,
    num: i32
) -> Option<Json<Vec<Pokeball>>> {
    match pokedex_pokeballs(pool, num).await {
        Ok(x) => Some(Json(x)),
        Err(_) => None
    }
}

#[get("/pokeballs/<name>/pokedex")]
pub async fn get_pokeball_pokedex(
    pool: &State<Pool<Postgres>>,
    name: &str
) -> Option<Json<Vec<PokedexEntry>>> {
    match pokeball_pokedex(pool, name).await {
        Ok(x) => Some(Json(x)),
        Err(_) => None
    }
}

#[post("/pokedex/pokeballs/new", data = "<pp>")]
pub async fn add_pokedex_pokeball(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    pp: Json<PokeballPokedex>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = new_pokedex_pokeball(pool, &pp.into_inner()).await {
                if let Error::RowNotFound = e {
                    Response::NotFound(Some(Json(ErrInfo::from(e))))
                } else {
                    Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Success(Some(()))
            }
        }
        _ => Response::Unauthorized(())
    }
}

async fn get_attacks(
    pool: &Pool<Postgres>,
    num: i32
) -> Result<Vec<Attack>, Error> {
    sqlx::query_as!(Attack,
        r#"SELECT a.name, a.power, a.hit_chance, a.type as "type_"
            FROM Attacks a JOIN AttacksPokedex p ON a.name = p.attack
            WHERE p.pokedex_num = $1"#, num).fetch_all(pool).await

}

async fn get_attack_pokedex(
    pool: &Pool<Postgres>,
    at: &str
) -> Result<Vec<PokedexEntry>, Error> {
    sqlx::query_as!(
        PokedexEntry,
        r#"SELECT p.number, p.name, p.min_level, p.primary_type, p.secondary_type, p.region
            FROM AttacksPokedex a JOIN Pokedex p ON a.pokedex_num = p.number WHERE a.attack = $1"#,
        at).fetch_all(pool).await

}

async fn add_attack_pokedex(
    pool: &Pool<Postgres>,
    ap: &AttackPokedex
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"INSERT INTO AttacksPokedex(pokedex_num, attack)
           VALUES ($1, $2)"#, ap.pokedex_num, ap.attack
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/pokedex/<id>/attacks")]
pub async fn get_pokedex_attacks(
    pool: &State<Pool<Postgres>>,
    id: i32,
) -> Option<Json<Vec<Attack>>> {
    match get_attacks(pool, id).await {
        Ok(attacks) => Some(Json(attacks)),
        Err(_) => None
    }
}

#[get("/attacks/pokedex/<attack>")]
pub async fn attack_pokedex(
    pool: &State<Pool<Postgres>>,
    attack: &str
) -> Option<Json<Vec<PokedexEntry>>> {
    match get_attack_pokedex(pool, attack).await {
        Ok(attacks) => Some(Json(attacks)),
        Err(_) => None
    }
}

#[post("/pokedex/attacks/new", data = "<ap>")]
pub async fn new_pokedex_attack(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    ap: Json<AttackPokedex>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = add_attack_pokedex(pool, &ap.into_inner()).await {
                if let Error::RowNotFound = e {
                    Response::NotFound(Some(Json(ErrInfo::from(e))))
                } else {
                    Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Success(Some(()))
            }
        }
        _ => Response::Unauthorized(())
    }
}

pub async fn set_pokedex_entry(
    pool: &Pool<Postgres>,
    pokedex: &PokedexEntry
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Pokedex(\
            number, name, min_level, \
            primary_type, secondary_type, region)\
        VALUES ($1, $2, $3, $4, $5, $6)",
        pokedex.number, pokedex.name, pokedex.min_level,
        pokedex.primary_type, pokedex.secondary_type, pokedex.region
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

pub async fn update_pokedex_entry(
    pool: &Pool<Postgres>,
    number: i32,
    entry: &PokedexEntry
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"UPDATE Pokedex SET
            number = $1,
            name = $2,
            min_level = $3,
            primary_type = $4,
            secondary_type = $5,
            region = $6 WHERE number = $7"#,
        entry.number, entry.name, entry.min_level,
        entry.primary_type, entry.secondary_type, entry.region, number
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/pokedex/<id>/update", data = "<entry>")]
pub async fn pokedex_update(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    id: i32,
    entry: Json<PokedexEntry>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = update_pokedex_entry(pool, id, &entry.into_inner()).await {
                if let Error::RowNotFound = e {
                    Response::NotFound(Some(Json(ErrInfo::from(e))))
                } else {
                    Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Success(Some(()))
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[get("/pokedex")]
pub async fn pokedex_get(pool: &State<Pool<Postgres>>) -> Response<Json<Vec<PokedexEntry>>> {
    match get_all(&pool).await {
        Ok(all) => Response::Success(Some(Json(all))),
        Err(err) => Response::BadRequest(
            Some(Json(ErrInfo::from(err))))
    }
}

#[get("/pokedex/<id>")]
pub async fn pokedex_id_get(
    pool: &State<Pool<Postgres>>,
    id: i32
) -> Response<Json<PokedexEntry>> {
    match get_pokedex_entry(&pool, id).await {
        Ok(entry) => Response::Success(Some(Json(entry))),
        Err(err) => {
            Response::NotFound(
                Some(Json(ErrInfo::from(err))))
        }
    }
}

#[post("/pokedex/new", data = "<entry>")]
pub async fn pokedex_set(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    entry: Json<PokedexEntry>,
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match set_pokedex_entry(pool, &entry.into_inner()).await {
                Ok(()) => Response::Success(Some(())),
                Err(err) => Response::BadRequest(
                    Some(Json(ErrInfo::from(err))))
            }
        }
        _ => Response::Unauthorized(())
    }
}
