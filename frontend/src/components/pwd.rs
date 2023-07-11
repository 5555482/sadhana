use crate::{css::*, i18n::Locale};
use web_sys::HtmlInputElement;
use yew::prelude::*;

#[derive(Properties, PartialEq)]
pub struct Props {
    pub onchange: Callback<String>,
    #[prop_or(false)]
    pub readonly: bool,
    #[prop_or(true)]
    pub required: bool,
}

#[function_component(Pwd)]
pub fn pwd(props: &Props) -> Html {
    let new_pwd = use_state(|| String::default());
    let confirm_pwd = use_state(|| String::default());

    let confirm_pwd_html = use_mut_ref(|| None);

    let onfocus = {
        let confirm_pwd_html = confirm_pwd_html.clone();
        Callback::from(move |e: FocusEvent| {
            let target: HtmlInputElement = e.target_unchecked_into();
            if confirm_pwd_html.borrow().is_none() {
                *confirm_pwd_html.borrow_mut() = Some(target);
            }
        })
    };

    let oninput =
        |input_pwd: UseStateHandle<String>, confirm_pwd: UseStateHandle<String>, emit: bool| {
            let confirm_pwd_html = confirm_pwd_html.clone();
            let onchange = props.onchange.clone();
            Callback::from(move |e: InputEvent| {
                let target: HtmlInputElement = e.target_unchecked_into();

                input_pwd.set(target.value());

                let validity = if target.value() == *confirm_pwd {
                    String::default()
                } else {
                    Locale::current().passwords_dont_match()
                };

                confirm_pwd_html
                    .borrow()
                    .iter()
                    .for_each(|html| html.set_custom_validity(&validity));

                if emit {
                    onchange.emit(target.value());
                }
            })
        };

    let new_pwd_oninput = oninput(new_pwd.clone(), confirm_pwd.clone(), true);
    let confirm_pwd_oninput = oninput(confirm_pwd.clone(), new_pwd.clone(), false);

    html! {
        <>
            <div class="relative">
                <input
                    id="new_pwd"
                    type="password"
                    placeholder="New Password"
                    class={ INPUT_CSS }
                    value={ (*new_pwd).clone() }
                    oninput={ new_pwd_oninput }
                    required={ props.required }
                    autocomplete="off"
                    minlength="5"
                    maxlength="256"
                    readonly={ props.readonly }
                    />
                    <label for="new_pwd" class={ INPUT_LABEL_CSS }>
                    <span class="absolute inset-y-0 left-0 flex items-center">
                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 px-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
</svg>
                    </button>
                  </span>
                  { format!(" {}", Locale::current().new_password()) }
                    </label>
            </div>
            <div class="relative">
                <input
                    id="confirm_pwd"
                    type="password"
                    placeholder="Confirm Password"
                    class={ INPUT_CSS }
                    oninput={ confirm_pwd_oninput }
                    { onfocus }
                    value={ (*confirm_pwd).clone() }
                    required={ props.required }
                    autocomplete="off"
                    minlength="5"
                    maxlength="256"
                    readonly={ props.readonly }
                    />
                    <label for="confirm_pwd" class={ INPUT_LABEL_CSS }>
                    <span class="absolute inset-y-0 left-0 flex items-center">
                    <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 px-5">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
</svg>
                    </button>
                  </span>
                  { format!(" {}", Locale::current().confirm_password()) }
                    </label>
            </div>
        </>
    }
}
