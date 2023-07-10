use crate::{css::*, model::ConfirmationType};
use common::error::AppError;
use web_sys::HtmlInputElement;
use yew::prelude::*;
use yew_hooks::prelude::*;
use yew_router::prelude::*;

use crate::{
    components::{blank_page::BlankPage, list_errors::ListErrors},
    i18n::*,
    model::SendConfirmationLink,
    services, AppRoute,
};

#[derive(Properties, PartialEq)]
pub struct Props {
    pub confirmation_type: ConfirmationType,
}

#[function_component(Confirmation)]
pub fn confirmation(props: &Props) -> Html {
    let signup_email = use_state(|| "".to_string());
    let email_sent = use_bool_toggle(false);

    let oninput_signup_email = {
        let signup_email = signup_email.clone();
        Callback::from(move |e: InputEvent| {
            let input: HtmlInputElement = e.target_unchecked_into();
            signup_email.set(input.value());
        })
    };

    let send_signup_email = {
        let signup_email = signup_email.clone();
        let email_sent = email_sent.clone();
        let confirmation_type = props.confirmation_type.clone();
        use_async(async move {
            email_sent.toggle();
            services::send_confirmation_link(SendConfirmationLink {
                email: (*signup_email).clone(),
                confirmation_type,
            })
            .await
        })
    };

    let onsubmit_signup = {
        let send_signup_email = send_signup_email.clone();
        Callback::from(move |e: SubmitEvent| {
            e.prevent_default(); /* Prevent event propagation */
            send_signup_email.run();
        })
    };

    let error_formatter = {
        let email = signup_email.clone();
        let confirm_type = props.confirmation_type.clone();
        Callback::from(move |err| match err {
            AppError::UnprocessableEntity(err)
                if err
                    .iter()
                    .find(|s| s.ends_with("already exists."))
                    .is_some() =>
            {
                Some(match confirm_type {
                    ConfirmationType::PasswordReset => unreachable!(),
                    ConfirmationType::Registration => {
                        Locale::current().user_already_exists(Email(&*email))
                    }
                })
            }
            _ => None,
        })
    };

    let (header_label, email_sent_label, submit_label) = match props.confirmation_type {
        ConfirmationType::PasswordReset => (
            Locale::current().password_reset(),
            Locale::current().reset_email_sent(),
            Locale::current().reset(),
        ),
        ConfirmationType::Registration => (
            Locale::current().register(),
            Locale::current().signup_email_sent(),
            Locale::current().sign_up(),
        ),
    };

    html! {
        <BlankPage {header_label}>
            <ListErrors error={send_signup_email.error.clone()} {error_formatter} />
            <form onsubmit={onsubmit_signup}>
                <div class={ BODY_DIV_CSS }>
                    if *email_sent && send_signup_email.error.is_none() {
                        <div class="relative">
                            <label>{ email_sent_label }</label>
                        </div>
                    } else {
                        <div class="relative">
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                class={ INPUT_CSS }
                                value={ (*signup_email).clone() }
                                oninput={ oninput_signup_email }
                                required = true
                                />
                            <label for="email"
                                class={ INPUT_LABEL_CSS }>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
</svg>
{ format!(" {}", Locale::current().email_address()) }
                            </label>
                        </div>
                        if props.confirmation_type == ConfirmationType::Registration {
                            <div class="relative flex justify-between sm:text-base">
                                <Link<AppRoute>
                                    classes={ LINK_CSS }
                                    to={AppRoute::Login}>{ Locale::current().have_an_account() }
                                </Link<AppRoute>>
                            </div>
                        }
                        <div class="relative">
                            <button class={ SUBMIT_BTN_CSS }>{ submit_label }</button>
                        </div>
                    }
                </div>
            </form>
        </BlankPage>
    }
}
