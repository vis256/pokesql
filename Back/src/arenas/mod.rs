pub mod members;
pub mod regions;

use rocket::serde::{Deserialize, Serialize};
use rocket::serde::json::Json;
use rocket::State;

use sqlx::types::chrono::NaiveDate;
use sqlx::{Error, Postgres, Pool};

#[derive(Serialize, Deserialize)]
pub struct Arena {
    name: String,
    region: String,
    leader: Option<i64>
}

#[derive(Serialize, Deserialize)]
pub struct ArenaMember {
    id: i64,
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

#[get("/arenas")]
pub async fn get_all_arenas(
    pool: &State<Pool<Postgres>>
) -> Option<Json<Vec<Arena>>> {
    match get_all(pool).await {
        Ok(arenas) => Some(Json(arenas)),
        Err(_) => None
    }
}

