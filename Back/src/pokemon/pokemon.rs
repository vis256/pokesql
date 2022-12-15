use rocket::State;
use rocket::response::status;
use rocket::serde::json::Json;

use super::Pokemon;

pub async fn get_all_user(
    pool: &Pool<Postgres>,
    login: String
) -> anyhow::Result<Vec<Pokemon>> {
    Ok(sqlx::query_as!(Pokemon, "SELECT * FROM Pokemon WHERE owner = $1", login).fetch_all(&*pool).await?)
}

pub async fn get_one(
    pool: &Pool<Postgres>,
    id: i64
) -> anyhow::Result<Pokemon> {
    Ok(sqlx::query_as!(Pokemon, "SELECT * FROM Pokemon WHERE id = $1", id).fetch_one(&*pool).await?)
}

pub async fn add_one(
    pool: &Pool<Postgres>,
    pokemon: &Pokemon
) -> anyhow::Result<()> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Pokemons(\
            id, name, level, sex, \
            pokedex_num, pokeball, owner) \
         VALUES ($1, $2, $3, $4, $5, $6, $7)",
         pokemon.id, pokemon.name, pokemon.level, pokemon.sex,
         pokemon.pokedex_num, pokemon.pokeball, pokemon.owner
    ).execute(&mut transaction).await?;
    Ok(())
}

#[get("/<login>/pokemons")]
pub async fn user_pokemons_get(
    pool: &Pool<Postgres>,
    login: String,
) -> Json<Vec<Pokemon>> {
    Json(get_all_user(&pool, login).await.unwrap())
}
