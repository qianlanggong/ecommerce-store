import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getLocaleFromPath, addLocaleToPath } from '@/lib/i18n/config'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/types'

interface LocaleRouterProps {
  children: React.ReactNode
}

export function LocaleRouter({ children }: LocaleRouterProps) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const locale = getLocaleFromPath(location.pathname)

    const hasLocalePrefix = SUPPORTED_LOCALES.some(
      (l) => location.pathname.startsWith(`/${l}/`) || location.pathname === `/${l}`,
    )

    if (!hasLocalePrefix) {
      const detectedLocale = locale || DEFAULT_LOCALE
      const newPath = addLocaleToPath(location.pathname, detectedLocale)
      navigate(newPath, { replace: true })
    }
  }, [location, navigate])

  return <>{children}</>
}
