
#[macro_use] extern crate rocket;
#[cfg(test)] mod tests;

#[derive(FromForm)]
struct Options<'r> {
    emoji: bool,
    name: Option<&'r str>,
}

// Try visiting:
//   http://127.0.0.1:8000/hello/world
#[get("/")]
fn world() -> &'static str {
    "Hello, world!"
}

#[launch]
fn rocket() -> _{
    rocket::build()
        .mount("/", routes![world])
        .mount("/hello", routes![world])
}
