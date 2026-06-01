import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocaleStore } from '@/stores'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/types'
import {
  getLocaleFromPath,
  addLocaleToPath,
  changeLocaleInUrl,
  stripLocaleFromPath,
} from '@/lib/i18n/config'

export function useLocale() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { locale: storeLocale, setLocale } = useLocaleStore()

  const currentLocale = getLocaleFromPath(location.pathname)

  useEffect(() => {
    if (i18n.language !== currentLocale) {
      i18n.changeLanguage(currentLocale)
    }
    if (storeLocale !== currentLocale) {
      setLocale(currentLocale)
    }
  }, [currentLocale, i18n, storeLocale, setLocale])

  const changeLocale = useCallback(
    (newLocale: Locale) => {
      if (!SUPPORTED_LOCALES.includes(newLocale)) return

      const newPath = changeLocaleInUrl(location.pathname, newLocale)
      i18n.changeLanguage(newLocale)
      setLocale(newLocale)
      navigate(newPath)
    },
    [location.pathname, i18n, setLocale, navigate],
  )

  const localizePath = useCallback(
    (path: string, locale?: Locale): string => {
      const targetLocale = locale || currentLocale
      return addLocaleToPath(path, targetLocale)
    },
    [currentLocale],
  )

  const delocalizePath = useCallback((path: string): string => {
    return stripLocaleFromPath(path)
  }, [])

  return {
    locale: currentLocale,
    defaultLocale: DEFAULT_LOCALE,
    supportedLocales: SUPPORTED_LOCALES,
    changeLocale,
    localizePath,
    delocalizePath,
    isDefaultLocale: currentLocale === DEFAULT_LOCALE,
  }
}
