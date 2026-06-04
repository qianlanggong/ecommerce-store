// =========================================================================
// 物流追踪服务层 - 基于 TanStack Query (React Query) 的封装
// =========================================================================
// 服务层职责：
// 1. 封装适配器层 + React Query Hooks
// 2. 统一管理数据缓存策略
// 3. 提供物流追踪相关的查询和操作

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'
import { useTranslation } from 'react-i18next'
import { TrackingEventType, TrackingExceptionType, TrackingExceptionSeverity, FulfillmentStatus } from '@/types'
import type {
  TrackingFilter,
  TrackingResult,
  TrackingUserError,
  CarrierInfo,
  Fulfillment,
  TrackingTimeline,
  TrackingException,
} from '@/types'

// =========================================================================
// Query Keys - 用于 React Query 缓存键定义
// 规范：使用层级结构，便于批量失效和精确匹配
// =========================================================================

/**
 * 物流追踪相关缓存键定义
 *
 * 采用层级结构设计：
 * - all: 顶级键，用于批量失效所有物流相关数据
 * - tracking: 单个物流追踪
 * - trackingList: 物流追踪列表
 * - fulfillment: 发货信息
 * - carrier: 物流服务商信息
 * - order: 订单相关的物流信息
 *
 * 使用 as const 确保类型安全
 */
export const trackingKeys = {
  all: ['tracking'] as const,
  tracking: () => [...trackingKeys.all, 'tracking'] as const,
  trackingById: (trackingId: string) => [...trackingKeys.tracking(), trackingId] as const,
  trackingByOrder: (orderId: string) => [...trackingKeys.all, 'order', orderId] as const,
  trackingByNumber: (trackingNumber: string) => [...trackingKeys.tracking(), 'number', trackingNumber] as const,
  trackingByFulfillment: (fulfillmentId: string) => [...trackingKeys.tracking(), 'fulfillment', fulfillmentId] as const,
  trackingList: (filter: TrackingFilter) => [...trackingKeys.tracking(), 'list', filter] as const,
  fulfillment: () => [...trackingKeys.all, 'fulfillment'] as const,
  fulfillmentByOrder: (orderId: string) => [...trackingKeys.fulfillment(), orderId] as const,
  carrier: () => [...trackingKeys.all, 'carrier'] as const,
  carrierByCode: (carrierCode: string) => [...trackingKeys.carrier(), carrierCode] as const,
  carrierList: () => [...trackingKeys.carrier(), 'list'] as const,
}

// =========================================================================
// 本地辅助函数
// =========================================================================

/**
 * 显示 Toast 通知
 */
function addToast(message: string, type: 'success' | 'error' | 'info' | 'warning'): void {
  useToastStore.getState().addToast(message, type)
}

// =========================================================================
// 物流追踪查询
// =========================================================================

/**
 * 根据订单 ID 获取物流追踪信息
 *
 * @param orderId - 订单 ID
 * @returns React Query 结果对象，包含物流追踪列表和加载状态
 */
export function useTrackingByOrder(orderId: string) {
  return useQuery({
    queryKey: trackingKeys.trackingByOrder(orderId),
    queryFn: async () => {
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      return adapter.getTrackingByOrder(orderId, currentAccessToken || undefined)
    },
    enabled: !!orderId,
    staleTime: 30 * 1000, // 30 秒缓存
    refetchInterval: 60 * 1000, // 每分钟自动刷新
  })
}

/**
 * 根据追踪单号获取物流追踪信息
 *
 * @param trackingNumber - 物流追踪单号
 * @returns React Query 结果对象
 */
export function useTrackingByNumber(trackingNumber: string) {
  return useQuery({
    queryKey: trackingKeys.trackingByNumber(trackingNumber),
    queryFn: async (): Promise<TrackingResult> => {
      return adapter.getTrackingByNumber(trackingNumber)
    },
    enabled: !!trackingNumber,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

/**
 * 根据 Fulfillment ID 获取物流追踪信息
 *
 * @param fulfillmentId - Fulfillment ID
 * @returns React Query 结果对象
 */
export function useTrackingByFulfillment(fulfillmentId: string) {
  return useQuery({
    queryKey: trackingKeys.trackingByFulfillment(fulfillmentId),
    queryFn: async (): Promise<TrackingResult> => {
      return adapter.getTrackingByFulfillment(fulfillmentId)
    },
    enabled: !!fulfillmentId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  })
}

/**
 * 批量查询物流追踪信息
 *
 * @param filter - 查询筛选条件
 * @returns React Query 结果对象
 */
export function useTrackings(filter?: TrackingFilter) {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: trackingKeys.trackingList(filter || {}),
    queryFn: async () => {
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      return adapter.getTrackings(filter, currentAccessToken || undefined)
    },
    enabled: !!accessToken,
    staleTime: 30 * 1000,
  })
}

/**
 * 获取订单的 Fulfillment 列表
 *
 * @param orderId - 订单 ID
 * @returns React Query 结果对象
 */
export function useFulfillmentsByOrder(orderId: string) {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: trackingKeys.fulfillmentByOrder(orderId),
    queryFn: async (): Promise<Fulfillment[]> => {
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      return adapter.getFulfillmentsByOrder(orderId, currentAccessToken || undefined)
    },
    enabled: !!orderId && !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
  })
}

// =========================================================================
// 物流服务商查询
// =========================================================================

/**
 * 获取物流服务商信息
 *
 * @param carrierCode - 物流服务商代码
 * @returns React Query 结果对象
 */
export function useCarrierInfo(carrierCode: string) {
  return useQuery({
    queryKey: trackingKeys.carrierByCode(carrierCode),
    queryFn: async (): Promise<CarrierInfo | null> => {
      return adapter.getCarrierInfo(carrierCode)
    },
    enabled: !!carrierCode,
    staleTime: 24 * 60 * 60 * 1000, // 24 小时缓存
  })
}

/**
 * 获取所有支持的物流服务商列表
 *
 * @returns React Query 结果对象
 */
export function useSupportedCarriers() {
  return useQuery({
    queryKey: trackingKeys.carrierList(),
    queryFn: async (): Promise<CarrierInfo[]> => {
      return adapter.getSupportedCarriers()
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 小时缓存
  })
}

// =========================================================================
// 物流追踪操作 Mutations
// =========================================================================

/**
 * 刷新物流追踪信息 Mutation
 *
 * 强制从物流服务商获取最新的追踪信息。
 *
 * @returns Mutation 对象
 */
export function useRefreshTracking() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('fulfillment')

  return useMutation({
    mutationFn: async (trackingId: string): Promise<TrackingResult> => {
      return adapter.refreshTracking(trackingId)
    },
    onSuccess: (result) => {
      if (result.tracking) {
        queryClient.setQueryData(trackingKeys.trackingById(result.tracking.id), result.tracking)
        queryClient.invalidateQueries({ queryKey: trackingKeys.tracking() })
        addToast(t('trackingRefreshed'), 'success')
      } else if (result.userErrors.length > 0) {
        addToast(result.userErrors[0].message, 'error')
      }
    },
    onError: () => {
      addToast(t('trackingRefreshError'), 'error')
    },
  })
}

/**
 * 订阅物流追踪更新 Mutation
 *
 * @returns Mutation 对象
 */
export function useSubscribeTrackingUpdates() {
  const { t } = useTranslation('fulfillment')

  return useMutation({
    mutationFn: async ({
      trackingId,
      webhookUrl,
      email,
    }: {
      trackingId: string
      webhookUrl?: string
      email?: string
    }): Promise<{ success: boolean; userErrors: TrackingUserError[] }> => {
      return adapter.subscribeTrackingUpdates(trackingId, webhookUrl, email)
    },
    onSuccess: (result) => {
      if (result.success) {
        addToast(t('subscriptionSuccess'), 'success')
      } else if (result.userErrors.length > 0) {
        addToast(result.userErrors[0].message, 'error')
      }
    },
    onError: () => {
      addToast(t('subscriptionError'), 'error')
    },
  })
}

/**
 * 取消物流追踪更新订阅 Mutation
 *
 * @returns Mutation 对象
 */
export function useUnsubscribeTrackingUpdates() {
  const { t } = useTranslation('fulfillment')

  return useMutation({
    mutationFn: async (trackingId: string): Promise<{ success: boolean; userErrors: TrackingUserError[] }> => {
      return adapter.unsubscribeTrackingUpdates(trackingId)
    },
    onSuccess: (result) => {
      if (result.success) {
        addToast(t('unsubscriptionSuccess'), 'success')
      } else if (result.userErrors.length > 0) {
        addToast(result.userErrors[0].message, 'error')
      }
    },
    onError: () => {
      addToast(t('unsubscriptionError'), 'error')
    },
  })
}

// =========================================================================
// 辅助工具函数
// =========================================================================

/**
 * 获取物流状态对应的图标名称
 *
 * @param status - 物流状态
 * @returns Lucide 图标名称
 */
export function getTrackingIcon(status: FulfillmentStatus | TrackingEventType): string {
  switch (status) {
    case FulfillmentStatus.DELIVERED:
    case TrackingEventType.DELIVERED:
      return 'CheckCircle'
    case FulfillmentStatus.IN_TRANSIT:
    case TrackingEventType.IN_TRANSIT:
      return 'Truck'
    case FulfillmentStatus.OUT_FOR_DELIVERY:
    case TrackingEventType.OUT_FOR_DELIVERY:
      return 'PackageCheck'
    case FulfillmentStatus.FULFILLED:
    case TrackingEventType.SHIPPED:
      return 'Send'
    case FulfillmentStatus.CONFIRMED:
    case TrackingEventType.ORDER_CONFIRMED:
      return 'ShoppingBag'
    case FulfillmentStatus.ATTEMPTED_DELIVERY:
    case TrackingEventType.ATTEMPTED_DELIVERY:
      return 'AlertTriangle'
    case FulfillmentStatus.FAILURE:
    case TrackingEventType.FAILED:
      return 'XCircle'
    case FulfillmentStatus.ERROR:
    case TrackingEventType.LOST:
      return 'AlertOctagon'
    default:
      return 'Clock'
  }
}

/**
 * 获取物流状态对应的颜色
 *
 * @param status - 物流状态
 * @returns Tailwind CSS 颜色类名
 */
export function getTrackingColor(status: FulfillmentStatus | TrackingEventType): string {
  switch (status) {
    case FulfillmentStatus.DELIVERED:
    case TrackingEventType.DELIVERED:
      return 'text-green-600 bg-green-100'
    case FulfillmentStatus.IN_TRANSIT:
    case TrackingEventType.IN_TRANSIT:
    case FulfillmentStatus.OUT_FOR_DELIVERY:
    case TrackingEventType.OUT_FOR_DELIVERY:
      return 'text-blue-600 bg-blue-100'
    case FulfillmentStatus.FULFILLED:
    case TrackingEventType.SHIPPED:
      return 'text-purple-600 bg-purple-100'
    case FulfillmentStatus.CONFIRMED:
    case TrackingEventType.ORDER_CONFIRMED:
    case TrackingEventType.PACKING:
    case TrackingEventType.PACKED:
      return 'text-yellow-600 bg-yellow-100'
    case FulfillmentStatus.ATTEMPTED_DELIVERY:
    case TrackingEventType.ATTEMPTED_DELIVERY:
      return 'text-orange-600 bg-orange-100'
    case FulfillmentStatus.FAILURE:
    case TrackingEventType.FAILED:
    case TrackingEventType.RETURNED:
    case TrackingEventType.LOST:
    case FulfillmentStatus.ERROR:
      return 'text-red-600 bg-red-100'
    case TrackingEventType.HELD:
    case TrackingEventType.CUSTOMS:
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-500 bg-gray-100'
  }
}

/**
 * 生成物流时间线数据
 *
 * 将物流追踪事件转换为 UI 友好的时间线数据格式。
 *
 * @param events - 物流追踪事件列表
 * @param locale - 当前语言
 * @returns 时间线数据数组
 */
export function generateTimeline(events: TrackingEventType[], locale: string = 'en'): TrackingTimeline[] {
  void locale
  const timelineStages: Array<{
    status: TrackingEventType
    icon: string
    color: string
  }> = [
    { status: TrackingEventType.ORDER_PLACED, icon: 'ShoppingBag', color: 'text-primary bg-primary/10' },
    { status: TrackingEventType.ORDER_CONFIRMED, icon: 'CheckCircle', color: 'text-primary bg-primary/10' },
    { status: TrackingEventType.PACKING, icon: 'Package', color: 'text-yellow-600 bg-yellow-100' },
    { status: TrackingEventType.PACKED, icon: 'Box', color: 'text-yellow-600 bg-yellow-100' },
    { status: TrackingEventType.SHIPPED, icon: 'Send', color: 'text-purple-600 bg-purple-100' },
    { status: TrackingEventType.IN_TRANSIT, icon: 'Truck', color: 'text-blue-600 bg-blue-100' },
    { status: TrackingEventType.OUT_FOR_DELIVERY, icon: 'PackageCheck', color: 'text-blue-600 bg-blue-100' },
    { status: TrackingEventType.DELIVERED, icon: 'CheckCircle2', color: 'text-green-600 bg-green-100' },
  ]

  const completedEvents = new Set(events)

  let foundCurrent = false
  return timelineStages.map((stage, index) => {
    const isCompleted = completedEvents.has(stage.status)
    const isCurrent = isCompleted && !foundCurrent && index < timelineStages.length - 1 &&
      !completedEvents.has(timelineStages[index + 1].status)
    const isLastCurrent = isCompleted && !foundCurrent && index === timelineStages.length - 1

    if (isCurrent || isLastCurrent) {
      foundCurrent = true
    }

    return {
      id: `timeline-${index}`,
      status: stage.status,
      title: stage.status, // 实际使用时通过翻译函数转换
      description: '', // 实际使用时从事件中获取
      timestamp: '', // 实际使用时从事件中获取
      isCompleted,
      isCurrent: isCurrent || isLastCurrent,
      isEstimated: !isCompleted,
      icon: stage.icon,
      color: stage.color,
    }
  })
}

/**
 * 检查是否存在异常物流状态
 *
 * @param events - 物流追踪事件列表
 * @returns 异常信息，如果没有异常返回 null
 */
export function checkTrackingException(events: TrackingEventType[]): TrackingException | null {
  const exceptionEvents = [
    TrackingEventType.FAILED,
    TrackingEventType.LOST,
    TrackingEventType.RETURNED,
    TrackingEventType.ATTEMPTED_DELIVERY,
    TrackingEventType.HELD,
    TrackingEventType.CUSTOMS,
  ]

  const hasException = events.some(event => exceptionEvents.includes(event))

  if (!hasException) {
    return null
  }

  // 返回模拟的异常信息，实际应从 API 获取
  return {
    id: 'exception-1',
    type: TrackingExceptionType.OTHER,
    severity: TrackingExceptionSeverity.MEDIUM,
    code: 'DELIVERY_ATTEMPT_FAILED',
    message: 'Delivery attempt failed',
    description: 'The recipient was not available at the time of delivery. A second attempt will be made.',
    resolution: 'Please ensure someone is available to receive the package, or contact the carrier to reschedule.',
    actionRequired: true,
    reportedAt: new Date().toISOString(),
    isResolved: false,
    updates: [],
  }
}

/**
 * 格式化物流追踪时间
 *
 * @param timestamp - 时间戳
 * @param locale - 语言
 * @returns 格式化后的时间字符串
 */
export function formatTrackingTime(timestamp: string, locale: string = 'en'): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) {
    return locale === 'zh' ? '刚刚' : 'Just now'
  } else if (diffMins < 60) {
    return locale === 'zh' ? `${diffMins} 分钟前` : `${diffMins} mins ago`
  } else if (diffHours < 24) {
    return locale === 'zh' ? `${diffHours} 小时前` : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return locale === 'zh' ? `${diffDays} 天前` : `${diffDays} days ago`
  } else {
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

// 导出适配器实例，供特殊场景直接使用
export { adapter }
