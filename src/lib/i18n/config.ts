import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/types'

const isProduction = import.meta.env.PROD

export const I18N_CONFIG = {
  fallbackLng: DEFAULT_LOCALE,
  supportedLngs: SUPPORTED_LOCALES,
  ns: ['common', 'home', 'product', 'cart', 'user', 'checkout'],
  defaultNS: 'common',
  debug: !isProduction,
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['path', 'localStorage', 'navigator', 'htmlTag'],
    lookupFromPathIndex: 0,
    caches: ['localStorage'],
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
  },
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged',
    bindI18nStore: 'added',
  },
}

export async function initI18n(): Promise<void> {
  await i18n.use(HttpBackend).use(LanguageDetector).use(initReactI18next).init(I18N_CONFIG)
}

export function getLocaleFromPath(pathname: string): Locale {
  const parts = pathname.split('/').filter(Boolean)
  const firstPart = parts[0] as Locale

  if (SUPPORTED_LOCALES.includes(firstPart)) {
    return firstPart
  }

  return DEFAULT_LOCALE
}

export function stripLocaleFromPath(pathname: string): string {
  const locale = getLocaleFromPath(pathname)
  if (pathname.startsWith(`/${locale}/`)) {
    return pathname.slice(`/${locale}`.length) || '/'
  }
  if (pathname === `/${locale}`) {
    return '/'
  }
  return pathname
}

export function addLocaleToPath(pathname: string, locale: Locale): string {
  if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
    return pathname
  }

  const cleanPath = pathname === '/' ? '' : pathname
  return `/${locale}${cleanPath}`
}

export function changeLocaleInUrl(pathname: string, newLocale: Locale): string {
  const pathWithoutLocale = stripLocaleFromPath(pathname)
  return addLocaleToPath(pathWithoutLocale, newLocale)
}

export default i18n
