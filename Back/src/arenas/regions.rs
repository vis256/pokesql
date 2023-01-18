use rocket::serde::json::Json;
use rocket::serde::{Serialize, Deserialize};
use rocket::State;

use sqlx::{Error, Postgres, Pool};

#[derive(Serialize, Deserialize)]
pub struct Region {
    name: String,
    #[serde(alias = "type")]
    type_: String,
    arena: String
}

async fn get_one_name(
    pool: &Pool<Postgres>,
    name: &str
) -> Result<Region, Error> {
    sqlx::query_as!(
        Region, r#"SELECT name, type as "type_", arena FROM Regions WHERE name = $1"#,
        name).fetch_one(pool).await
}

async fn get_one_arena(
    pool: &Pool<Postgres>,
    arena: &str
) -> Result<Region, Error> {
    sqlx::query_as!(
        Region, r#"SELECT name, type as "type_", arena FROM Regions WHERE arena = $1"#,
        arena).fetch_one(pool).await
}

async fn get_all(
    pool: &Pool<Postgres>
) -> Result<Vec<Region>, Error> {
    sqlx::query_as!(
        Region, r#"SELECT name, type as "type_", arena FROM Regions"#
    ).fetch_all(pool).await
}

#[get("/arenas/<arena>/region")]
pub async fn get_arena_region(
    pool: &State<Pool<Postgres>>,
    arena: &str
) -> Option<Json<Region>> {
    match get_one_arena(pool, arena).await {
        Ok(region) => Some(Json(region)),
        Err(_) => None
    }
}

#[get("/regions/<name>")]
pub async fn get_region_name(
    pool: &State<Pool<Postgres>>,
    name: &str
) -> Option<Json<Region>> {
    match get_one_name(pool, name).await {
        Ok(region) => Some(Json(region)),
        Err(_) => None
    }
}

#[get("/regions")]
pub async fn get_all_regions(
    pool: &State<Pool<Postgres>>
) -> Option<Json<Vec<Region>>> {
    match get_all(pool).await {
        Ok(regions) => Some(Json(regions)),
        Err(_) => None
    }
}
