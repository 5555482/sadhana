use actix_web::{
    web::{block, Data, Json},
    Result,
};
use errors::Error;
use serde::{Deserialize, Serialize};
// use validator::{Validate, ValidationError};

use db::{
    get_conn,
    models::{NewUser, User},
    PgPool,
};

#[derive(Clone, Deserialize, Serialize)]
pub struct CreateUserRequest {
    // #[validate(length(min = "3"))]
    name: String,
    // #[validate(email)]
    email: String,
    // #[validate(length(min = "5"))]
    pwd_hash: String,
}

pub async fn create(
    pool: Data<PgPool>,
    params: Json<CreateUserRequest>,
) -> Result<Json<User>, Error> {
    // validate(&params)?;

    let connection = get_conn(&pool)?;

    let res = block(move || {
        User::create(
            &connection,
            NewUser {
                name: params.name.clone(),
                email: params.email.clone(),
                pwd_hash: params.pwd_hash.clone(),
            },
        )
    })
    .await?;
    let user = res?;

    Ok(Json(user))
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
    pub async fn test_create_user() {
        let pool = new_pool();
        let conn = get_conn(&pool).unwrap();

        let res: (u16, User) = test_helpers::test_post(
            "/api/users",
            NewUser {
                name: "X Yz".into(),
                email: "xyz@gmail.com".into(),
                pwd_hash: "abcdef".into(),
            },
        )
        .await;

        assert_eq!(res.0, 200);
        assert_eq!(res.1.email, "xyz@gmail.com");

        let result_users = users::dsl::users.load::<User>(&conn).unwrap();
        assert_eq!(result_users.len(), 1);
        assert_eq!(result_users[0].email, "xyz@gmail.com");

        diesel::delete(users::dsl::users).execute(&conn).unwrap();
    }
}
