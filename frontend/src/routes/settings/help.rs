use yew::prelude::*;

use crate::{components::blank_page::BlankPage, css::*, i18n::*, routes::AppRoute};

#[function_component(Help)]
pub fn help() -> Html {
    html! {
        <BlankPage show_footer=true selected_page={AppRoute::Settings}>
            <div class={ BODY_DIV_CSS }>
                <div class="text-center">
                    <h5 class="mb-4 text-xl font-medium leading-tight">{"FAQ"}</h5>
                    <div class="group" tabindex="1">
                        <div class="group flex justify-between px-4 py-2 items-center transition cursor-pointer pr-10 relative">
                            <div class="items-center inline-flex justify-center rotate-180 transform transition group-focus:-rotate-90 absolute left-0 mb-auto ml-auto">
                                <i class="icon-chevron-left"></i>
                            </div>
                        <div class="transition pl-4 hover:opacity-50">{"How to create a community"}</div>
                    </div>
                        <div class="group-focus:max-h-screen focus-within:max-h-screen max-h-0 px-4 overflow-hidden">
                            <p class="pl-4 pr-4 pt-0 pb-2">{"Answer: "}<a href="https://stackoverflow.com">{"Bla-bla"}</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </BlankPage>
    }
}
