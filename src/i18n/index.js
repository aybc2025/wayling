import { createContext, useContext } from 'react';
import he from './he.js';
import en from './en.js';

export const DICTS = { he, en };
export const DIR = { he: 'rtl', en: 'ltr' };

export function makeT(lang) {
  const dict = DICTS[lang] || he;
  return (path, params) => {
    let v = path.split('.').reduce((o, k) => (o ? o[k] : undefined), dict);
    if (typeof v !== 'string') return path;
    if (params) for (const k of Object.keys(params)) v = v.replace(`{${k}}`, params[k]);
    return v;
  };
}

export const I18nContext = createContext({ lang: 'he', t: makeT('he') });
export const useI18n = () => useContext(I18nContext);

export function defaultLang() {
  const l = (typeof navigator !== 'undefined' && navigator.language) || 'he';
  return l.toLowerCase().startsWith('en') ? 'en' : 'he';
}
