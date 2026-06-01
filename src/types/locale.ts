export type Locale = 'en' | 'zh'

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

export const LOCALES: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  zh: {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
  },
}

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'zh']

export interface LocaleState {
  currentLocale: Locale
  setLocale: (locale: Locale) => void
  availableLocales: Locale[]
}

export interface TranslateOptions {
  defaultValue?: string
  ns?: string | string[]
  lng?: Locale
  keyPrefix?: string
  interpolation?: Record<string, unknown>
}
