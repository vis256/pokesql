#[macro_use] extern crate rocket;

mod user;
mod pokedex;
mod pokemon;
mod response;
mod pokeballs;
mod arenas;
mod types;
mod attacks;

use user::{
    login,
    register,
    users
};

use std::env;
use sqlx::postgres::PgPoolOptions;

#[rocket::launch]
async fn rocket() -> _ {
    let database_url = env::var("DATABASE_URL")
        .unwrap_or(String::from("postgresql://postgres:12345@127.0.0.1/postgres?sslmode=prefer"));

    let pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await.unwrap();

    rocket::build()
        .mount(
            "/api",
            routes![
                pokedex::pokedex_get,
                pokedex::pokedex_id_get,
                pokedex::pokedex_set,
                pokemon::user_new_pokemon,
                pokemon::user_pokemons_get,
                pokemon::pokemon_attacks,
                pokemon::new_attack,
                pokemon::get_pokemon,
                pokeballs::get_pokeballs,
                pokeballs::get_pokeball,
                pokeballs::add_pokeball,
                users::get_users,
                users::get_user,
                register::register,
                arenas::members::get_one_member,
                arenas::members::get_memberships,
                arenas::members::get_members,
                arenas::members::add_member,
                arenas::regions::get_all_regions,
                arenas::regions::get_region_name,
                arenas::regions::get_arena_region,
                arenas::get_all_arenas,
                arenas::get_arena,
                arenas::add_arena,
                arenas::update_arena,
                types::new_type,
                types::get_types,
                attacks::new_attack,
                attacks::get_attack,
                attacks::get_attacks
            ])
        .mount("/api/login", routes![login::login])
        .manage(pool)
}
