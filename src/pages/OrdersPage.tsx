import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package,
  ShoppingBag,
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { useOrders } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn, formatDate, formatMoney } from '@/lib/utils'
import type { Order } from '@/types'
import { OrderFinancialStatus, OrderFulfillmentStatus } from '@/types'

export default function OrdersPage() {
  const { t } = useTranslation('user')
  const { localizePath, locale } = useLocale()
  const { data: ordersData, isLoading, error } = useOrders(20)

  // 白盒测试：确保 ordersData.edges 存在时正确映射，否则返回空数组
  const orders = ordersData?.edges.map((edge) => edge.node) || []

  // 白盒测试：状态颜色映射覆盖所有可能的订单状态
  const getStatusColor = (status: OrderFinancialStatus | OrderFulfillmentStatus) => {
    switch (status) {
      case OrderFinancialStatus.PAID:
      case OrderFulfillmentStatus.FULFILLED:
        return 'bg-green-100 text-green-700'
      case OrderFinancialStatus.PENDING:
      case OrderFulfillmentStatus.OPEN:
      case OrderFulfillmentStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700'
      case OrderFinancialStatus.REFUNDED:
      case OrderFinancialStatus.VOIDED:
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // 白盒测试：状态图标映射，覆盖所有履行状态
  const getStatusIcon = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case OrderFulfillmentStatus.FULFILLED:
        return <CheckCircle size={20} />
      case OrderFulfillmentStatus.IN_PROGRESS:
      case OrderFulfillmentStatus.OPEN:
        return <Truck size={20} />
      default:
        // 默认返回包裹图标，处理未知状态
        return <Package size={20} />
    }
  }

  // 白盒测试：加载状态分支
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

  // 白盒测试：错误状态分支
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
          <AlertCircle className="text-wine mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('common.error', { ns: 'common' })}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {error instanceof Error ? error.message : 'Failed to load orders'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('common.retry', { ns: 'common' })}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-fade-in-up mb-8">
        <Link
          to={localizePath('/account')}
          className="font-body text-primary hover:text-primary/80 mb-4 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          {t('common.back', { ns: 'common' })}
        </Link>
        <h1 className="font-display text-charcoal text-3xl">{t('orders.title')}</h1>
      </div>

      {/* 白盒测试：空订单列表分支 */}
      {orders.length === 0 ? (
        <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
          <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('orders.noOrders')}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {t('orders.noOrdersDescription')}
          </p>
          <Link
            to={localizePath('/products')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            {t('orders.startShopping')}
          </Link>
        </div>
      ) : (
        /* 白盒测试：有订单列表分支 */
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              locale={locale}
              t={t}
              localizePath={localizePath}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface OrderCardProps {
  order: Order
  index: number
  locale: string
  t: (key: string, options?: Record<string, unknown>) => string
  localizePath: (path: string) => string
  getStatusColor: (status: OrderFinancialStatus | OrderFulfillmentStatus) => string
  getStatusIcon: (status: OrderFulfillmentStatus) => React.ReactNode
}

function OrderCard({
  order,
  index,
  locale,
  t,
  localizePath,
  getStatusColor,
  getStatusIcon,
}: OrderCardProps) {
  const items = order.lineItems.edges.map((edge) => edge.node)
  const encodedOrderId = encodeURIComponent(order.id)
  const orderDetailPath = localizePath(`/account/orders/${encodedOrderId}`)

  return (
    <div
      className={cn(
        'shadow-luxury border-luxury animate-fade-in-up overflow-hidden rounded-2xl bg-white',
        `stagger-${(index % 4) + 1}`,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream/50 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="font-display text-charcoal text-lg font-semibold">
              {t('orders.orderNumber', { number: order.orderNumber })}
            </p>
            <p className="font-body text-muted-foreground text-sm">
              {t('orders.placedOn', { date: formatDate(new Date(order.processedAt), locale === 'zh' ? 'zh-CN' : 'en-US') })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              getStatusColor(order.financialStatus),
            )}>
              {t(`orders.status.${order.financialStatus.toLowerCase()}`)}
            </span>
            <span className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
              getStatusColor(order.fulfillmentStatus),
            )}>
              {getStatusIcon(order.fulfillmentStatus)}
              {t(`orders.status.${order.fulfillmentStatus.toLowerCase()}`)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-display text-charcoal text-xl font-bold">
            {formatMoney(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
          </p>
          <Link
            to={orderDetailPath}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('orders.viewDetails')}
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-4">
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
              <div className="min-w-0 flex-1">
                <p className="font-display text-charcoal truncate font-semibold">
                  {item.title}
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  {item.variantTitle && <span className="mr-2">{item.variantTitle}</span>}
                  {t('orders.quantity', { count: item.quantity })}
                </p>
              </div>
              <p className="font-body text-charcoal font-semibold">
                {formatMoney(parseFloat(item.discountedTotalPrice.amount), item.discountedTotalPrice.currencyCode)}
              </p>
            </div>
          ))}
          {items.length > 3 && (
            <p className="font-body text-muted-foreground text-center text-sm">
              {t('orders.moreItems', { count: items.length - 3 })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
