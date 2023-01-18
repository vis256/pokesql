use rocket::State;
use rocket::serde::json::Json;

use sqlx::{Error, Postgres, Pool};
use sqlx::types::chrono::NaiveDate;
use rocket::serde::{Serialize, Deserialize};

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

#[derive(Serialize, Deserialize)]
pub struct Duel {
    id: Option<i64>,
    duel_date: Option<NaiveDate>,
    winner: bool,
    user1: i64,
    user2: i64,
    pokemon1: i64,
    pokemon2: i64,
    arena: String
}

async fn user_duels(
    pool: &Pool<Postgres>,
    id: i64
) -> Result<Vec<Duel>, Error> {
    sqlx::query_as!(
        Duel, r#"SELECT id as "id?", duel_date as "duel_date?", winner,
        user1, user2, pokemon1, pokemon2, arena FROM Duels
            WHERE user1 = $1 OR user2 = $1"#, id)
        .fetch_all(pool).await
}

async fn pokemon_duels(
    pool: &Pool<Postgres>,
    id: i64
) -> Result<Vec<Duel>, Error> {
    sqlx::query_as!(
        Duel, r#"SELECT id as "id?", duel_date as "duel_date?", winner,
        user1, user2, pokemon1, pokemon2, arena FROM Duels
            WHERE pokemon1 = $1 OR pokemon2 = $1"#, id)
        .fetch_all(pool).await
}

async fn add_duel(
    pool: &Pool<Postgres>,
    duel: &Duel
) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!(
        r#"INSERT INTO Duels (winner, user1, user2, pokemon1, pokemon2, arena)
            VALUES($1, $2, $3, $4, $5, $6)"#, duel.winner, duel.user1, duel.user2,
            duel.pokemon1, duel.pokemon2, duel.arena).execute(&mut transaction).await?;
    transaction.commit().await
}

#[get("/users/<id>/duels")]
pub async fn get_user_duels(
    pool: &State<Pool<Postgres>>,
    id: i64
) -> Option<Json<Vec<Duel>>> {
    match user_duels(pool, id).await {
        Ok(duels) => Some(Json(duels)),
        Err(_) => None,
    }
}

#[get("/pokemons/<id>/duels")]
pub async fn get_pokemon_duels(
    pool: &State<Pool<Postgres>>,
    id: i64
) -> Option<Json<Vec<Duel>>> {
    match pokemon_duels(pool, id).await {
        Ok(duels) => Some(Json(duels)),
        Err(_) => None,
    }
}

#[post("/duels/new", data = "<duel>")]
pub async fn new_duel(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    duel: Json<Duel>
) -> Response<()> {
    let d = duel.into_inner();
    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            let id_ = sqlx::query!(
                r#"SELECT id FROM ArenaMembers WHERE usr = $1 AND arena = $2"#,
                name, d.arena).fetch_one(&**pool).await.unwrap().id;
            if id_ == d.user1 || id_ == d.user2 {
                if let Err(e) = add_duel(pool, &d).await {
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
