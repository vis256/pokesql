use rocket::State;
use rocket::response::status;
use rocket::serde::Serialize;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres};

#[derive(Serialize)]
pub struct PokedexEntry {
    number: i32,
    name: String,
    min_level: i16,
    primary_type: String,
    secondary_type: Option<String>,
    region: String
}

impl PokedexEntry {
    pub async fn get_all(pool: &Pool<Postgres>) -> anyhow::Result<Vec<PokedexEntry>> {
        Ok(sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex").fetch_all(&*pool).await?)
    }

    pub async fn get_pokedex_entry(pool: &Pool<Postgres>, id: i32) -> anyhow::Result<PokedexEntry> {
        Ok(sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex WHERE number = $1", id).fetch_one(&*pool).await?)
    }
}

#[get("/pokedex")]
pub async fn pokedex(pool: &State<Pool<Postgres>>) -> Json<Vec<PokedexEntry>> {
    Json(PokedexEntry::get_all(&pool).await.unwrap())
}

#[get("/pokedex/<id>")]
pub async fn pokedex_id(
    pool: &State<Pool<Postgres>>,
    id: i32
) -> Result<Json<PokedexEntry>, status::NotFound<()>> {
    Ok(Json(PokedexEntry::get_pokedex_entry(&pool, id)
        .await.map_err(|_| { status::NotFound(()) })?))
}
