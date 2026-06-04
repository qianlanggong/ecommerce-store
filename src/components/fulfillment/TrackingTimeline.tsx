import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Send,
  ShoppingBag,
  Truck,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  Box,
  CheckCircle,
  Loader2,
} from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { generateTimeline } from '@/services/fulfillmentService'
import type { TrackingInfo } from '@/types'

interface TrackingTimelineProps {
  tracking: TrackingInfo
  className?: string
  compact?: boolean
}

const iconComponents: Record<string, React.ElementType> = {
  ShoppingBag,
  CheckCircle,
  Package,
  Box,
  Send,
  Truck,
  PackageCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  AlertOctagon,
}

export default function TrackingTimeline({ tracking, className, compact = false }: TrackingTimelineProps) {
  const { t, i18n } = useTranslation('fulfillment')
  const locale = i18n.language

  const timeline = useMemo(() => {
    const eventTypes = tracking.events.map(event => event.type)
    const baseTimeline = generateTimeline(eventTypes, locale)

    return baseTimeline.map(item => {
      const event = tracking.events.find(e => e.type === item.status)
      return {
        ...item,
        title: t(`timeline.${item.status.toLowerCase()}`),
        description: event?.description || t(`timeline.${item.status.toLowerCase()}_desc`),
        timestamp: event?.timestamp || '',
        location: event?.location,
      }
    })
  }, [tracking.events, locale, t])

  const progressPercentage = useMemo(() => {
    const completedCount = timeline.filter(item => item.isCompleted).length
    return Math.round((completedCount / timeline.length) * 100)
  }, [timeline])

  const IconComponent = (iconName: string) => {
    const Icon = iconComponents[iconName] || Clock
    return Icon
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 进度条 */}
      {!compact && (
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="font-body text-charcoal text-sm font-medium">
              {t('deliveryProgress')}
            </span>
            <span className="font-body text-primary font-semibold text-sm">
              {progressPercentage}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {tracking.estimatedDeliveryAt && (
            <p className="font-body text-muted-foreground mt-2 text-sm">
              {t('estimatedDelivery')}:{' '}
              <span className="font-medium text-charcoal">
                {formatDate(new Date(tracking.estimatedDeliveryAt), locale)}
              </span>
            </p>
          )}
        </div>
      )}

      {/* 时间线 */}
      <div className="relative">
        {/* 连接线 */}
        {!compact && (
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200">
            <div
              className="w-full bg-gradient-to-b from-primary to-primary/50 transition-all duration-500"
              style={{ height: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* 时间线节点 */}
        <div className={cn('space-y-4', !compact && 'ml-12')}>
          {timeline.map((item, index) => {
            const Icon = IconComponent(item.icon)
            const isLast = index === timeline.length - 1

            return (
              <div
                key={item.id}
                className={cn(
                  'relative',
                  compact && 'flex items-start gap-3',
                  !compact && !isLast && 'pb-4',
                )}
              >
                {/* 图标 */}
                <div
                  className={cn(
                    'absolute left-0 flex-shrink-0 rounded-full p-2 transition-all duration-300',
                    !compact && '-translate-x-1/2',
                    compact && 'relative',
                    item.isCompleted && !item.isCurrent && item.color,
                    item.isCurrent && 'bg-primary text-white ring-4 ring-primary/20',
                    item.isEstimated && 'bg-gray-100 text-gray-400',
                  )}
                >
                  <Icon size={compact ? 16 : 20} />
                </div>

                {/* 内容 */}
                <div className={cn(
                  'flex-1',
                  !compact && 'pl-4',
                  item.isEstimated && 'opacity-50',
                )}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className={cn(
                      'font-body font-semibold',
                      item.isCurrent ? 'text-primary text-base' : 'text-charcoal text-sm',
                    )}>
                      {item.title}
                      {item.isCurrent && (
                        <span className="inline-flex items-center gap-1 ml-2">
                          <Loader2 size={14} className="animate-spin" />
                          {t('inProgress')}
                        </span>
                      )}
                    </h4>
                    {item.timestamp && (
                      <span className="font-body text-muted-foreground text-xs">
                        {formatDate(new Date(item.timestamp), locale)}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-muted-foreground mt-1 text-sm">
                    {item.description}
                  </p>
                  {item.location && !compact && (
                    <p className="font-body text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
