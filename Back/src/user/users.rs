use rocket::State;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use super::UserInfo;
use crate::response::{ErrInfo, Response};

pub async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<UserInfo>, Error> {
    sqlx::query_as!(UserInfo,
        "SELECT username, login, is_professor FROM Users"
    ).fetch_all(pool).await
}

pub async fn get_one(pool: &Pool<Postgres>, login: &str) -> Result<UserInfo, Error> {
    sqlx::query_as!(UserInfo,
        "SELECT username, login, is_professor \
        FROM Users WHERE login = $1", login
    ).fetch_one(pool).await
}

#[get("/users/<login>")]
pub async fn get_user(
    pool: &State<Pool<Postgres>>,
    login: &str
) -> Response<Json<UserInfo>> {
    match get_one(pool, login).await {
        Ok(entry) => Response::Success(Some(Json(entry))),
        Err(e) => {
            if let Error::RowNotFound = e {
                Response::NotFound(
                    Some(Json(ErrInfo::from(e))))
            } else {
                Response::BadRequest(
                    Some(Json(ErrInfo::from(e))))
            }
        }
    }
}

#[get("/users")]
pub async fn get_users(
    pool: &State<Pool<Postgres>>,
) -> Response<Json<Vec<UserInfo>>> {
    match get_all(pool).await {
        Ok(entries) => Response::Success(Some(Json(entries))),
        Err(e) => Response::BadRequest(
            Some(Json(ErrInfo::from(e))))
    }
}
