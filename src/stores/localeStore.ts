import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '@/types'

interface LocaleState {
  locale: Locale
  setLocale: (locale: Locale) => void
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => {
        if (SUPPORTED_LOCALES.includes(locale)) {
          set({ locale })
        }
      },
    }),
    {
      name: STORAGE_KEYS.LOCALE,
    },
  ),
)
