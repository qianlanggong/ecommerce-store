import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, LogOut, ShoppingBag, Heart, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/locale/LanguageSwitcher'
import { useLocale } from '@/hooks/useLocale'
import { NAVIGATION_ITEMS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'
import { useCartActions } from '@/hooks/useCartActions'
import { useAuthState, useLogout } from '@/services/userService'

export function Header() {
  const { t } = useTranslation()
  const { localizePath } = useLocale()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { openDrawer } = useCartStore()
  const { totalQuantity } = useCartActions()
  const { customer, isAuthenticated } = useAuthState()
  const logout = useLogout()
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault()
    openDrawer()
  }

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout.mutateAsync()
    navigate(localizePath('/'))
  }

  const toggleUserMenu = () => {
    if (!isAuthenticated) {
      navigate(localizePath('/account/login'))
    } else {
      setIsUserMenuOpen(!isUserMenuOpen)
    }
  }

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

            <button
              type="button"
              onClick={handleCartClick}
              className="group text-charcoal hover:text-primary hover:bg-cream relative rounded-full p-3 transition-all"
              aria-label={t('title', { ns: 'cart' })}
            >
              <ShoppingCart size={20} className="transition-transform group-hover:scale-110" />
              {totalQuantity > 0 && (
                <span className="bg-gradient-gold shadow-luxury animate-scale-in absolute -top-1 -right-1 flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-semibold text-white">
                  {totalQuantity > 99 ? '99+' : totalQuantity}
                </span>
              )}
            </button>

            <div ref={userMenuRef} className="hidden md:block">
              <button
                type="button"
                onClick={toggleUserMenu}
                className={cn(
                  'group text-charcoal hover:text-primary hover:bg-cream flex items-center gap-2 rounded-full p-3 transition-all',
                  isUserMenuOpen && 'bg-cream',
                )}
                aria-label={t('navigation.account')}
              >
                <User size={20} className="transition-transform group-hover:scale-110" />
                {isAuthenticated && (
                  <ChevronDown
                    size={16}
                    className={cn(
                      'transition-transform duration-300',
                      isUserMenuOpen && 'rotate-180',
                    )}
                  />
                )}
              </button>

              {isUserMenuOpen && isAuthenticated && (
                <div className="shadow-luxury border-luxury !fixed top-20 right-4 z-50 mt-2 w-56 max-h-[80vh] overflow-y-auto rounded-xl bg-white py-2">
                  <div className="border-cream/50 px-4 py-3 border-b">
                    <p className="font-display text-charcoal text-sm font-semibold">
                      {customer?.displayName}
                    </p>
                    <p className="font-body text-muted-foreground truncate text-xs">
                      {customer?.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to={localizePath('/account')}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-body text-charcoal hover:bg-cream flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    >
                      <User size={18} />
                      {t('navigation.account')}
                    </Link>
                    <Link
                      to={localizePath('/account/orders')}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-body text-charcoal hover:bg-cream flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    >
                      <ShoppingBag size={18} />
                      {t('navigation.orders')}
                    </Link>
                    <Link
                      to={localizePath('/favorites')}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-body text-charcoal hover:bg-cream flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    >
                      <Heart size={18} />
                      {t('navigation.favorites')}
                    </Link>
                    <Link
                      to={localizePath('/account/settings')}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="font-body text-charcoal hover:bg-cream flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    >
                      <Settings size={18} />
                      {t('navigation.settings')}
                    </Link>
                  </div>
                  <div className="border-cream/50 pt-1 border-t">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="font-body text-wine hover:bg-wine/10 flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                      disabled={logout.isPending}
                    >
                      <LogOut size={18} />
                      {t('navigation.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>

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
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false)
                  openDrawer()
                }}
                className="font-body text-charcoal hover:text-primary flex items-center gap-3 text-base transition-colors"
              >
                <ShoppingCart size={20} />
                {t('title', { ns: 'cart' })}
                {totalQuantity > 0 && (
                  <span className="bg-gradient-gold text-cream flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold">
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </span>
                )}
              </button>
              {isAuthenticated ? (
                <>
                  <Link
                    to={localizePath('/account')}
                    className="font-body text-charcoal hover:text-primary flex items-center gap-3 text-base transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    {t('navigation.account')}
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="font-body text-wine hover:text-wine/80 flex items-center gap-3 text-base transition-colors"
                    disabled={logout.isPending}
                  >
                    <LogOut size={20} />
                    {t('navigation.logout')}
                  </button>
                </>
              ) : (
                <Link
                  to={localizePath('/account/login')}
                  className="font-body text-charcoal hover:text-primary flex items-center gap-3 text-base transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={20} />
                  {t('navigation.login')}
                </Link>
              )}
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
