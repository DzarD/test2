import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import { getUserPreference, setUserPreference } from "../database/db";

const fallbackLng = "en";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

const supportedLanguages = [
  { label: "English", value: "en" },
  { label: "Русский", value: "ru" },
];

const i18nInit = async () => {
  const savedLang = getUserPreference("language");
  const locales = Localization.getLocales();
  const deviceLang = locales[0]?.languageCode || fallbackLng;
  const lng = savedLang || deviceLang;

  await i18n.use(initReactI18next).init({
    lng,
    fallbackLng,
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
};

const changeLanguage = async (lang: string) => {
  try {
    await i18n.changeLanguage(lang);
    setUserPreference("language", lang);
  } catch (error) {
    console.error("Error saving language preference:", error);
  }
};

export { supportedLanguages, i18nInit, changeLanguage };
export default i18n;
