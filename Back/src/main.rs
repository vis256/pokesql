#[macro_use] extern crate rocket;

mod user;

use user::{
    login,
    register
};

use std::env;

use rocket::State;
use rocket::serde::Serialize;
use rocket::serde::json::Json;

use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};


#[derive(Serialize)]
struct Type {
    name: String
}

impl Type {
    pub async fn get_all(pool: &Pool<Postgres>) -> anyhow::Result<Vec<Type>> {
        Ok(sqlx::query_as!(Type, "SELECT * FROM Types").fetch_all(&*pool).await?)
    }
}

#[get("/types")]
async fn types(pool: &State<Pool<Postgres>>) -> Json<Vec<Type>> {
    Json(Type::get_all(&pool).await.unwrap())
}

#[rocket::main]
async fn main() -> anyhow::Result<()> {
    let database_url = env::var("DATABASE_URL")
        .unwrap_or(String::from("postgresql://postgres:12345@127.0.0.1/postgres?sslmode=prefer"));

    let pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await?;

    rocket::build()
        .mount("/", routes![types, register::register])
        .mount("/types", routes![types])
        .mount("/api/login", routes![login::login])
        .manage(pool)
        .ignite().await?
        .launch().await?;

    Ok(())
}
