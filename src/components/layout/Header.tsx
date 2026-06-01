import { Link } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'
import { useLocale } from '@/hooks/useLocale'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const { t } = useTranslation()
  const { localizePath } = useLocale()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-cream shadow-luxury sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link
            to={localizePath('/')}
            className="flex items-center gap-3 transition-transform hover:scale-105"
          >
            <div className="bg-gradient-gold shadow-luxury flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white">
              ✦
            </div>
            <span className="font-display text-gradient-gold text-2xl">
              {t('common.storeName')}
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={localizePath(item.href)}
                className="font-body text-charcoal hover:text-primary after:bg-primary relative text-base transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:transition-all hover:after:w-full"
              >
                {t(item.label)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="group text-charcoal hover:text-primary hover:bg-cream hidden rounded-full p-3 transition-all md:block"
              aria-label={t('actions.search')}
            >
              <Search size={20} className="transition-transform group-hover:scale-110" />
            </button>

            <Link
              to={localizePath('/cart')}
              className="group text-charcoal hover:text-primary hover:bg-cream relative rounded-full p-3 transition-all"
              aria-label={t('title', { ns: 'cart' })}
            >
              <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
              <span className="bg-gradient-gold shadow-luxury animate-scale-in absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
                0
              </span>
            </Link>

            <Link
              to={localizePath('/account')}
              className="group text-charcoal hover:text-primary hover:bg-cream hidden rounded-full p-3 transition-all md:block"
              aria-label={t('navigation.account')}
            >
              <User size={20} className="transition-transform group-hover:scale-110" />
            </Link>

            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <button
              type="button"
              className="text-charcoal hover:bg-cream rounded-full p-3 transition-all md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={cn(
            'border-cream overflow-hidden border-t transition-all duration-500 ease-out md:hidden',
            isMenuOpen ? 'max-h-screen py-6 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <nav className="flex flex-col gap-2">
            {NAVIGATION_ITEMS.map((item, index) => (
              <Link
                key={item.href}
                to={localizePath(item.href)}
                className={cn(
                  'font-body text-charcoal hover:text-primary hover:border-primary border-l-2 border-transparent py-3 text-lg transition-all hover:pl-4',
                  isMenuOpen && `animate-fade-in-up stagger-${index + 1}`,
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(item.label)}
              </Link>
            ))}
            <div className="border-cream mt-4 flex items-center gap-4 border-t pt-6">
              <Link
                to={localizePath('/account')}
                className="font-body text-charcoal hover:text-primary flex items-center gap-3 text-base transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                {t('navigation.account')}
              </Link>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
