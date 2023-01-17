use rocket::State;
use rocket::serde::{Serialize, Deserialize};
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

#[derive(Serialize, Deserialize)]
pub struct Pokeball {
    name: String,
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
