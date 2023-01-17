use rocket::State;
use rocket::serde::json::Json;

use sqlx::{Error, Pool, Postgres};

use super::PokedexEntry;
use crate::user::AuthStatus;
use crate::response::{ErrInfo, Response};

pub async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<PokedexEntry>, Error> {
    sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex").fetch_all(&*pool).await
}

pub async fn get_pokedex_entry(pool: &Pool<Postgres>, id: i32) -> Result<PokedexEntry, Error> {
    sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex WHERE number = $1", id).fetch_one(&*pool).await
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
                Ok(()) => Response::Success(None),
                Err(err) => Response::BadRequest(
                    Some(Json(ErrInfo::from(err))))
            }
        }
        _ => Response::Unauthorized(())
    }
}
