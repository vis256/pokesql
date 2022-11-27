pub mod login;
pub mod register;

use rocket::form::FromForm;
use rocket::serde::Serialize;

#[derive(FromForm)]
#[derive(Serialize)]
pub struct User {
    login: String,
    password: String,
    username: String,
    is_proffesor: bool
}
