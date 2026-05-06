import i18n from "i18next";

import en from "../../public/locales/en/translation.json";
import ru from "../../public/locales/ru/translation.json";
import uk from "../../public/locales/uk/translation.json";

export const languages = [
  { code: "en", label: "English" },
  { code: "ru", label: "Russian" },
  { code: "uk", label: "Ukrainian" }
];

export const USER_LANGUAGE_STORAGE_KEY = "language";

export function getStoredLanguage() {
  return window.localStorage.getItem(USER_LANGUAGE_STORAGE_KEY) ?? "en";
}

export function setStoredLanguage(language: string) {
  if (language === "en") {
    window.localStorage.removeItem(USER_LANGUAGE_STORAGE_KEY);
  } else {
    window.localStorage.setItem(USER_LANGUAGE_STORAGE_KEY, language);
  }
}

export function initI18n() {
  if (i18n.isInitialized) {
    return i18n;
  }

  void i18n.init({
    lng: getStoredLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      uk: { translation: uk }
    }
  });

  return i18n;
}
