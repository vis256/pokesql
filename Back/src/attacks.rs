use rocket::serde::{Serialize, Deserialize};
use rocket::State;
use rocket::serde::json::Json;

use sqlx::{Pool, Postgres, Error};
use sqlx::types::BigDecimal;

use crate::user::AuthStatus;
use crate::response::{Response, ErrInfo};

#[derive(Serialize, Deserialize)]
pub struct Attack {
    pub name: String,
    pub power: i32,
    pub hit_chance: BigDecimal,
    #[serde(alias = "type")]
    pub type_: String
}

async fn get_all(pool: &Pool<Postgres>) -> Result<Vec<Attack>, Error> {
    sqlx::query_as!(Attack, "SELECT name, power, hit_chance, type as type_ FROM Attacks").fetch_all(pool).await
}

async fn get_one(pool: &Pool<Postgres>, name: &str) -> Result<Attack, Error> {
    sqlx::query_as!(Attack, "SELECT name, power, hit_chance, type as type_ FROM Attacks WHERE name = $1", name).fetch_one(pool).await
}

async fn add_one(pool: &Pool<Postgres>, attack: &Attack) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "INSERT INTO Attacks(name, power, hit_chance, type) VALUES ($1, $2, $3, $4)",
        attack.name, attack.power, attack.hit_chance, attack.type_).execute(&mut transaction).await?;
    transaction.commit().await
}

async fn update_one(
    pool: &Pool<Postgres>,
    name: &str,
    attack: &Attack
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "UPDATE Attacks SET name = $1, power = $2, hit_chance = $3, type = $4 WHERE name = $5",
        attack.name, attack.power, attack.hit_chance, attack.type_, name).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/attacks/<name>/update", data = "<atk>")]
pub async fn update_attack(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    name: &str,
    atk: Json<Attack>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = update_one(pool, name, &atk.into_inner()).await {
                if let Error::RowNotFound = e {
                    Response::NotFound(Some(Json(ErrInfo::from(e))))
                } else {
                    Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Success(Some(()))
            }
        }
        _ => Response::Unauthorized(())
    }
}

async fn delete_one(
    pool: &Pool<Postgres>,
    name: &str
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        "DELETE FROM Attacks WHERE name = $1", name
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/attacks")]
pub async fn get_attacks(pool: &State<Pool<Postgres>>) -> Json<Vec<Attack>> {
    Json(get_all(pool).await.unwrap())
}

#[get("/attacks/<name>")]
pub async fn get_attack(pool: &State<Pool<Postgres>>, name: &str) -> Option<Json<Attack>> {
    match get_one(pool, name).await {
        Ok(attack) => Some(Json(attack)),
        Err(_) => None
    }
}

#[get("/attack/<name>/delete")]
pub async fn del_attack(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    name: &str
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            if let Err(e) = delete_one(pool, name).await {
                if let Error::RowNotFound = e {
                    Response::NotFound(Some(Json(ErrInfo::from(e))))
                } else {
                    Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            } else {
                Response::Success(Some(()))
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[post("/attack/new", data = "<attack>")]
pub async fn new_attack(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    attack: Json<Attack>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(_) => {
            match add_one(pool, &attack.into_inner()).await {
                Ok(()) => Response::Success(Some(())),
                Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
            }
        }
        _ => Response::Unauthorized(())
    }
}
