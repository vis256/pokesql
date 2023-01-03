use sqlx::{Pool, Postgres};

use rocket::State;
use rocket::serde::json::Json;

use super::User;

use crate::response::{ErrInfo, Response};

#[post("/register", data = "<entry>")]
pub async fn register(
    pool: &State<Pool<Postgres>>,
    entry: Json<User>
) -> Response<()> {
    let mut transaction = pool.begin().await.unwrap();
    let ent = entry.into_inner();
    match sqlx::query!(
        "INSERT INTO Users(login, password, username, is_professor)\
         VALUES ($1, $2, $3, $4)",
        ent.login, ent.password, ent.username, ent.is_professor
    ).execute(&mut transaction).await {
        Ok(_) => {
            transaction.commit().await.unwrap();
            Response::Success(None)
        },
        Err(e) => {
            transaction.rollback().await.unwrap();
            Response::BadRequest(
                Some(Json(ErrInfo::from(e))))
        }
    }
}
