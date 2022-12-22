mod pokemon;

use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Pokemon {
    id: i64,
    name: String,
    level: i16,
    sex: bool,
    pokedex_num: i32,
    pokeball: String,
}
