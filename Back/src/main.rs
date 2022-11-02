#[macro_use] extern crate rocket;

use std::env;

use rocket::form::{FromForm, Form};
use rocket::{State, Ignite, Rocket};
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};

#[derive(Debug)]
struct Queerwa {
    pub test: Option<i32>
}

impl Queerwa {
    pub async fn get_all(pool: &Pool<Postgres>) -> anyhow::Result<Queerwa> {
        let user = sqlx::query_as!(Queerwa, "SELECT * FROM tabels").fetch_one(&*pool).await?;
        Ok(user)
    }
}

#[derive(FromForm)]
struct LoginForm<'a> {
    login: Option<&'a str>,
    password: Option<&'a str>
}

#[post("/", data = "<form>")]
async fn login(_pool: &State<Pool<Postgres>>, form: Form<LoginForm<'_>>) -> String {
    format!(
        "login: {} password: {}",
        form.login.unwrap_or(""),
        form.password.unwrap_or(""))
}

// Try visiting:
//   http://127.0.0.1:8000/hello/world
#[get("/")]
async fn world(_pool: &State<Pool<Postgres>>) -> String {
    String::from("Hello, world!")
}

#[get("/table")]
async fn table(pool: &State<Pool<Postgres>>) -> String {
    format!("Got {:?}", Queerwa::get_all(&pool).await.unwrap())
}

#[rocket::main]
async fn main() -> anyhow::Result<()> {
    let database_url = env::var("DATABASE_URL")?;

    let pool = PgPoolOptions::new()
        .max_connections(16)
        .connect(&database_url)
        .await?;

    rocket::build()
        .mount("/", routes![world, table])
        .mount("/hello", routes![world])
        .mount("login", routes![login])
        .manage(pool)
        .ignite()
        .await?;

    Ok(())
}

