import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Package,
  Search,
  Loader2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Bell,
  BellOff,
} from 'lucide-react'
import { useLocale } from '@/hooks/useLocale'
import { useOrderTrackingSEO } from '@/hooks/useSEO'
import { cn } from '@/lib/utils'
import {
  useTrackingByNumber,
  useSubscribeTrackingUpdates,
  useUnsubscribeTrackingUpdates,
} from '@/services/fulfillmentService'
import TrackingCard from '@/components/fulfillment/TrackingCard'
import { useToastStore } from '@/stores/toastStore'

export default function OrderTrackingPage() {
  const { t } = useTranslation('fulfillment')
  const { localizePath } = useLocale()
  const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber: string }>()
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || '')
  const [searchValue, setSearchValue] = useState(urlTrackingNumber || '')
  const [hasSearched, setHasSearched] = useState(!!urlTrackingNumber)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [showSubscribeForm, setShowSubscribeForm] = useState(false)
  const addToast = useToastStore((state) => state.addToast)

  // 同步 URL 参数到搜索框
  useEffect(() => {
    if (urlTrackingNumber) {
      setSearchValue(urlTrackingNumber)
      setTrackingNumber(urlTrackingNumber)
      setHasSearched(true)
    }
  }, [urlTrackingNumber])

  // 查询物流信息
  const {
    data: trackingResult,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useTrackingByNumber(hasSearched ? trackingNumber : '')

  // 订阅/取消订阅
  const subscribeMutation = useSubscribeTrackingUpdates()
  const unsubscribeMutation = useUnsubscribeTrackingUpdates()

  const handleSearch = () => {
    const value = searchValue.trim()
    if (!value) {
      addToast(t('trackingNumberRequired'), 'warning')
      return
    }
    setTrackingNumber(value)
    setHasSearched(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleRefresh = () => {
    if (trackingNumber) {
      refetch()
      addToast(t('trackingRefreshed'), 'info')
    }
  }

  const handleSubscribe = () => {
    if (!trackingResult?.tracking) return

    if (isSubscribed) {
      unsubscribeMutation.mutate(trackingResult.tracking.id)
      setIsSubscribed(false)
    } else if (email) {
      subscribeMutation.mutate({
        trackingId: trackingResult.tracking.id,
        email,
      })
      setIsSubscribed(true)
      setShowSubscribeForm(false)
      setEmail('')
    } else {
      setShowSubscribeForm(true)
    }
  }

  const tracking = trackingResult?.tracking
  const hasError = trackingResult?.userErrors && trackingResult.userErrors.length > 0

  useOrderTrackingSEO(tracking, hasSearched ? trackingNumber : '')

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Link
          to={localizePath('/account/orders')}
          className="font-body text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          {t('backToOrders')}
        </Link>
      </div>

      {/* 页面标题 */}
      <div className="text-center mb-8">
        <div className="bg-primary/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Package size={40} className="text-primary" />
        </div>
        <h1 className="font-display text-charcoal text-3xl md:text-4xl font-bold mb-2">
          {t('orderTracking')}
        </h1>
        <p className="font-body text-muted-foreground max-w-md mx-auto">
          {t('orderTrackingDescription')}
        </p>
      </div>

      {/* 搜索框 */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('enterTrackingNumber')}
              className="w-full px-5 py-4 pl-12 rounded-2xl border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all font-body text-charcoal text-lg"
              aria-label={t('trackingNumber')}
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            disabled={isLoading || isRefetching}
            className="px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
          >
            {isLoading || isRefetching ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            {t('track')}
          </button>
        </div>

        {/* 订阅通知 */}
        {hasSearched && tracking && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              {isSubscribed ? (
                <Bell size={18} className="text-primary" />
              ) : (
                <BellOff size={18} className="text-muted-foreground" />
              )}
              <span className="font-body text-charcoal text-sm">
                {isSubscribed ? t('subscribed') : t('notSubscribed')}
              </span>
            </div>

            {showSubscribeForm ? (
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none text-sm w-48"
                />
                <button
                  type="button"
                  onClick={handleSubscribe}
                  disabled={!email || subscribeMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 disabled:opacity-50"
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    t('confirm')
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubscribeForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-100"
                >
                  {t('cancel')}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribeMutation.isPending || unsubscribeMutation.isPending}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isSubscribed
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-primary hover:bg-primary/10',
                )}
              >
                {isSubscribed ? (
                  <>
                    <BellOff size={16} />
                    {t('unsubscribe')}
                  </>
                ) : (
                  <>
                    <Bell size={16} />
                    {t('subscribe')}
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-charcoal hover:bg-gray-100 transition-colors"
            >
              <RefreshCw
                size={16}
                className={cn(isRefetching && 'animate-spin')}
              />
              {t('refresh')}
            </button>
          </div>
        )}
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="text-primary h-12 w-12 animate-spin mb-4" />
          <p className="font-body text-muted-foreground">{t('loading')}</p>
        </div>
      )}

      {/* 错误状态 */}
      {(error || hasError) && !isLoading && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4 h-16 w-16" />
            <h2 className="font-display text-charcoal text-xl font-semibold mb-2">
              {t('trackingError')}
            </h2>
            <p className="font-body text-muted-foreground mb-4">
              {error instanceof Error
                ? error.message
                : hasError
                  ? trackingResult?.userErrors[0]?.message
                  : t('trackingNumberNotFound')}
            </p>
            <button
              type="button"
              onClick={() => setHasSearched(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
            >
              <ArrowLeft size={18} />
              {t('tryAgain')}
            </button>
          </div>
        </div>
      )}

      {/* 物流追踪结果 */}
      {hasSearched && tracking && !isLoading && !error && !hasError && (
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <TrackingCard tracking={tracking} />

          {/* 快捷操作 */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              to={localizePath('/account/orders')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 hover:border-primary text-charcoal hover:text-primary font-medium transition-all"
            >
              <Package size={18} />
              {t('viewAllOrders')}
            </Link>
            <Link
              to={localizePath('/account')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium transition-all shadow-lg hover:shadow-xl"
            >
              {t('goToAccount')}
            </Link>
          </div>
        </div>
      )}

      {/* 初始状态 - 未搜索 */}
      {!hasSearched && !isLoading && (
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {/* 步骤 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-display text-charcoal font-semibold mb-2">
                {t('step1Title')}
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                {t('step1Description')}
              </p>
            </div>

            {/* 步骤 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-display text-charcoal font-semibold mb-2">
                {t('step2Title')}
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                {t('step2Description')}
              </p>
            </div>

            {/* 步骤 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-display text-charcoal font-semibold mb-2">
                {t('step3Title')}
              </h3>
              <p className="font-body text-muted-foreground text-sm">
                {t('step3Description')}
              </p>
            </div>
          </div>

          {/* 常见问题 */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-6 md:p-8">
            <h3 className="font-display text-charcoal text-xl font-semibold mb-6 text-center">
              {t('faqTitle')}
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-body text-charcoal font-semibold mb-1">
                  {t('faq1Question')}
                </h4>
                <p className="font-body text-muted-foreground text-sm">
                  {t('faq1Answer')}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-body text-charcoal font-semibold mb-1">
                  {t('faq2Question')}
                </h4>
                <p className="font-body text-muted-foreground text-sm">
                  {t('faq2Answer')}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4">
                <h4 className="font-body text-charcoal font-semibold mb-1">
                  {t('faq3Question')}
                </h4>
                <p className="font-body text-muted-foreground text-sm">
                  {t('faq3Answer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
