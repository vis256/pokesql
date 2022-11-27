use std::env;

use rocket::State;
use rocket::response::status;
use rocket::form::{FromForm, Form};
use rocket::serde::{Serialize, Deserialize};

use sqlx::{Pool, Postgres};

use jwt::{Header, Token, SignWithKey, VerifyWithKey};

use hmac::{Mac, Hmac};
use sha2::Sha256;

const DEFAULT_TOKEN_KEY: &str = "fgSNhNGCPvQwjqA2cm6YsCx8nYJfmVgTLMdumgX34aOvqOBfLPVV1N8c71hA";

#[derive(FromForm)]
pub struct LoginCredentials {
    login: String,
    password: String
}

#[derive(Serialize, Deserialize)]
struct TokenClaims {
    login: String,
    proffesor: bool
}

#[post("/", data = "<form>")]
pub async fn login(
    pool: &State<Pool<Postgres>>,
    form: Form<LoginCredentials>
) -> Result<String, status::NotFound<&'static str>> {
    if let Ok(r) = sqlx::query!(
        "SELECT is_proffesor AS prof FROM Users WHERE login = $1 AND password = $2",
        form.login, form.password
    ).fetch_one(&**pool).await {
        let unsigned_token = Token::new(
            Header{ ..Default::default() },
            TokenClaims {
                login: String::from(&form.login),
                proffesor: r.prof
            });
        let key = Hmac::<Sha256>::new_from_slice(
            env::var("TOKEN_KEY")
                .unwrap_or(String::from(DEFAULT_TOKEN_KEY))
                .as_bytes()
        ).unwrap();
        let signed_token = unsigned_token.sign_with_key(&key).unwrap();
        Ok(signed_token.into())
    } else {
        Err(status::NotFound("Username or password is incorrect"))
    }
}

// TODO: this could probably be an attribute macro
pub fn authorize_user<const PROFFESOR: bool>(token: &str) -> anyhow::Result<bool> {
    let key: Hmac<Sha256> = Hmac::new_from_slice(
        env::var("TOKEN_KEY")
            .unwrap_or(String::from(DEFAULT_TOKEN_KEY))
            .as_bytes()
    )?;
    let token: Token<Header, TokenClaims, _> =
        VerifyWithKey::verify_with_key(token, &key)?;
    let (_, claims) = token.into();
    Ok(claims.proffesor || !PROFFESOR)
}
