use rocket::State;
use rocket::serde::Deserialize;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use super::Type;

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

#[derive(Deserialize)]
pub struct Counter {
    better_type: String,
    worse_type: String
}

async fn get_worse_types(
    pool: &Pool<Postgres>,
    type_: &str
) -> Result<Vec<Type>, Error> {
    sqlx::query_as!(
        Type, "SELECT t.name FROM Types t JOIN Counters c ON t.name = c.worse_type WHERE c.better_type = $1",
        type_).fetch_all(pool).await

}

async fn get_better_types(
    pool: &Pool<Postgres>,
    type_: &str
) -> Result<Vec<Type>, Error> {
    sqlx::query_as!(
        Type, "SELECT t.name FROM Types t JOIN Counters c ON t.name = c.better_type WHERE c.worse_type = $1",
        type_).fetch_all(pool).await
}

async fn add_one(
    pool: &Pool<Postgres>,
    counter: &Counter
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Counters (better_type, worse_type) \
        VALUES ($1, $2)", counter.better_type, counter.worse_type
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn delete_one(
    pool: &Pool<Postgres>,
    c: &Counter
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "DELETE FROM Counters WHERE better_type = $1 AND worse_type = $2",
        c.better_type, c.worse_type).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/counters/worse/<type_>")]
pub async fn get_counters_worse(
    pool: &State<Pool<Postgres>>,
    type_: &str
) -> Option<Json<Vec<Type>>> {
    match get_worse_types(pool, type_).await {
        Ok(types) => Some(Json(types)),
        Err(_) => None
    }
}

#[get("/counters/better/<type_>")]
pub async fn get_counters_better(
    pool: &State<Pool<Postgres>>,
    type_: &str
) -> Option<Json<Vec<Type>>> {
    match get_better_types(pool, type_).await {
        Ok(types) => Some(Json(types)),
        Err(_) => None
    }
}

#[post("/counters/new", data = "<counter>")]
pub async fn add_counter(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    counter: Json<Counter>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = add_one(pool, &counter).await {
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

#[post("/counters/delete", data = "<cntr>")]
pub async fn delete_counter(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    cntr: Json<Counter>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match delete_one(pool, &cntr.into_inner()).await {
                Ok(()) => Response::Success(Some(())),
                Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
            }
        }
        _ => Response::Unauthorized(())
    }
}
