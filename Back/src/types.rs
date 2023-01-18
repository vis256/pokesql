use rocket::State;
use rocket::serde::{Serialize, Deserialize};
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

#[derive(Serialize, Deserialize)]
pub struct Type {
    name: String,
}

async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<Type>, Error> {
    sqlx::query_as!(Type, "SELECT * FROM Types").fetch_all(pool).await
}

async fn add_one(pool: &Pool<Postgres>, type_: &Type) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!("INSERT INTO Types(name) VALUES ($1)", type_.name)
        .execute(&mut transaction).await?;
    transaction.commit().await
}

async fn update_one(
    pool: &Pool<Postgres>,
    name: &str,
    type_: &Type
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "UPDATE Types SET name = $1 WHERE name = $2",
        type_.name, name).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/types/<name>/update", data = "<type_>")]
pub async fn update_type(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    name: &str,
    type_: Json<Type>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = update_one(pool, name, &type_.into_inner()).await {
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

#[get("/types")]
pub async fn get_types(pool: &State<Pool<Postgres>>) -> Json<Vec<Type>> {
    Json(get_all(pool).await.unwrap())
}

#[post("/types/new", data = "<type_>")]
pub async fn new_type(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    type_: Json<Type>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match add_one(pool, &type_.into_inner()).await {
                Ok(()) => Response::Success(Some(())),
                Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
            }
        }
        _ => Response::Unauthorized(())
    }
}
