import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertTriangle,
  AlertOctagon,
  Clock,
  Phone,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { checkTrackingException, formatTrackingTime } from '@/services/fulfillmentService'
import { useRefreshTracking } from '@/services/fulfillmentService'
import type { TrackingEventType, TrackingExceptionSeverity } from '@/types'

interface TrackingExceptionAlertProps {
  trackingId: string
  events: TrackingEventType[]
  className?: string
}

const severityColors: Record<TrackingExceptionSeverity, string> = {
  LOW: 'bg-blue-50 border-blue-200 text-blue-800',
  MEDIUM: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  HIGH: 'bg-orange-50 border-orange-200 text-orange-800',
  CRITICAL: 'bg-red-50 border-red-200 text-red-800',
}

const severityIcons: Record<TrackingExceptionSeverity, React.ElementType> = {
  LOW: Clock,
  MEDIUM: AlertTriangle,
  HIGH: AlertTriangle,
  CRITICAL: AlertOctagon,
}

export default function TrackingExceptionAlert({
  trackingId,
  events,
  className,
}: TrackingExceptionAlertProps) {
  const { t, i18n } = useTranslation('fulfillment')
  const [isExpanded, setIsExpanded] = useState(true)
  const refreshTracking = useRefreshTracking()

  const exception = checkTrackingException(events)

  if (!exception) {
    return null
  }

  const SeverityIcon = severityIcons[exception.severity]

  const handleRefresh = () => {
    refreshTracking.mutate(trackingId)
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        severityColors[exception.severity],
        className,
      )}
      role="alert"
    >
      {/* 头部 */}
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          <SeverityIcon className="flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-body font-semibold text-sm">
              {t(`exception.${exception.type.toLowerCase()}`)}
            </h4>
            <p className="font-body text-sm opacity-80 mt-0.5">
              {exception.message}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {exception.actionRequired && (
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-white/50 text-xs font-medium">
              {t('actionRequired')}
            </span>
          )}
          {isExpanded ? (
            <ChevronUp size={18} className="flex-shrink-0" />
          ) : (
            <ChevronDown size={18} className="flex-shrink-0" />
          )}
        </div>
      </div>

      {/* 展开内容 */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* 详细描述 */}
          {exception.description && (
            <div className="bg-white/30 rounded-lg p-3">
              <p className="font-body text-sm">{exception.description}</p>
            </div>
          )}

          {/* 解决方案 */}
          {exception.resolution && (
            <div>
              <h5 className="font-body font-semibold text-xs uppercase tracking-wide opacity-70 mb-2">
                {t('suggestedSolution')}
              </h5>
              <p className="font-body text-sm">{exception.resolution}</p>
            </div>
          )}

          {/* 截止时间 */}
          {exception.actionDeadline && (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} />
              <span>
                {t('actionDeadline')}:{' '}
                <span className="font-semibold">
                  {formatTrackingTime(exception.actionDeadline, i18n.language)}
                </span>
              </span>
            </div>
          )}

          {/* 联系方式 */}
          {exception.contactInfo && (
            <div>
              <h5 className="font-body font-semibold text-xs uppercase tracking-wide opacity-70 mb-2">
                {t('contactInfo')}
              </h5>
              <div className="space-y-2">
                {exception.contactInfo.name && (
                  <p className="font-body text-sm">{exception.contactInfo.name}</p>
                )}
                <div className="flex flex-wrap gap-4">
                  {exception.contactInfo.phone && (
                    <a
                      href={`tel:${exception.contactInfo.phone}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Phone size={14} />
                      {exception.contactInfo.phone}
                    </a>
                  )}
                  {exception.contactInfo.email && (
                    <a
                      href={`mailto:${exception.contactInfo.email}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Mail size={14} />
                      {exception.contactInfo.email}
                    </a>
                  )}
                  {exception.contactInfo.website && (
                    <a
                      href={exception.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <Globe size={14} />
                      {t('visitWebsite')}
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {exception.contactInfo.workingHours && (
                  <p className="font-body text-sm opacity-80">
                    {t('workingHours')}: {exception.contactInfo.workingHours}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 处理进度 */}
          {exception.updates.length > 0 && (
            <div>
              <h5 className="font-body font-semibold text-xs uppercase tracking-wide opacity-70 mb-2">
                {t('resolutionProgress')}
              </h5>
              <div className="space-y-2">
                {exception.updates.map((update) => (
                  <div
                    key={update.id}
                    className="bg-white/30 rounded-lg p-3 text-sm"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{update.status}</span>
                      <span className="text-xs opacity-70">
                        {formatTrackingTime(update.timestamp, i18n.language)}
                      </span>
                    </div>
                    <p className="opacity-80">{update.message}</p>
                    {update.updatedBy && (
                      <p className="text-xs opacity-60 mt-1">
                        {t('updatedBy')}: {update.updatedBy}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshTracking.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={cn(refreshTracking.isPending && 'animate-spin')}
              />
              {t('refreshTracking')}
            </button>
          </div>

          {/* 报告时间 */}
          <div className="flex items-center justify-between text-xs opacity-60 pt-2 border-t border-current/20">
            <span>
              {t('reportedAt')}:{' '}
              {formatTrackingTime(exception.reportedAt, i18n.language)}
            </span>
            {exception.resolvedAt && (
              <span>
                {t('resolvedAt')}:{' '}
                {formatTrackingTime(exception.resolvedAt, i18n.language)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
