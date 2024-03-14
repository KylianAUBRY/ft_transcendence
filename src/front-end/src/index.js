import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import global_en from "./translations/en/global.json"
import global_fr from "./translations/fr/global.json"
import global_es from "./translations/es/global.json"
import i18next from 'i18next'
import { I18nextProvider } from 'react-i18next'

i18next.init({
  interpolation: {escapeValue: false},
  lng: "en",
  resources: {
    en: {
      global: global_en
    },
    fr: {
      global: global_fr
    },
    es: {
      global: global_es
    },
  },
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);


