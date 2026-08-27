import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Loading translation using http -> see /public/locales
  .use(LanguageDetector) // Automatique de la langue du navigateur
  .use(initReactI18next)
  .init({
    fallbackLng: 'en', // Default language if the detected language is not available
    supportedLngs: ['en', 'fr'], // Supported Languages
    ns: ['translation'], // Namespace by default
    defaultNS: 'translation', // Namespace by default
    debug: import.meta.env.DEV, // Print logs in development mode
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Path to load translation files
    },
    detection: {
      order: ['navigator', 'htmlTag', 'localStorage', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;
