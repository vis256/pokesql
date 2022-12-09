use sqlx::{Pool, Postgres};

use rocket::State;
use rocket::form::Form;
use rocket::response::status::BadRequest;

use super::User;

#[post("/register", data = "<form>")]
pub async fn register(
    pool: &State<Pool<Postgres>>,
    form: Form<User>
) -> Result<(), BadRequest<String>> {
    let mut transaction = pool.begin().await.unwrap();
    match sqlx::query!(
        "INSERT INTO Users(login, password, username, is_professor)\
         VALUES ($1, $2, $3, $4)",
        form.login, form.password, form.username, form.is_professor
    ).execute(&mut transaction).await {
        Ok(_) => {
            transaction.commit().await.unwrap();
            Ok(())
        },
        Err(e) => {
            transaction.rollback().await.unwrap();
            Err(BadRequest(Some(e.to_string())))
        }
    }
}
