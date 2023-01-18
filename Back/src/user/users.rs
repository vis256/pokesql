use rocket::State;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};

use super::UserInfo;
use super::User;

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

pub async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<UserInfo>, Error> {
    sqlx::query_as!(UserInfo,
        "SELECT username, login, is_professor FROM Users"
    ).fetch_all(pool).await
}

pub async fn update_one(
    pool: &Pool<Postgres>,
    login: &str,
    user: &User
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"UPDATE Users SET
            password = $1,
            username = $2,
            is_professor = $3 WHERE login = $4"#,
        user.password, user.username, user.is_professor, login
    ).execute(&mut transaction).await?;
    transaction.commit().await
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
                Response::NotFound(None)
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

#[post("/users/<login>/update", data = "<user>")]
pub async fn update_user(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    login: &str,
    user: Json<User>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            if name == login {
                if let Err(e) = update_one(pool, login, &user.into_inner()).await {
                    if let Error::RowNotFound = e {
                        Response::NotFound(Some(Json(ErrInfo::from(e))))
                    } else {
                        Response::BadRequest(Some(Json(ErrInfo::from(e))))
                    }
                } else {
                    Response::Success(Some(()))
                }
            } else {
                Response::Unauthorized(())
            }
        }
        _ => Response::Unauthorized(())
    }
}
