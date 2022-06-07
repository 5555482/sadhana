use actix_web::{
    web::{block, Data, Json},
    Result,
};
use errors::Error;

use db::{get_conn, models::User, PgPool};

pub async fn get_all(pool: Data<PgPool>) -> Result<Json<Vec<User>>, Error> {
    let connection = get_conn(&pool)?;

    let res = block(move || User::get_all(&connection)).await?;
    let users = res?;

    Ok(Json(users))
}

#[cfg(test)]
mod tests {
    use crate::test_helpers;
    use db::{
        get_conn,
        models::{NewUser, User},
        new_pool,
        schema::users,
    };
    use diesel::RunQueryDsl;

    #[actix_rt::test]
    async fn test_get_all_returns_users() {
        let pool = new_pool();
        let conn = get_conn(&pool).unwrap();

        diesel::insert_into(users::table)
            .values(NewUser {
                email: "dummy@gmail.com".to_string(),
                hash: "abcde".to_string(),
                name: "dummy".to_string(),
            })
            .execute(&conn)
            .unwrap();

        let res: (u16, Vec<User>) = test_helpers::test_get("/api/users").await;
        assert_eq!(res.0, 200);
        assert_eq!(res.1.len(), 1);
        assert_eq!(res.1[0].email, "dummy@gmail.com");

        diesel::delete(users::dsl::users).execute(&conn).unwrap();
    }
}
