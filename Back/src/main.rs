#[macro_use] extern crate rocket;
#[cfg(test)] mod tests;

use rocket::form::{FromForm, Form};

#[derive(FromForm)]
struct LoginForm<'r> {
    login: Option<&'r str>,
    password: Option<&'r str>
}

#[post("/", data = "<form>")]
fn login(form: Form<LoginForm>) -> String {
    format!(
        "login: {} password: {}",
        form.login.unwrap_or(""),
        form.password.unwrap_or(""))
}

// Try visiting:
//   http://127.0.0.1:8000/hello/world
#[get("/")]
fn world() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .mount("/", routes![world, login])
        .mount("/hello", routes![world])
}

