import { useTranslation } from 'react-i18next'
import {
  Package,
  Truck,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  MapPin,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn, formatDate } from '@/lib/utils'
import { useLocale } from '@/hooks/useLocale'
import { useCarrierInfo, getTrackingColor } from '@/services/fulfillmentService'
import TrackingTimeline from './TrackingTimeline'
import TrackingExceptionAlert from './TrackingExceptionAlert'
import type { TrackingInfo } from '@/types'

interface TrackingCardProps {
  tracking: TrackingInfo
  showTimeline?: boolean
  compact?: boolean
  className?: string
}

export default function TrackingCard({
  tracking,
  showTimeline = true,
  compact = false,
  className,
}: TrackingCardProps) {
  const { t } = useTranslation('fulfillment')
  const { localizePath, locale } = useLocale()
  const { data: carrierInfo } = useCarrierInfo(tracking.carrierCode || tracking.carrier)

  const StatusColorClass = getTrackingColor(tracking.status)

  const eventTypes = tracking.events.map(event => event.type)

  const latestEvent = tracking.latestEvent || tracking.events[tracking.events.length - 1]

  const encodedOrderId = tracking.orderId ? encodeURIComponent(tracking.orderId) : ''
  const orderDetailPath = encodedOrderId ? localizePath(`/account/orders/${encodedOrderId}`) : ''

  return (
    <div className={cn(
      'rounded-2xl bg-white shadow-lg border border-gray-100 overflow-hidden',
      className,
    )}>
      {/* 头部 - 订单和追踪号 */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              'rounded-full p-3',
              StatusColorClass,
            )}>
              <Truck size={24} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-charcoal text-xl font-semibold">
                  {tracking.orderName || t('shipment')}
                </h3>
                <span className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                  StatusColorClass,
                )}>
                  {t(`status.${tracking.status.toLowerCase()}`)}
                </span>
              </div>
              {tracking.orderId && orderDetailPath && (
                <Link
                  to={orderDetailPath}
                  className="font-body text-primary hover:text-primary/80 mt-1 inline-flex items-center gap-1 text-sm"
                >
                  {t('viewOrderDetails')}
                  <ExternalLink size={12} />
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 预计送达时间 */}
            {tracking.estimatedDeliveryAt && (
              <div className="text-right hidden sm:block">
                <p className="font-body text-muted-foreground text-xs">
                  {t('estimatedDelivery')}
                </p>
                <p className="font-body text-charcoal font-semibold text-sm">
                  {formatDate(new Date(tracking.estimatedDeliveryAt), locale)}
                </p>
              </div>
            )}

            {/* 实际送达时间 */}
            {tracking.actualDeliveryAt && (
              <div className="text-right hidden sm:block">
                <p className="font-body text-muted-foreground text-xs">
                  {t('actualDelivery')}
                </p>
                <p className="font-body text-charcoal font-semibold text-sm">
                  {formatDate(new Date(tracking.actualDeliveryAt), locale)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={cn('p-6', compact && 'p-4')}>
        {/* 追踪号和物流公司 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="font-body text-muted-foreground text-xs mb-1">
              {t('trackingNumber')}
            </p>
            <div className="flex items-center gap-2">
              <p className="font-body text-charcoal font-mono font-semibold text-base">
                {tracking.trackingNumber}
              </p>
              {tracking.trackingUrl && (
                <a
                  href={tracking.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                  title={t('trackOnCarrierWebsite')}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          {carrierInfo && (
            <div className="text-right">
              <p className="font-body text-muted-foreground text-xs mb-1">
                {t('carrier')}
              </p>
              <div className="flex items-center gap-2">
                {carrierInfo.logoUrl ? (
                  <img
                    src={carrierInfo.logoUrl}
                    alt={carrierInfo.name}
                    className="h-6 object-contain"
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                  />
                ) : (
                  <Package size={20} className="text-primary" />
                )}
                <p className="font-body text-charcoal font-medium">
                  {carrierInfo.name}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 最新状态 */}
        {latestEvent && !showTimeline && (
          <div className="bg-primary/5 rounded-xl p-4 mb-4">
            <p className="font-body text-charcoal font-semibold">
              {t(`timeline.${latestEvent.type.toLowerCase()}`)}
            </p>
            <p className="font-body text-muted-foreground mt-1 text-sm">
              {latestEvent.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              {latestEvent.location && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin size={12} />
                  {latestEvent.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock size={12} />
                {formatDate(new Date(latestEvent.timestamp), locale)}
              </span>
            </div>
          </div>
        )}

        {/* 异常预警 */}
        <TrackingExceptionAlert
          trackingId={tracking.id}
          events={eventTypes}
          className="mb-6"
        />

        {/* 物流时间线 */}
        {showTimeline && (
          <div className="border-t border-gray-100 pt-6">
            <TrackingTimeline tracking={tracking} compact={compact} />
          </div>
        )}

        {/* 地址信息 */}
        {!compact && tracking.destinationAddress && (
          <div className="border-t border-gray-100 pt-6 mt-6">
            <h4 className="font-body text-charcoal font-semibold mb-3 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              {t('deliveryAddress')}
            </h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-body text-charcoal">
                {tracking.destinationAddress.name}
              </p>
              <p className="font-body text-muted-foreground text-sm mt-1">
                {tracking.destinationAddress.address1}
                {tracking.destinationAddress.address2 && (
                  <span>, {tracking.destinationAddress.address2}</span>
                )}
              </p>
              <p className="font-body text-muted-foreground text-sm">
                {tracking.destinationAddress.city},{' '}
                {tracking.destinationAddress.province}{' '}
                {tracking.destinationAddress.zip}
              </p>
              <p className="font-body text-muted-foreground text-sm">
                {tracking.destinationAddress.country}
              </p>
              {tracking.destinationAddress.phone && (
                <p className="font-body text-muted-foreground text-sm mt-1 flex items-center gap-1">
                  <Phone size={12} />
                  {tracking.destinationAddress.phone}
                </p>
              )}
            </div>
          </div>
        )}

        {/* 联系方式 */}
        {!compact && carrierInfo && (
          <div className="border-t border-gray-100 pt-6 mt-6">
            <h4 className="font-body text-charcoal font-semibold mb-3 flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              {t('contactCarrier')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {carrierInfo.phone && (
                <a
                  href={`tel:${carrierInfo.phone}`}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-primary/10 rounded-full p-2">
                    <Phone size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-charcoal font-medium text-sm">
                      {t('phone')}
                    </p>
                    <p className="font-body text-muted-foreground text-xs">
                      {carrierInfo.phone}
                    </p>
                  </div>
                </a>
              )}
              {carrierInfo.website && (
                <a
                  href={carrierInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-primary/10 rounded-full p-2">
                    <ExternalLink size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-body text-charcoal font-medium text-sm">
                      {t('website')}
                    </p>
                    <p className="font-body text-muted-foreground text-xs">
                      {carrierInfo.name}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        {!compact && (
          <div className="border-t border-gray-100 pt-6 mt-6 flex flex-wrap gap-3">
            {tracking.trackingUrl && (
              <a
                href={tracking.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <ExternalLink size={16} />
                {t('trackOnCarrier')}
              </a>
            )}
            <Link
              to={localizePath('/account/orders')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-charcoal hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {t('allOrders')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
