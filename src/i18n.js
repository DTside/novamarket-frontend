'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Словарь переводов
const resources = {
  ru: {
    translation: {
      "home": "Главная",
      "electronics": "Электроника",
      "login": "Войти",
      "logout": "Выйти",
      "admin": "Админка",
      "search": "Поиск...",
      "buy": "Купить",
      "cart": "В корзину"
    }
  },
  ua: {
    translation: {
      "home": "Головна",
      "electronics": "Електроніка",
      "login": "Увійти",
      "logout": "Вийти",
      "admin": "Адмінка",
      "search": "Пошук...",
      "buy": "Купити",
      "cart": "У кошик"
    }
  },
  en: {
    translation: {
      "home": "Home",
      "electronics": "Electronics",
      "login": "Login",
      "logout": "Logout",
      "admin": "Admin",
      "search": "Search...",
      "buy": "Buy",
      "cart": "Add to cart"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ru", // Язык по умолчанию
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;