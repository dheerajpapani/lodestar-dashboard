import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/common.json';
import assamese from './locales/assamese/common.json';
import bengali from './locales/bengali/common.json';
import bihari from './locales/bihari/common.json';
import dutch from './locales/dutch/common.json';
import hindi from './locales/hindi/common.json';
import kannada from './locales/kannada/common.json';
import morrocan from './locales/morrocan/common.json';
import telugu from './locales/telugu/common.json';
import turkish from './locales/turkish/common.json';

const resources = {
  en: { common: en },
  assamese: { common: assamese },
  bengali: { common: bengali },
  bihari: { common: bihari },
  dutch: { common: dutch },
  hindi: { common: hindi },
  kannada: { common: kannada },
  morrocan: { common: morrocan },
  telugu: { common: telugu },
  turkish: { common: turkish }
};

const savedLanguage = localStorage.getItem('lodestar_lang') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
