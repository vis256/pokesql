pub mod login;
pub mod register;
pub mod users;

use std::env;

use rocket::Request;
use rocket::request::{FromRequest, Outcome};
use rocket::serde::{Deserialize, Serialize};
use rocket::http::Status;

use jwt::{Header, Token, VerifyWithKey};

use hmac::{Mac, Hmac};

use sha2::Sha256;

#[derive(Serialize, Deserialize)]
pub struct User {
    login: String,
    password: String,
    username: String,
    is_professor: bool
}

#[derive(Serialize, Deserialize)]
pub struct UserInfo {
    login: String,
    username: String,
    is_professor: bool
}

#[derive(Debug)]
pub enum ApiKeyError {
    Missing,
    Invalid,
    InternalError,
}

pub enum AuthStatus {
    Professor(String),
    Trainer(String),
    Unauthorized,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for AuthStatus {
    type Error = ApiKeyError;
    async fn from_request(req: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        match req.headers().get_one("authorization") {
            Some(token) => {
                let key: Hmac<Sha256> = Hmac::new_from_slice(
                    env::var("TOKEN_KEY")
                        .unwrap_or(String::from(DEFAULT_TOKEN_KEY))
                        .as_bytes()
                ).unwrap();
                let tkn: Token<Header, TokenClaims, _> = if let Ok(t) = VerifyWithKey::verify_with_key(token, &key) {
                    t
                } else {
                    return Outcome::Success(Self::Unauthorized);
                };
                let (_, claims) = tkn.into();
                if claims.professor {
                    Outcome::Success(Self::Professor(claims.login))
                } else {
                    Outcome::Success(Self::Trainer(claims.login))
                }
            }
            None => Outcome::Failure((Status::BadRequest, ApiKeyError::Missing)),
        }
    }
}

pub(super) const DEFAULT_TOKEN_KEY: &str = "fgSNhNGCPvQwjqA2cm6YsCx8nYJfmVgTLMdumgX34aOvqOBfLPVV1N8c71hA";

#[derive(Serialize, Deserialize)]
struct TokenClaims {
    login: String,
    professor: bool
}
