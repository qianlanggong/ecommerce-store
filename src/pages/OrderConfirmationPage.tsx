import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle,
  Package,
  ShoppingBag,
  Loader2,
  Mail,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { useOrder } from '@/services/userService'
import { useClearCart as useClearCartStore } from '@/services/cartService'
import { useLocale } from '@/hooks/useLocale'
import { formatMoney } from '@/lib/utils'
import { useToastStore } from '@/stores/toastStore'

export default function OrderConfirmationPage() {
  const { t } = useTranslation('checkout')
  const { localizePath } = useLocale()
  const [searchParams] = useSearchParams()
  const addToast = useToastStore.getState().addToast
  const clearCartStore = useClearCartStore()

  const orderId = searchParams.get('orderId') || searchParams.get('order_id') || ''
  const { data: order, isLoading } = useOrder(orderId)

  const [isClearingCart, setIsClearingCart] = useState(true)

  useEffect(() => {
    const clearCart = async () => {
      try {
        clearCartStore()
        addToast(t('success.title'), 'success')
      } catch {
        // 静默失败
      } finally {
        setIsClearingCart(false)
      }
    }

    clearCart()
  }, [clearCartStore, addToast, t])

  if (isLoading || isClearingCart) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="font-body text-muted-foreground text-base">{t('common.loading', { ns: 'common' })}</p>
        </div>
      </div>
    )
  }

  const items = order?.lineItems?.edges?.map((edge) => edge.node) || []
  const subtotal = order?.currentSubtotalPrice?.amount || '0'
  const tax = order?.currentTotalTax?.amount || '0'
  const shipping = order?.totalShippingPrice?.amount || '0'
  const total = order?.currentTotalPrice?.amount || '0'
  const currencyCode = order?.currentTotalPrice?.currencyCode || 'USD'

  return (
    <div className="min-h-screen bg-cream/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="shadow-luxury border-luxury animate-fade-in-up overflow-hidden rounded-2xl bg-white">
            <div className="bg-gradient-gold p-8 text-center text-white">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <CheckCircle size={48} />
              </div>
              <h1 className="font-display text-3xl font-bold mb-2">{t('success.title')}</h1>
              <p className="font-body text-white/90 text-lg">{t('success.description')}</p>
            </div>

            <div className="p-6 sm:p-8">
              <div className="bg-cream/30 rounded-xl p-6 mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-body text-muted-foreground text-sm mb-1">
                      {t('success.orderNumber')?.replace('{{number}}', '') || 'Order Number'}
                    </p>
                    <p className="font-display text-charcoal text-xl font-bold">
                      #{order?.orderNumber || '1001'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Mail size={20} />
                    <p className="font-body text-sm">
                      {t('success.confirmationEmail', { email: 'your email' })}
                    </p>
                  </div>
                </div>
              </div>

              {items.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-charcoal text-xl mb-4 flex items-center gap-2">
                    <ShoppingBag size={20} />
                    {t('checkout.orderSummary.title', { ns: 'checkout' })}
                  </h2>
                  <div className="space-y-4">
                    {items.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <div className="bg-cream aspect-square w-16 flex-shrink-0 overflow-hidden rounded-lg">
                          {item.image?.url ? (
                            <img
                              src={item.image.url}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="text-muted-foreground h-6 w-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body text-charcoal font-semibold truncate">
                            {item.title}
                          </p>
                          <p className="font-body text-muted-foreground text-sm">
                            {t('orders.quantity', { ns: 'user', count: item.quantity })}
                          </p>
                        </div>
                        <p className="font-body text-charcoal font-semibold">
                          {formatMoney(parseFloat(item.discountedTotalPrice.amount), item.discountedTotalPrice.currencyCode)}
                        </p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="font-body text-muted-foreground text-center text-sm">
                        {t('orders.moreItems', { ns: 'user', count: items.length - 3 })}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-cream/50 pt-6 mb-8">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-muted-foreground">{t('orderSummary.subtotal')}</span>
                    <span className="font-body text-charcoal">
                      {formatMoney(parseFloat(subtotal), currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-muted-foreground">{t('orderSummary.shipping')}</span>
                    <span className="font-body text-charcoal">
                      {formatMoney(parseFloat(shipping), currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body text-muted-foreground">{t('orderSummary.tax')}</span>
                    <span className="font-body text-charcoal">
                      {formatMoney(parseFloat(tax), currencyCode)}
                    </span>
                  </div>
                  <div className="border-t border-cream/50 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-display text-charcoal text-lg font-bold">{t('orderSummary.total')}</span>
                      <span className="font-display text-charcoal text-2xl font-bold">
                        {formatMoney(parseFloat(total), currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to={localizePath('/products')}
                  className="border-border font-body text-charcoal hover:bg-cream flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors"
                >
                  {t('success.continueShopping')}
                </Link>
                {order && (
                  <Link
                    to={localizePath(`/account/orders/${encodeURIComponent(order.id)}`)}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FileText size={20} />
                    {t('success.viewOrder')}
                    <ArrowRight size={20} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="shadow-luxury border-luxury animate-fade-in-up stagger-1 mt-8 rounded-2xl bg-white p-6">
            <h3 className="font-display text-charcoal text-lg mb-4">{t('common.help', { ns: 'common' }) || 'Need Help?'}</h3>
            <p className="font-body text-muted-foreground text-sm">
              {t('errors.paymentFailed') || 'If you have any questions about your order, please contact our customer support team.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
