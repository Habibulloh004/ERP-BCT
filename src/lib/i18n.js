// lib/i18n.js

"use client"
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import ru from '@/locales/ru/common.json';
import en from '@/locales/en/common.json';
import uz from '@/locales/uz/common.json';

const resources = {
  ru: {
    common: ru
  },
  en: {
    common: en
  },
  uz: {
    common: uz
  }
};

// Get saved language or default to 'ru'
const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('i18nextLng') || 'ru';
  }
  return 'ru';
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    lng: getSavedLanguage(), // Set initial language
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18nextLng',
      cookieMinutes: 60 * 24 * 30, // 30 days
    },

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },

    ns: ['common'],
    defaultNS: 'common'
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', lng);
    document.documentElement.lang = lng;
  }
});

if (typeof document !== "undefined") {
  document.documentElement.lang = i18n.language || 'ru';
}

export default i18n;
