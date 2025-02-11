import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

import esResources from "./i18n.es.json";
import enResources from "./i18n.en.json";
import frResources from "./i18n.fr.json";

const getCurrentLanguage = async () => {
  try {
    const currentLanguage = await AsyncStorage.getItem("persist:root");

    const languageSettings = JSON.parse(currentLanguage)?.settings;

    const selectedLanguage = JSON.parse(languageSettings);

    return selectedLanguage.lang;
  } catch (error) {
    return "es";
  }
};

const resources = {
  es: {
    translation: esResources,
  },
  en: {
    translation: enResources,
  },
  fr: {
    translation: frResources,
  },
};

(async () => {
  const currentLanguage = await getCurrentLanguage();

  i18n.use(initReactI18next).init(
    {
      compatibilityJSON: "v3",
      resources,
      lng: currentLanguage,
      fallbackLng: "es",
      interpolation: {
        escapeValue: true,
      },
    },
    (err) => {
      if (err) {
        console.error("Error al inicializar i18n:", err);
      }
    }
  );
})();

export default i18n;
