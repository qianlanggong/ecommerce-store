import { useLocale } from '@/hooks/useLocale'
import type { Locale } from '@/types'

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  zh: '中文',
}

export function LanguageSwitcher() {
  const { locale, changeLocale, supportedLocales } = useLocale()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await changeLocale(e.target.value as Locale)
  }

  return (
    <div className="group relative">
      <select
        value={locale}
        onChange={handleChange}
        className="border-gold/30 bg-cream font-body text-charcoal shadow-subtle hover:border-gold hover:shadow-luxury focus:border-gold focus:ring-gold/30 cursor-pointer appearance-none rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all duration-300 focus:ring-2 focus:outline-none"
        aria-label="Select language"
      >
        {supportedLocales.map((loc) => (
          <option key={loc} value={loc} className="bg-cream text-charcoal">
            {localeLabels[loc]}
          </option>
        ))}
      </select>
      <div className="text-gold pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}
