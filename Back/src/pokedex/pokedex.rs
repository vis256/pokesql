use rocket::State;
use rocket::response::status;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres};

use super::PokedexEntry;
use crate::user::AuthStatus;

pub async fn get_all(pool: &Pool<Postgres>) -> anyhow::Result<Vec<PokedexEntry>> {
    Ok(sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex").fetch_all(&*pool).await?)
}

pub async fn get_pokedex_entry(pool: &Pool<Postgres>, id: i32) -> anyhow::Result<PokedexEntry> {
    Ok(sqlx::query_as!(PokedexEntry, "SELECT * FROM Pokedex WHERE number = $1", id).fetch_one(&*pool).await?)
}

pub async fn set_pokedex_entry(
    pool: &Pool<Postgres>,
    pokedex: &PokedexEntry
) -> anyhow::Result<()> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Pokedex(\
            number, name, min_level, \
            primary_type, secondary_type, region)\
        VALUES ($1, $2, $3, $4, $5, $6)",
        pokedex.number, pokedex.name, pokedex.min_level,
        pokedex.primary_type, pokedex.secondary_type, pokedex.region
    ).execute(&mut transaction).await?;
    Ok(())
}

#[get("/pokedex")]
pub async fn pokedex_get(pool: &State<Pool<Postgres>>) -> Json<Vec<PokedexEntry>> {
    Json(get_all(&pool).await.unwrap())
}

#[get("/pokedex/<id>")]
pub async fn pokedex_id_get(
    pool: &State<Pool<Postgres>>,
    id: i32
) -> Option<Json<PokedexEntry>> {
    if let Ok(e) = get_pokedex_entry(&pool, id).await {
        Some(Json(e))
    } else {
        None
    }
}

#[post("/pokedex/new", data = "<entry>")]
pub async fn pokedex_set(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    entry: Json<PokedexEntry>,
) -> Result<(), Result<status::BadRequest<String>, status::Unauthorized<String>>> {
    match auth {
        AuthStatus::Professor => Ok(set_pokedex_entry(pool, &entry.into_inner()).await.unwrap()),
        _ => Err(Err(status::Unauthorized(None)))
    }
}
