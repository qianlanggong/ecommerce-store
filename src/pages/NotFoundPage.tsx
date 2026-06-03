import { Home, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'

export function NotFoundPage() {
  const { t } = useTranslation('common')
  const { localizePath } = useLocale()
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-luxury flex min-h-screen items-center justify-center p-4">
      <div className="shadow-luxury border-luxury max-w-lg w-full overflow-hidden rounded-3xl bg-white p-8 text-center">
        <div className="bg-wine/10 text-wine mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
          <span className="font-display text-4xl font-bold">{t('notFound.code')}</span>
        </div>

        <h1 className="font-display text-charcoal mb-3 text-3xl">{t('notFound.title')}</h1>
        <p className="font-body text-muted-foreground mb-8 text-base">
          {t('notFound.description')}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => navigate(-1)}
            className="border-primary bg-cream font-body text-primary hover:bg-primary/5 flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-base font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            {t('notFound.goBack')}
          </button>

          <Link
            to={localizePath('/')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <Home size={18} />
            {t('notFound.backHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
