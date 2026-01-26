import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./Local/en.json";
import ar from "./Local/ar.json";
import de from "./Local/de.json";
import fr from "./Local/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      de: { translation: de },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

const savedLanguage = localStorage.getItem("i18nextLng") || "en";
i18n.changeLanguage(savedLanguage);
document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr";
document.documentElement.lang = savedLanguage;

export default i18n;
