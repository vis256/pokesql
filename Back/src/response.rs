use rocket::Responder;
use rocket::serde::json::Json;
use rocket::serde::Serialize;

use sqlx::Error;

#[derive(Responder)]
pub enum Response<U> {
    #[response(status = 200)]
    Success(Option<U>),
    #[response(status = 400)]
    BadRequest(Option<Json<ErrInfo>>),
    #[response(status = 401)]
    Unauthorized(()),
    #[response(status = 404)]
    NotFound(Option<Json<ErrInfo>>),
}

#[derive(Serialize)]
pub struct ErrInfo {
    column: Option<String>,
    constraint: Option<String>,
    message: Option<String>
}

impl From<Error> for ErrInfo {
    fn from(err: Error) -> Self {
        if let Some(db_err) = err.as_database_error() {
            let pg_err = db_err.try_downcast_ref::<sqlx::postgres::PgDatabaseError>().unwrap();
            ErrInfo {
                column: pg_err.column().map(ToOwned::to_owned),
                constraint: pg_err.constraint().map(ToOwned::to_owned),
                message: Some(String::from(pg_err.message())),
            }
        } else {
            ErrInfo {
                column: None,
                constraint: None,
                message: Some(err.to_string())
            }
        }
    }
}
