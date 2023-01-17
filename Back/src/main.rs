#[macro_use] extern crate rocket;

mod user;
mod pokedex;
mod pokemon;
mod response;
mod pokeballs;
mod arenas;
mod types;

use user::{
    login,
    register,
    users
};

use std::env;
use sqlx::postgres::PgPoolOptions;

#[rocket::main]
async fn main() -> anyhow::Result<()> {
    let database_url = env::var("DATABASE_URL")
        .unwrap_or(String::from("postgresql://postgres:12345@127.0.0.1/postgres?sslmode=prefer"));

    let pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await?;

    rocket::build()
        .mount(
            "/api",
            routes![
                register::register,
                pokedex::pokedex_get,
                pokedex::pokedex_id_get,
                pokedex::pokedex_set,
                pokemon::user_new_pokemon,
                pokemon::user_pokemons_get,
                pokeballs::get_pokeballs,
                pokeballs::get_pokeball,
                pokeballs::add_pokeball,
                users::get_users,
                users::get_user,
                arenas::members::get_one_member,
                arenas::members::get_memberships,
                arenas::members::get_members,
                arenas::regions::get_all_regions,
                arenas::regions::get_region_name,
                arenas::regions::get_arena_region,
                arenas::get_all_arenas,
                arenas::add_arena,
                types::new_type,
                types::get_types
            ])
        .mount("/api/login", routes![login::login])
        .manage(pool)
        .ignite().await?
        .launch().await?;

    Ok(())
}
