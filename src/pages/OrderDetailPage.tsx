import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  MapPin,
  CreditCard,
  Ship,
  Clock,
  FileText,
} from 'lucide-react'
import { useOrder } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn, formatDate, formatMoney } from '@/lib/utils'
import { OrderFinancialStatus, OrderFulfillmentStatus, FulfillmentStatus } from '@/types'

export default function OrderDetailPage() {
  const { t } = useTranslation('user')
  const { localizePath, locale } = useLocale()
  const { orderId } = useParams<{ orderId: string }>()
  const decodedOrderId = orderId ? decodeURIComponent(orderId) : ''
  const { data: order, isLoading, error } = useOrder(decodedOrderId)
  const encodedOrderId = orderId || ''
  const orderDetailPath = localizePath(`/account/orders/${encodedOrderId}`)

  // 边界条件：订单 ID 为空时直接显示错误
  if (!decodedOrderId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
          <AlertCircle className="text-wine mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('common.error', { ns: 'common' })}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {t('orders.orderNotFound', { ns: 'user' }) || 'Order ID is required'}
          </p>
          <Link
            to={localizePath('/account/orders')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('orders.title')}
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: OrderFinancialStatus | OrderFulfillmentStatus | FulfillmentStatus) => {
    switch (status) {
      case OrderFinancialStatus.PAID:
      case OrderFulfillmentStatus.FULFILLED:
      case FulfillmentStatus.DELIVERED:
        return 'bg-green-100 text-green-700'
      case OrderFinancialStatus.PENDING:
      case OrderFulfillmentStatus.OPEN:
      case OrderFulfillmentStatus.IN_PROGRESS:
      case FulfillmentStatus.IN_TRANSIT:
      case FulfillmentStatus.OUT_FOR_DELIVERY:
        return 'bg-yellow-100 text-yellow-700'
      case OrderFinancialStatus.REFUNDED:
      case OrderFinancialStatus.VOIDED:
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusText = (status: string) => {
    return t(`orders.status.${status.toLowerCase()}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="font-body text-muted-foreground text-base">{t('account.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
          <AlertCircle className="text-wine mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('common.error', { ns: 'common' })}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Order not found'}
          </p>
          <Link
            to={localizePath('/account/orders')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('orders.title')}
          </Link>
        </div>
      </div>
    )
  }

  const items = order.lineItems.edges.map((edge) => edge.node)
  const fulfillments = order.fulfillments?.edges?.map((edge) => edge.node) || []
  const shippingAddress = order.shippingAddress
  const billingAddress = order.billingAddress

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-fade-in-up mb-8">
        <Link
          to={localizePath('/account/orders')}
          className="font-body text-primary hover:text-primary/80 mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          {t('common.back', { ns: 'common' })}
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-charcoal text-3xl">
              {t('orders.orderNumber', { number: order.orderNumber })}
            </h1>
            <p className="font-body text-muted-foreground mt-1">
              {t('orders.placedOn', { date: formatDate(new Date(order.processedAt), locale === 'zh' ? 'zh-CN' : 'en-US') })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold',
              getStatusColor(order.financialStatus),
            )}>
              <CreditCard size={16} />
              {getStatusText(order.financialStatus)}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold',
              getStatusColor(order.fulfillmentStatus),
            )}>
              <Truck size={16} />
              {getStatusText(order.fulfillmentStatus)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="shadow-luxury border-luxury animate-fade-in-up stagger-1 rounded-2xl bg-white p-6">
            <h2 className="font-display text-charcoal text-xl mb-6 flex items-center gap-2">
              <Package size={20} />
              {t('orders.title')}
            </h2>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className={cn('flex items-center gap-4 pb-4', index < items.length - 1 ? 'border-b border-cream/50' : '')}>
                  <div className="bg-cream aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    {item.image?.url ? (
                      <img
                        src={item.image.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="text-muted-foreground h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-charcoal font-semibold">
                      {item.title}
                    </p>
                    <p className="font-body text-muted-foreground text-sm">
                      {item.variantTitle && <span className="mr-2">{item.variantTitle}</span>}
                      {t('orders.quantity', { count: item.quantity })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-charcoal font-semibold">
                      {formatMoney(parseFloat(item.discountedTotalPrice.amount), item.discountedTotalPrice.currencyCode)}
                    </p>
                    {item.originalTotalPrice.amount !== item.discountedTotalPrice.amount && (
                      <p className="font-body text-muted-foreground text-sm line-through">
                        {formatMoney(parseFloat(item.originalTotalPrice.amount), item.originalTotalPrice.currencyCode)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {fulfillments.length > 0 && (
            <div className="shadow-luxury border-luxury animate-fade-in-up stagger-2 rounded-2xl bg-white p-6">
              <h2 className="font-display text-charcoal text-xl mb-6 flex items-center gap-2">
                <Ship size={20} />
                {t('orders.trackOrder')}
              </h2>
              <div className="space-y-4">
                {fulfillments.map((fulfillment) => (
                  <div key={fulfillment.id} className="border border-cream/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                          getStatusColor(fulfillment.status),
                        )}>
                          {fulfillment.status === FulfillmentStatus.DELIVERED ? (
                            <CheckCircle size={14} />
                          ) : fulfillment.status === FulfillmentStatus.IN_TRANSIT || fulfillment.status === FulfillmentStatus.OUT_FOR_DELIVERY ? (
                            <Truck size={14} />
                          ) : (
                            <Clock size={14} />
                          )}
                          {getStatusText(fulfillment.status)}
                        </span>
                        <span className="font-body text-muted-foreground text-sm">
                          {fulfillment.name}
                        </span>
                      </div>
                      <span className="font-body text-muted-foreground text-sm">
                        {formatDate(new Date(fulfillment.createdAt), locale === 'zh' ? 'zh-CN' : 'en-US')}
                      </span>
                    </div>
                    {fulfillment.trackingInfo && fulfillment.trackingInfo.length > 0 && (
                      <div className="space-y-2">
                        {fulfillment.trackingInfo.map((tracking, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-cream/30 rounded-lg p-3">
                            <div>
                              <p className="font-body text-charcoal text-sm font-medium">
                                {tracking.company || 'Shipping Provider'}
                              </p>
                              {tracking.number && (
                                <p className="font-body text-muted-foreground text-xs">
                                  {t('checkout.orderSummary.orderNumber', { ns: 'checkout', number: tracking.number })}
                                </p>
                              )}
                            </div>
                            {tracking.url && (
                              <a
                                href={tracking.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-body text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                              >
                                {t('orders.trackOrder')}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {fulfillment.estimatedDeliveryAt && (
                      <p className="font-body text-muted-foreground text-sm mt-3">
                        {t('checkout.shippingMethod.estimatedDelivery', {
                          ns: 'checkout',
                          from: formatDate(new Date(fulfillment.estimatedDeliveryAt), locale === 'zh' ? 'zh-CN' : 'en-US'),
                          to: formatDate(new Date(fulfillment.estimatedDeliveryAt), locale === 'zh' ? 'zh-CN' : 'en-US'),
                        })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(shippingAddress || billingAddress) && (
            <div className="shadow-luxury border-luxury animate-fade-in-up stagger-3 rounded-2xl bg-white p-6">
              <h2 className="font-display text-charcoal text-xl mb-6 flex items-center gap-2">
                <MapPin size={20} />
                {t('account.addresses')}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {shippingAddress && (
                  <div>
                    <h3 className="font-body text-charcoal font-semibold mb-3">
                      {t('checkout.shippingAddress.title', { ns: 'checkout' })}
                    </h3>
                    <div className="bg-cream/30 rounded-xl p-4">
                      <p className="font-body text-charcoal">
                        {shippingAddress.firstName} {shippingAddress.lastName}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {shippingAddress.address1}
                      </p>
                      {shippingAddress.address2 && (
                        <p className="font-body text-muted-foreground text-sm">
                          {shippingAddress.address2}
                        </p>
                      )}
                      <p className="font-body text-muted-foreground text-sm">
                        {shippingAddress.city}, {shippingAddress.province || shippingAddress.provinceCode} {shippingAddress.zip}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {shippingAddress.country}
                      </p>
                      {shippingAddress.phone && (
                        <p className="font-body text-muted-foreground text-sm mt-2">
                          {shippingAddress.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {billingAddress && (
                  <div>
                    <h3 className="font-body text-charcoal font-semibold mb-3">
                      {t('checkout.billingAddress.title', { ns: 'checkout' })}
                    </h3>
                    <div className="bg-cream/30 rounded-xl p-4">
                      <p className="font-body text-charcoal">
                        {billingAddress.firstName} {billingAddress.lastName}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {billingAddress.address1}
                      </p>
                      {billingAddress.address2 && (
                        <p className="font-body text-muted-foreground text-sm">
                          {billingAddress.address2}
                        </p>
                      )}
                      <p className="font-body text-muted-foreground text-sm">
                        {billingAddress.city}, {billingAddress.province || billingAddress.provinceCode} {billingAddress.zip}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {billingAddress.country}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="shadow-luxury border-luxury animate-fade-in-up stagger-4 rounded-2xl bg-white p-6 sticky top-28">
            <h2 className="font-display text-charcoal text-xl mb-6 flex items-center gap-2">
              <FileText size={20} />
              {t('checkout.orderSummary.title', { ns: 'checkout' })}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">
                  {t('checkout.orderSummary.subtotal', { ns: 'checkout' })}
                </span>
                <span className="font-body text-charcoal">
                  {formatMoney(parseFloat(order.currentSubtotalPrice.amount), order.currentSubtotalPrice.currencyCode)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">
                  {t('checkout.orderSummary.shipping', { ns: 'checkout' })}
                </span>
                <span className="font-body text-charcoal">
                  {formatMoney(parseFloat(order.totalShippingPrice.amount), order.totalShippingPrice.currencyCode)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-muted-foreground">
                  {t('checkout.orderSummary.tax', { ns: 'checkout' })}
                </span>
                <span className="font-body text-charcoal">
                  {formatMoney(parseFloat(order.currentTotalTax.amount), order.currentTotalTax.currencyCode)}
                </span>
              </div>
              {order.totalRefunded && parseFloat(order.totalRefunded.amount) > 0 && (
                <div className="flex justify-between items-center text-wine">
                  <span className="font-body">{t('orders.status.refunded')}</span>
                  <span className="font-body font-semibold">
                    -{formatMoney(parseFloat(order.totalRefunded.amount), order.totalRefunded.currencyCode)}
                  </span>
                </div>
              )}
              <div className="border-t border-cream/50 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-display text-charcoal text-lg font-bold">
                    {t('checkout.orderSummary.total', { ns: 'checkout' })}
                  </span>
                  <span className="font-display text-charcoal text-xl font-bold">
                    {formatMoney(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to={orderDetailPath}
              className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('orders.trackOrder')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
