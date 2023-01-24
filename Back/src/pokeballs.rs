use rocket::State;
use rocket::serde::{Serialize, Deserialize};
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

#[derive(Serialize, Deserialize)]
pub struct Pokeball {
    pub name: String,
}

async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<Pokeball>, Error> {
    sqlx::query_as!(Pokeball, "SELECT * FROM Pokeballs").fetch_all(pool).await
}

pub async fn get_one(pool: &Pool<Postgres>, name: &str) -> Result<Pokeball, Error> {
    sqlx::query_as!(Pokeball, "SELECT * FROM Pokeballs WHERE name = $1", name).fetch_one(pool).await
}

async fn add_one(pool: &Pool<Postgres>, pokeball: &Pokeball) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Pokeballs(name) VALUES ($1)",
        pokeball.name
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn delete_one(
    pool: &Pool<Postgres>,
    pokeball: &str
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "DELETE FROM Pokeballs WHERE name = $1", pokeball
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn update_one(
    pool: &Pool<Postgres>,
    name: &str,
    pb: &Pokeball
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "UPDATE Pokeballs SET name = $1 WHERE name = $2", name, pb.name
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/pokeballs/<name>/update", data = "<pb>")]
pub async fn update_pokeball(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    name: &str,
    pb: Json<Pokeball>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = update_one(pool, name, &pb.into_inner()).await {
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


#[get("/pokeballs")]
pub async fn get_pokeballs(pool: &State<Pool<Postgres>>) -> Response<Json<Vec<Pokeball>>> {
    match get_all(pool).await {
        Ok(pokeballs) => Response::Success(Some(Json(pokeballs))),
        Err(err) => Response::BadRequest(Some(Json(ErrInfo::from(err))))
    }
}

#[get("/pokeballs/<name>")]
pub async fn get_pokeball(pool: &State<Pool<Postgres>>, name: &str) -> Response<Json<Pokeball>> {
    match get_one(pool, name).await {
        Ok(pokeball) => Response::Success(Some(Json(pokeball))),
        Err(err) => Response::BadRequest(Some(Json(ErrInfo::from(err))))
    }
}

#[post("/pokeballs/new", data = "<entry>")]
pub async fn add_pokeball(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    entry: Json<Pokeball>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match add_one(pool, &entry.into_inner()).await {
                Ok(()) => Response::Success(Some(())),
                Err(err) =>Response::BadRequest(
                    Some(Json(ErrInfo::from(err))))
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[get("/pokeballs/<name>/delete")]
pub async fn del_pokeball(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    name: &str
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = delete_one(pool, name).await {
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
