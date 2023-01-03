mod pokemon;

use serde::{Deserialize, Serialize};

pub use pokemon::*;

#[derive(Serialize, Deserialize)]
pub struct Pokemon {
    id: Option<i64>,
    name: String,
    level: i16,
    sex: bool,
    pokedex_num: i32,
    pokeball: String,
    owner: String
}
