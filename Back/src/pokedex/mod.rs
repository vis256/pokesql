mod pokedex;

use rocket::serde::{Deserialize, Serialize};

pub use pokedex::*;

#[derive(Serialize, Deserialize)]
pub struct PokedexEntry {
    number: i32,
    name: String,
    min_level: i16,
    primary_type: String,
    secondary_type: Option<String>,
    region: String
}
