mod pokemon;

use serde::{Deserialize, Serialize};

pub use pokemon::*;

#[derive(Debug, Serialize, Deserialize)]
pub struct Pokemon {
    #[serde(skip_serializing_if = "Option::is_none")]
    id: Option<i64>,
    name: String,
    level: i16,
    sex: bool,
    pokedex_num: i32,
    pokeball: String,
    owner: String
}

#[derive(Deserialize)]
pub struct PokemonAttack {
    pokemon_id: i64,
    attack: String
}
