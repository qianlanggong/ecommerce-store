import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  Mail,
  RefreshCw,
  MessageCircle,
} from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useToastStore } from '@/stores/toastStore'

export default function PaymentFailedPage() {
  const { t } = useTranslation('checkout')
  const { localizePath } = useLocale()
  const [searchParams] = useSearchParams()
  const addToast = useToastStore.getState().addToast

  const orderNumber = searchParams.get('order_number') || ''
  const reason = searchParams.get('reason') || ''

  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    addToast(t('errors.paymentFailed'), 'error')
  }, [addToast, t])

  const handleRetry = () => {
    setIsRetrying(true)
    setTimeout(() => {
      setIsRetrying(false)
      window.location.href = localizePath('/checkout')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-cream/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="shadow-luxury border-luxury animate-fade-in-up overflow-hidden rounded-2xl bg-white">
            <div className="bg-wine p-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <AlertCircle size={48} />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">{t('failure.title')}</h1>
              <p className="font-body text-white/90 text-lg">{t('failure.description')}</p>
            </div>

            <div className="p-6 sm:p-8">
              {(orderNumber || reason) && (
                <div className="bg-cream/30 rounded-xl p-6 mb-8">
                  <div className="space-y-3">
                    {orderNumber && (
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-body text-muted-foreground text-sm">
                          {t('failure.orderNumber')?.replace('{{number}}', '') || 'Order Number'}
                        </p>
                        <p className="font-display text-charcoal text-lg font-bold">
                          #{orderNumber}
                        </p>
                      </div>
                    )}
                    {reason && (
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <p className="font-body text-muted-foreground text-sm">
                          {t('failure.reason')?.replace('{{reason}}', '') || 'Reason'}
                        </p>
                        <p className="font-body text-wine font-medium">
                          {reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                  <div className="bg-wine/10 p-2 rounded-lg">
                    <RefreshCw size={20} className="text-wine" />
                  </div>
                  <div>
                    <h3 className="font-body text-charcoal font-medium mb-1">
                      {t('failure.retry')}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm">
                      You can try the payment again with the same or different payment method.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <ShoppingBag size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-body text-charcoal font-medium mb-1">
                      {t('failure.backToCart')}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm">
                      Return to your cart to review items or try again later.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-cream/30 rounded-xl">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MessageCircle size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-body text-charcoal font-medium mb-1">
                      {t('failure.contactSupport')}
                    </h3>
                    <p className="font-body text-muted-foreground text-sm">
                      If the problem persists, please contact our customer support team.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={localizePath('/cart')}
                  className="border-border font-body text-charcoal hover:bg-cream flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors"
                >
                  <ArrowLeft size={20} />
                  {t('failure.backToCart')}
                </Link>
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw size={20} className="animate-spin" />
                      {t('orderSummary.processing')}
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      {t('failure.retry')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="shadow-luxury border-luxury animate-fade-in-up stagger-1 mt-8 rounded-2xl bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-display text-charcoal text-lg mb-2">
                  {t('common.help', { ns: 'common' }) || 'Need Help?'}
                </h3>
                <p className="font-body text-muted-foreground text-sm mb-3">
                  If you have any questions about your payment or order, please contact our customer support team.
                </p>
                <a
                  href="mailto:support@example.com"
                  className="font-body text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                >
                  support@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
