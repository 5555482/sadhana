use common::error::AppError;
use web_sys::HtmlInputElement;
use yew::prelude::*;
use yew_hooks::prelude::*;
use yew_router::prelude::*;

use crate::{
    components::{blank_page::BlankPage, list_errors::ListErrors},
    css::*,
    hooks::use_user_context,
    i18n::*,
    model::*,
    services, BaseRoute,
};

#[function_component(Login)]
pub fn login() -> Html {
    let user_ctx = use_user_context();
    let login_info = use_state(|| LoginInfo::default());
    let user_login = {
        let login_info = login_info.clone();
        use_async(async move {
            let request = LoginInfoWrapper {
                user: (*login_info).clone(),
            };
            services::login(request).await
        })
    };

    /* Hook into changes of user_login */
    use_effect_with_deps(
        move |user_login| {
            if let Some(user_info) = &user_login.data {
                user_ctx.login(user_info.user.clone());
            }
            || ()
        },
        user_login.clone(),
    );

    let onsubmit = {
        let user_login = user_login.clone();
        Callback::from(move |e: SubmitEvent| {
            e.prevent_default(); /* Prevent event propagation */
            user_login.run();
        })
    };

    let oninput_email = {
        let login_info = login_info.clone();
        Callback::from(move |e: InputEvent| {
            e.prevent_default();
            let input: HtmlInputElement = e.target_unchecked_into();
            let mut info = (*login_info).clone();
            info.email = input.value();
            login_info.set(info);
        })
    };

    let oninput_password = {
        let login_info = login_info.clone();
        Callback::from(move |e: InputEvent| {
            e.prevent_default();
            let input: HtmlInputElement = e.target_unchecked_into();
            let mut info = (*login_info).clone();
            info.password = input.value();
            login_info.set(info);
        })
    };

    let error_formatter = {
        let login_info = login_info.clone();
        Callback::from(move |err| match err {
            AppError::NotFound => Some(Locale::current().login_not_found(Email(&login_info.email))),
            _ => None,
        })
    };

    html! {
        <BlankPage header_label={ Locale::current().login() } loading={ user_login.loading }>
            <ListErrors error={ user_login.error.clone() } error_formatter={ error_formatter }
            />
            <form {onsubmit}>
                <div class={ BODY_DIV_CSS }>
                    <div class="relative">
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            value={login_info.email.clone()}
                            oninput={oninput_email}
                            class={ INPUT_CSS }
                            required = true
                            />
                        <label for="email" class={ INPUT_LABEL_CSS }>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      { format!(" {}", Locale::current().email_address()) }
                        </label>
                    </div>
                    <div class="relative">
                        <input
                            autocomplete="off"
                            id="password"
                            type="password"
                            placeholder="Password"
                            class={ INPUT_CSS }
                            value={login_info.password.clone()}
                            oninput={oninput_password}
                            required = true
                            />
                        <label for="password"
                            class={ INPUT_LABEL_CSS }>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
</svg>
{ format!(" {}", Locale::current().password()) }
                        </label>
                    </div>
                    <div class="relative">
                        <button class={ SUBMIT_BTN_CSS }>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
</svg>
{ format!(" {}", Locale::current().sign_in()) }</button>
                    </div>
                    <div class={ LINKS_CSS }>
                        <Link<BaseRoute>
                            classes={ LINK_CSS }
                            to={BaseRoute::PasswordReset}>{ Locale::current().forgot_password() }
                        </Link<BaseRoute>>
                        <Link<BaseRoute>
                            classes={ LINK_CSS_NEW_ACC }
                            to={BaseRoute::Register}>{ Locale::current().need_an_account() }
                        </Link<BaseRoute>>
                    </div>
                </div>
            </form>
        </BlankPage>
    }
}
