use common::error::AppError;
use web_sys::HtmlInputElement;
use yew::prelude::*;
use yew_hooks::{use_async, use_mount};
use yew_router::prelude::*;

use crate::{
    components::{blank_page::BlankPage, list_errors::ListErrors, pwd::Pwd},
    css::*,
    hooks::use_user_context,
    i18n::Locale,
    model::{RegisterInfo, RegisterInfoWrapper},
    routes::AppRoute,
    services,
};

#[derive(Properties, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub id: AttrValue,
}

#[function_component(RegisterWithId)]
pub fn register_with_id(props: &Props) -> Html {
    let user_ctx = use_user_context();
    let register_info = use_state(RegisterInfo::default);
    let user_register = {
        let register_info = register_info.clone();
        use_async(async move {
            let request = RegisterInfoWrapper {
                user: (*register_info).clone(),
            };
            services::register(request).await
        })
    };

    let signup_confirmation = {
        let id = props.id.clone();
        use_async(async move {
            services::get_signup_link_details(id.as_str())
                .await
                .map(|wrapper| wrapper.confirmation)
        })
    };

    {
        let signup_confirmation = signup_confirmation.clone();
        use_mount(move || signup_confirmation.run());
    }

    {
        let register_info = register_info.clone();
        use_effect_with_deps(
            move |confirmation| {
                let mut info = (*register_info).clone();
                confirmation.data.iter().for_each(|c| {
                    info.email = c.email.clone();
                    info.confirmation_id = c.id.clone();
                });
                register_info.set(info);
                || ()
            },
            signup_confirmation.clone(),
        );
    }

    // Hook into changes of user_register. Once a user is successfully registered, log him in
    use_effect_with_deps(
        move |user_register| {
            if let Some(user_info) = &user_register.data {
                user_ctx.login(user_info.user.clone());
            }
            || ()
        },
        user_register.clone(),
    );

    let onsubmit = {
        let user_register = user_register.clone();
        Callback::from(move |e: SubmitEvent| {
            e.prevent_default(); /* Prevent event propagation */
            user_register.run();
        })
    };
    let oninput_name = {
        let register_info = register_info.clone();
        Callback::from(move |e: InputEvent| {
            let input: HtmlInputElement = e.target_unchecked_into();
            let mut info = (*register_info).clone();
            info.name = input.value().trim().to_string();
            register_info.set(info);
        })
    };
    let oninput_password = {
        let register_info = register_info.clone();
        Callback::from(move |pwd: String| {
            let mut info = (*register_info).clone();
            info.password = pwd;
            register_info.set(info);
        })
    };

    let error_formatter = {
        Callback::from(move |err| match err {
            AppError::NotFound => Some(Locale::current().invalid_signup_link()),
            _ => None,
        })
    };

    html! {
        <BlankPage header_label={ Locale::current().register() } loading={ user_register.loading }>
            <ListErrors error={signup_confirmation.error.clone()} error_formatter={ error_formatter.clone() } />
            <ListErrors error={user_register.error.clone()} error_formatter={ error_formatter.clone() } />
            if signup_confirmation.error.is_none() {
                <form {onsubmit}>
                    <div class={ BODY_DIV_CSS }>
                        <div class="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                class={ INPUT_CSS }
                                value={ register_info.email.clone() }
                                disabled=true
                                required = true
                                />
                            <label for="email"
                                class={ INPUT_LABEL_CSS }>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 px-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
</svg>
{ format!(" {}", Locale::current().email_address()) }
                            </label>
                        </div>
                        <div class="relative">
                            <input
                                id="name"
                                type="text"
                                placeholder="Name"
                                pattern="^[^\\s].*"
                                class={ INPUT_CSS }
                                value={ register_info.name.clone() }
                                oninput={ oninput_name }
                                required = true
                                minlength="3"
                                maxlength="256"
                                />
                            <label for="name"
                                class={ INPUT_LABEL_CSS }>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 px-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
</svg>
{ format!(" {}", Locale::current().name()) }
                            </label>
                        </div>
                        <Pwd onchange={ oninput_password }/>
                        <div class="relative flex justify-between sm:text-base">
                            <Link<AppRoute>
                                classes={ LINK_CSS }
                                to={AppRoute::Login}>{ Locale::current().have_an_account() }
                            </Link<AppRoute>>
                        </div>
                        <div class="relative">
                            <button class={ SUBMIT_BTN_CSS }>{ Locale::current().sign_up() }</button>
                        </div>
                    </div>
                </form>
            }
        </BlankPage>
    }
}
