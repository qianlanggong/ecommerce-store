import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocale } from '@/hooks/useLocale'
import { FOOTER_LINKS, APP_NAME } from '@/lib/constants'

export function Footer() {
  const { t } = useTranslation()
  const { localizePath } = useLocale()

  return (
    <footer className="border-cream from-ivory to-cream border-t bg-gradient-to-b">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to={localizePath('/')} className="mb-6 flex items-center gap-3">
              <div className="bg-gradient-gold shadow-luxury flex h-12 w-12 items-center justify-center rounded-full text-2xl text-white">
                ✦
              </div>
              <span className="font-display text-gradient-gold text-2xl">{APP_NAME}</span>
            </Link>
            <p className="font-body text-muted-foreground text-base leading-relaxed text-pretty">
              {t('common.storeDescription')}
            </p>
            <div className="mt-6 flex items-center gap-4">
              {['📷', '📘', '🐦', '📌'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-muted-foreground hover:bg-primary shadow-luxury border-luxury flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl transition-all hover:scale-110 hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-charcoal mb-6 text-xl">{t('navigation.shop')}</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={localizePath(link.href)}
                    className="font-body text-muted-foreground hover:text-primary text-base transition-colors hover:pl-2"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-charcoal mb-6 text-xl">{t('navigation.account')}</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.href}>
                  <Link
                    to={localizePath(link.href)}
                    className="font-body text-muted-foreground hover:text-primary text-base transition-colors hover:pl-2"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-charcoal mb-6 text-xl">{t('navigation.support')}</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    to={localizePath(link.href)}
                    className="font-body text-muted-foreground hover:text-primary text-base transition-colors hover:pl-2"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-cream mt-16 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="font-body text-muted-foreground text-sm">
              © {new Date().getFullYear()} {APP_NAME}. {t('common.allRightsReserved')}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <span className="font-body text-muted-foreground text-sm">Stripe</span>
                <span className="text-2xl">🅿️</span>
                <span className="font-body text-muted-foreground text-sm">PayPal</span>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                <span className="text-xl">🔒</span>
                <span className="font-body text-muted-foreground text-sm">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
