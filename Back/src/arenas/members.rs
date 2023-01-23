use rocket::serde::json::Json;
use sqlx::{Error, Postgres, Pool};
use rocket::State;

use super::ArenaMember;

use crate::response::{ErrInfo, Response};
use crate::user::AuthStatus;

async fn get_one(pool: &Pool<Postgres>, id: i64) -> Result<ArenaMember, Error> {
    sqlx::query_as!(ArenaMember,
        r#"SELECT id as "id?", join_date as "join_date?", usr, score as "score?", arena
        FROM ArenaMembers WHERE id = $1"#, id
    ).fetch_one(pool).await
}

async fn get_all_user(pool: &Pool<Postgres>, usr: &str) -> Result<Vec<ArenaMember>, Error> {
    sqlx::query_as!(ArenaMember,
        r#"SELECT id as "id?", join_date as "join_date?", usr, score as "score?", arena
        FROM ArenaMembers WHERE usr = $1 ORDER BY score DESC"#, usr
    ).fetch_all(pool).await
}

async fn get_all_arena(pool: &Pool<Postgres>, arena: &str) -> Result<Vec<ArenaMember>, Error> {
    sqlx::query_as!(ArenaMember,
        r#"SELECT id as "id?", join_date as "join_date?", usr, score as "score?", arena
        FROM ArenaMembers WHERE arena = $1 ORDER BY score DESC"#, arena
    ).fetch_all(pool).await
}

async fn get_relative_arena(pool: &Pool<Postgres>, arena: &str) -> Result<Vec<ArenaMember>, Error> {
    sqlx::query_as!(ArenaMember,
        r#"SELECT id as "id?", join_date as "join_date?", usr, diff_leader(score, $1) as "score?", arena
        FROM ArenaMembers WHERE usr = $1 ORDER BY score DESC"#, arena
    ).fetch_all(pool).await
}

async fn add_one(pool: &Pool<Postgres>, member: &ArenaMember) -> Result<(), Error> {
    let mut transaction = pool.begin().await?;
    sqlx::query!("INSERT INTO ArenaMembers (usr, arena) \
        VALUES ($1, $2)", member.usr, member.arena
    ).execute(&mut transaction).await?;
    transaction.commit().await
}

#[post("/users/<login>/memberships/new", data = "<member>")]
pub async fn add_member(
    pool: &State<Pool<Postgres>>,
    auth: AuthStatus,
    login: &str,
    member: Json<ArenaMember>
) -> Response<()> {
    match auth {
        AuthStatus::Professor(name) |
        AuthStatus::Trainer(name) => {
            if name != login {
                Response::Unauthorized(())
            } else {
                match add_one(pool, &member.into_inner()).await {
                    Ok(()) => Response::Success(Some(())),
                    Err(e) => Response::BadRequest(Some(Json(ErrInfo::from(e))))
                }
            }
        }
        _ => Response::Unauthorized(())
    }
}

#[get("/arena_members/<id>")]
pub async fn get_one_member(
    pool: &State<Pool<Postgres>>,
    id: i64
) -> Response<Json<ArenaMember>> {
    match get_one(pool, id).await {
        Ok(member) => Response::Success(Some(Json(member))),
        Err(_) => Response::NotFound(None)
    }
}

#[get("/users/<login>/memberships")]
pub async fn get_memberships(
    pool: &State<Pool<Postgres>>,
    login: &str
) -> Response<Json<Vec<ArenaMember>>> {
    match get_all_user(pool, login).await {
        Ok(memberships) => Response::Success(Some(Json(memberships))),
        Err(_) => Response::NotFound(None)
    }
}

#[get("/arenas/<arena>/members")]
pub async fn get_members(
    pool: &State<Pool<Postgres>>,
    arena: &str
) -> Option<Json<Vec<ArenaMember>>> {
    match get_all_arena(pool, arena).await {
        Ok(members) => Some(Json(members)),
        Err(_) => None
    }
}

#[get("/arenas/<arena>/members_relative")]
pub async fn get_members_relative(
    pool: &State<Pool<Postgres>>,
    arena: &str
) -> Option<Json<Vec<ArenaMember>>> {
    match get_relative_arena(pool, arena).await {
        Ok(members) => Some(Json(members)),
        Err(_) => None
    }
}
