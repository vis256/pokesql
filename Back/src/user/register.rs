use sqlx::{Pool, Postgres};

use rocket::State;
use rocket::form::Form;
use rocket::response::status;

use super::User;

#[post("/register", data = "<form>")]
pub async fn register(
    pool: &State<Pool<Postgres>>,
    form: Form<User>
) -> Result<String, status::NotFound<String>> {
    if let Ok(mut transaction) = pool.begin().await {
        match sqlx::query!(
            "INSERT INTO Users(login, password, username, is_professor)\
             VALUES ($1, $2, $3, $4)",
            form.login, form.password, form.username, form.is_professor
        ).execute(&mut transaction).await {
            Ok(_) => {
                transaction.commit().await.map_err(|s| status::NotFound(s.to_string()))?;
                Ok("Ok".to_string())
            },
            Err(e) => {
                transaction.rollback().await.map_err(|s| status::NotFound(s.to_string()))?;
                Ok(e.to_string())
            }
        }
    } else {
        Ok(String::from("Could not create transaction"))
    }
}
