pub mod members;
pub mod regions;

use rocket::serde::{Deserialize, Serialize};
use rocket::serde::json::Json;
use rocket::State;

use sqlx::types::chrono::NaiveDate;
use sqlx::{Error, Postgres, Pool};

use crate::user::AuthStatus;
use crate::response::{ErrInfo, Response};

#[derive(Deserialize)]
pub struct ArenaRegion {
    region: String,
    arena: String,
    #[serde(alias = "type")]
    type_: String,
}

#[derive(Serialize)]
pub struct Arena {
    name: String,
    region: String,
    leader: Option<i64>
}

#[derive(Serialize, Deserialize)]
pub struct ArenaMember {
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    join_date: Option<NaiveDate>,
    usr: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    score: Option<i32>,
    arena: String
}

async fn get_all(
    pool: &Pool<Postgres>
) -> Result<Vec<Arena>, Error> {
    sqlx::query_as!(Arena, "SELECT * FROM Arenas")
        .fetch_all(pool).await
}

async fn get_one(
    pool: &Pool<Postgres>,
    name: &str
) -> Result<Arena, Error> {
    sqlx::query_as!(Arena, "SELECT * FROM Arenas WHERE name = $1", name)
        .fetch_one(pool).await
}

async fn new_arena(
    pool: &Pool<Postgres>,
    ar: &ArenaRegion
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "call AddRegionArena($1, $2, $3)",
        ar.region, ar.type_, ar.arena
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/arenas")]
pub async fn get_all_arenas(
    pool: &State<Pool<Postgres>>
) -> Option<Json<Vec<Arena>>> {
    match get_all(pool).await {
        Ok(arenas) => Some(Json(arenas)),
        Err(_) => None
    }
}

#[post("/arenas/new", data = "<ar>")]
pub async fn add_arena(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    ar: Json<ArenaRegion>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = new_arena(pool, &ar.into_inner()).await {
                Response::BadRequest(Some(Json(ErrInfo::from(e))))
            } else {
                Response::Success(Some(()))
            }
        },
        _ => Response::Unauthorized(())
    }
}

#[get("/arenas/<name>")]
pub async fn get_arena(pool: &State<Pool<Postgres>>, name: &str) -> Option<Json<Arena>> {
    match get_one(pool, name).await {
        Ok(arena) => Some(Json(arena)),
        Err(_) => None
    }
}
