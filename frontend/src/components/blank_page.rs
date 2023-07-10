use yew::{html::onclick::Event, prelude::*};
use yew_router::prelude::*;

use crate::{css::*, i18n::Locale, routes::AppRoute};

#[derive(Properties, Clone, PartialEq)]
pub struct Props {
    #[prop_or_default]
    pub header_label: Option<String>,
    #[prop_or_default]
    pub prev_link: Option<(String, AppRoute)>,
    #[prop_or_default]
    pub left_button: Option<HeaderButtonProps>,
    #[prop_or_default]
    pub right_button: Option<HeaderButtonProps>,
    #[prop_or(false)]
    pub loading: bool,
    #[prop_or(false)]
    pub show_footer: bool,
    pub children: Children,
}

#[derive(Clone, PartialEq)]
pub enum ButtonType {
    Button,
    Submit,
    Reset,
}
impl ButtonType {
    pub fn as_str(&self) -> &'static str {
        match self {
            ButtonType::Button => "button",
            ButtonType::Submit => "submit",
            ButtonType::Reset => "reset",
        }
    }
}

#[derive(Clone, PartialEq)]
pub struct HeaderButtonProps {
    label: String,
    icon_css: Option<String>,
    onclick: Callback<Event>,
    btn_type: ButtonType,
}

impl HeaderButtonProps {
    pub fn new<S: Into<String>>(
        label: S,
        onclick: Callback<Event>,
        icon_css: Option<String>,
        btn_type: ButtonType,
    ) -> Self {
        HeaderButtonProps {
            label: label.into(),
            icon_css,
            onclick,
            btn_type,
        }
    }

    pub fn edit(onclick: Callback<Event>) -> Self {
        Self::new(Locale::current().edit(), onclick, None, ButtonType::Button)
    }

    pub fn submit<S: Into<String>>(label: S) -> Self {
        Self::new(label.into(), Callback::default(), None, ButtonType::Submit)
    }

    pub fn reset<S: Into<String>>(label: S) -> Self {
        Self::new(label.into(), Callback::default(), None, ButtonType::Reset)
    }

    pub fn blank() -> Self {
        Self::new("", Callback::default(), None, ButtonType::Button)
    }
}

fn header_button(props: &Option<HeaderButtonProps>) -> Html {
    if let Some(ref rb) = props {
        html! {
            <span class="text-zinc-500 ">
                <button type={ rb.btn_type.as_str() } class={ LINK_CSS } onclick={ rb.onclick.clone() }>
                    <i class={ format!(" {}", rb.icon_css.to_owned().unwrap_or_default()) }></i>
                    { &rb.label }
                </button>
            </span>
        }
    } else {
        html! {}
    }
}

#[function_component(BlankPage)]
pub fn blank_page(props: &Props) -> Html {
    html! {
        <>
            <div class="bg-hero dark:bg-herod bg-no-repeat bg-cover bg-center h-screen w-full fixed -z-10" />
            <div id="content" class={ format!("fixed top-0 {} left-0 right-0 overflow-y-auto", if props.show_footer {"bottom-16"} else {"bottom-0"}) }>
                <div class="bg-transparent min-h-screen justify-center py-6 sm:py-12">
                    if props.loading {
                        <div class="bg-gray-500 bg-opacity-50 absolute left-0 top-0 z-50 h-full w-full overflow-hidden flex">
                            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10 m-auto">
                            </div>
                        </div>
                    }
                    <div class="w-full text-center relative">
                        <div class="absolute flex w-full h-full flex-col justify-center px-4">
                            <div class="relative">
                                <div class="relative sm:max-w-xl sm:mx-auto">
                                    <div class="relative flex justify-between py-10 sm:p-20">
                                        {
                                            if let Some((ref label, ref route)) = props.prev_link {
                                                html! {
                                                    <span>
                                                        <Link<AppRoute> classes={ LINK_CSS } to={ route.clone() }>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
</svg>
                                                            { format!(" {}", label) }
                                                        </Link<AppRoute>>
                                                    </span>
                                                }
                                            } else {
                                                header_button(&props.left_button)
                                            }
                                        }
                                        { header_button(&props.right_button) }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <img class="logo h-20 inline-block" src="/images/logo.png" />
                    </div>
                    <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                        <div class="relative px-4 py-4 sm:rounded-3xl sm:px-20">
                            { props.header_label.iter().map(|l| {
                                html! {
                                    <div class="pb-5">
                                        <h1 class="text-center text-2xl font-medium leading-9 tracking-tight logo">{ l }</h1>
                                    </div>
                                }}).collect::<Html>()
                            }
                            { props.children.clone() }
                        </div>
                    </div>
                </div>
            </div>
            if props.show_footer {
                <div id="footer" class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white/50 border-t border-zinc-200/50 dark:bg-blue-900/20  dark:border-blue-900/20">
                    <div class="bg-transparent justify-center">
                        <div class="relative py-3 sm:max-w-xl sm:mx-auto">
                            <div class="relative px-8 sm:rounded-3xl sm:px-20">
                                <div class={ MENU_CSS }>
                                <span><Link<AppRoute> to={AppRoute::Home}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 dark:text-zinc-100 hover:fill-amber-400 hover:text-amber-400">
  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg></Link<AppRoute>></span>
<span><Link<AppRoute> to={AppRoute::Charts}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 dark:text-zinc-100 hover:fill-amber-400 hover:text-amber-400">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
</svg></Link<AppRoute>></span>
<span><Link<AppRoute> to={AppRoute::Settings}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 dark:text-zinc-100 hover:fill-amber-400 hover:text-amber-400">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg></Link<AppRoute>></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    }
}
