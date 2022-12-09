use std::env;

use rocket::State;
use rocket::response::status;
use rocket::serde::Deserialize;
use rocket::serde::json::{Json, json, Value};

use sqlx::{Pool, Postgres};

use jwt::{Token, Header, SignWithKey};

use hmac::{Mac, Hmac};

use sha2::Sha256;

use super::{DEFAULT_TOKEN_KEY, TokenClaims};

#[derive(Deserialize)]
pub struct LoginCredentials {
    login: String,
    password: String
}

#[post("/", data = "<credentials>")]
pub async fn login(
    pool: &State<Pool<Postgres>>,
    credentials: Json<LoginCredentials>
) -> Result<Value, status::Unauthorized<&'static str>> {
    let cred = credentials.into_inner();
    if let Ok(r) = sqlx::query!(
        "SELECT is_professor AS prof FROM Users WHERE login = $1 AND password = $2",
        &cred.login, &cred.password
    ).fetch_one(&**pool).await {
        let unsigned_token = Token::new(
            Header{ ..Default::default() },
            TokenClaims {
                login: String::from(&cred.login),
                professor: r.prof
            });
        let key = Hmac::<Sha256>::new_from_slice(
            env::var("TOKEN_KEY")
                .unwrap_or(String::from(DEFAULT_TOKEN_KEY))
                .as_bytes()
        ).unwrap();
        let signed_token = unsigned_token.sign_with_key(&key).unwrap();
        Ok(json!({ "token": String::from(signed_token) }))
    } else {
        Err(status::Unauthorized(None))
    }
}
