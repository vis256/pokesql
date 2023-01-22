#[macro_use] extern crate rocket;

mod user;
mod pokedex;
mod pokemon;
mod response;
mod pokeballs;
mod arenas;
mod attacks;
mod types;

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
                pokedex::pokedex_update,
                pokedex::get_pokedex_attacks,
                pokedex::attack_pokedex,
                pokedex::new_pokedex_attack,
                pokedex::get_pokedex_pokeballs,
                pokedex::get_pokeball_pokedex,
                pokedex::add_pokedex_pokeball,
                pokedex::del_pokedex_entry,
                pokedex::del_attack,
                pokedex::del_pokeball,
                pokemon::user_new_pokemon,
                pokemon::user_pokemons_get,
                pokemon::pokemon_attacks,
                pokemon::new_attack,
                pokemon::get_pokemon,
                pokemon::update_pokemon,
                pokemon::del_attack,
                pokeballs::get_pokeballs,
                pokeballs::get_pokeball,
                pokeballs::add_pokeball,
                pokeballs::update_pokeball,
                pokeballs::del_pokeball,
                users::get_users,
                users::get_user,
                users::update_user,
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
                types::update_type,
                types::del_type,
                attacks::new_attack,
                attacks::get_attack,
                attacks::get_attacks,
                attacks::del_attack,
                attacks::update_attack,
                types::counters::get_counters_worse,
                types::counters::get_counters_better,
                types::counters::add_counter,
                types::counters::delete_counter,
                arenas::duels::get_user_duels,
                arenas::duels::get_pokemon_duels,
                arenas::duels::new_duel

            ])
        .mount("/api/login", routes![login::login])
        .manage(pool)
}
