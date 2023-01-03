use crate::{
    model::UserInfo,
    routes::AppRoute,
    services::{
        current,
        requests::{get_token, set_token},
    },
};
use common::error::AppError;
use yew::prelude::*;
use yew_hooks::prelude::*;
use yew_router::prelude::*;

#[derive(Properties, Clone, PartialEq)]
pub struct Props {
    pub children: Children,
}

#[function_component(UserContextProvider)]
pub fn user_context_provider(props: &Props) -> Html {
    let user_ctx = use_state(UserInfo::default);
    let current_user = use_async(async move { current().await });
    let navigator = use_navigator().unwrap();

    {
        /* On startup check if the user is already logged in from local storage. */
        let current_user = current_user.clone();
        let navigator = navigator.clone();
        use_mount(move || {
            if get_token().is_some() {
                log::debug!("Fetching current user info");
                current_user.run();
            } else {
                navigator.push(&AppRoute::Login);
            }
        });
    }

    {
        /* If local storage has a token either log the user in or show error if couldn't fetch user data. */
        let user_ctx = user_ctx.clone();
        let navigator = navigator.clone();
        use_effect_with_deps(
            move |current_user| {
                if let Some(user_info) = &current_user.data {
                    user_ctx.set(user_info.user.clone());
                }

                if let Some(error) = &current_user.error {
                    match error {
                        AppError::Unauthorized(_) | AppError::Forbidden => set_token(None),
                        _ => (),
                    }
                    navigator.push(&AppRoute::Login);
                }
                || ()
            },
            current_user,
        )
    }

    html! {
        <ContextProvider<UseStateHandle<UserInfo>> context={user_ctx}>
            { for props.children.iter() }
        </ContextProvider<UseStateHandle<UserInfo>>>
    }
}
