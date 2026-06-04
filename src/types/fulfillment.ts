import type { Money, PageInfo, UserError } from './index'

/**
 * 物流追踪事件类型
 *
 * 定义物流追踪事件的类型，表示包裹在运输过程中的不同状态。
 *
 * @enum TrackingEventType
 */
export enum TrackingEventType {
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  PACKING = 'PACKING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  ATTEMPTED_DELIVERY = 'ATTEMPTED_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  LOST = 'LOST',
  HELD = 'HELD',
  CUSTOMS = 'CUSTOMS',
}

/**
 * 物流追踪事件接口
 *
 * 表示物流追踪中的单个事件，包含事件类型、时间、地点、描述等信息。
 *
 * @interface TrackingEvent
 */
export interface TrackingEvent {
  id: string
  type: TrackingEventType
  status: string
  description: string
  location?: string
  address?: string
  city?: string
  province?: string
  country?: string
  zip?: string
  latitude?: number
  longitude?: number
  timestamp: string
  isEstimated?: boolean
  deliveryAttempt?: number
  signatureRequired?: boolean
  signedBy?: string
  estimatedDeliveryAt?: string
  updatedAt: string
  createdAt: string
}

/**
 * 物流追踪信息接口
 *
 * 表示完整的物流追踪信息，包含所有追踪事件、承运商信息、预计送达时间等。
 *
 * @interface TrackingInfo
 */
export interface TrackingInfo {
  id: string
  fulfillmentId?: string
  orderId?: string
  orderName?: string
  trackingNumber: string
  trackingUrl?: string
  carrier: string
  carrierCode?: string
  carrierLogoUrl?: string
  status: FulfillmentStatus
  originAddress?: TrackingAddress
  destinationAddress?: TrackingAddress
  currentLocation?: TrackingAddress
  estimatedDeliveryAt?: string
  estimatedDeliveryFrom?: string
  estimatedDeliveryTo?: string
  actualDeliveryAt?: string
  shippedAt?: string
  deliveredAt?: string
  inTransitAt?: string
  outForDeliveryAt?: string
  attemptedDeliveryAt?: string
  returnedAt?: string
  events: TrackingEvent[]
  latestEvent?: TrackingEvent
  timeline: TrackingTimeline[]
  exception?: TrackingException
  deliveryWindow?: TrackingDeliveryWindow
  proofOfDelivery?: TrackingProofOfDelivery
  totalDistance?: number
  remainingDistance?: number
  updatedAt: string
  createdAt: string
}

/**
 * 物流追踪时间线项目接口
 *
 * 用于在 UI 中展示物流进度的时间线。
 *
 * @interface TrackingTimeline
 */
export interface TrackingTimeline {
  id: string
  status: TrackingEventType
  title: string
  description: string
  location?: string
  timestamp: string
  isCompleted: boolean
  isCurrent: boolean
  isEstimated: boolean
  icon: string
  color: string
}

/**
 * 物流地址接口
 *
 * 表示物流相关的地址信息，包含详细的地址字段和坐标。
 *
 * @interface TrackingAddress
 */
export interface TrackingAddress {
  id?: string
  name?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  provinceCode?: string
  country?: string
  countryCode?: string
  zip?: string
  phone?: string
  latitude?: number
  longitude?: number
  formattedAddress?: string
}

/**
 * 物流异常信息接口
 *
 * 表示物流过程中发生的异常情况，如延迟、丢失、破损等。
 *
 * @interface TrackingException
 */
export interface TrackingException {
  id: string
  type: TrackingExceptionType
  severity: TrackingExceptionSeverity
  code: string
  message: string
  description?: string
  resolution?: string
  actionRequired?: boolean
  actionDeadline?: string
  contactInfo?: TrackingContactInfo
  reportedAt: string
  resolvedAt?: string
  isResolved: boolean
  updates: TrackingExceptionUpdate[]
}

/**
 * 物流异常类型枚举
 *
 * @enum TrackingExceptionType
 */
export enum TrackingExceptionType {
  DELAYED = 'DELAYED',
  LOST = 'LOST',
  DAMAGED = 'DAMAGED',
  MISSING_ITEMS = 'MISSING_ITEMS',
  WRONG_ADDRESS = 'WRONG_ADDRESS',
  CUSTOMS_HOLD = 'CUSTOMS_HOLD',
  WEATHER_DELAY = 'WEATHER_DELAY',
  STRIKE = 'STRIKE',
  HOLIDAY_DELAY = 'HOLIDAY_DELAY',
  RETURN_TO_SENDER = 'RETURN_TO_SENDER',
  REFUSED = 'REFUSED',
  UNDELIVERABLE = 'UNDELIVERABLE',
  OTHER = 'OTHER',
}

/**
 * 物流异常严重程度枚举
 *
 * @enum TrackingExceptionSeverity
 */
export enum TrackingExceptionSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * 物流异常更新接口
 *
 * 表示物流异常的处理进度更新。
 *
 * @interface TrackingExceptionUpdate
 */
export interface TrackingExceptionUpdate {
  id: string
  message: string
  status: string
  timestamp: string
  updatedBy?: string
}

/**
 * 物流联系信息接口
 *
 * @interface TrackingContactInfo
 */
export interface TrackingContactInfo {
  name?: string
  phone?: string
  email?: string
  website?: string
  workingHours?: string
}

/**
 * 物流配送时间窗口接口
 *
 * @interface TrackingDeliveryWindow
 */
export interface TrackingDeliveryWindow {
  startAt: string
  endAt: string
  timezone?: string
  format?: string
}

/**
 * 物流送达证明接口
 *
 * @interface TrackingProofOfDelivery
 */
export interface TrackingProofOfDelivery {
  type: TrackingProofType
  signature?: string
  signatureImageUrl?: string
  photoUrls?: string[]
  deliveredTo?: string
  locationDescription?: string
  timestamp: string
}

/**
 * 物流送达证明类型枚举
 *
 * @enum TrackingProofType
 */
export enum TrackingProofType {
  SIGNATURE = 'SIGNATURE',
  PHOTO = 'PHOTO',
  LEAVE_AT_DOOR = 'LEAVE_AT_DOOR',
  NEIGHBOR = 'NEIGHBOR',
  OFFICE = 'OFFICE',
  OTHER = 'OTHER',
}

/**
 * 物流追踪连接接口
 *
 * 用于分页查询物流追踪信息。
 *
 * @interface TrackingInfoConnection
 */
export interface TrackingInfoConnection {
  edges: Array<{ node: TrackingInfo; cursor: string }>
  pageInfo: PageInfo
  totalCount?: number
}

/**
 * 物流追踪查询参数接口
 *
 * @interface TrackingFilter
 */
export interface TrackingFilter {
  orderId?: string
  orderName?: string
  trackingNumber?: string
  fulfillmentId?: string
  carrier?: string
  status?: FulfillmentStatus
  startDate?: string
  endDate?: string
  hasExceptions?: boolean
  first?: number
  last?: number
  after?: string
  before?: string
}

/**
 * 物流追踪用户错误接口
 *
 * @interface TrackingUserError
 */
export interface TrackingUserError extends UserError {
  code?: TrackingErrorCode
}

/**
 * 物流追踪错误代码枚举
 *
 * @enum TrackingErrorCode
 */
export enum TrackingErrorCode {
  TRACKING_NUMBER_INVALID = 'TRACKING_NUMBER_INVALID',
  TRACKING_NOT_FOUND = 'TRACKING_NOT_FOUND',
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  FULFILLMENT_NOT_FOUND = 'FULFILLMENT_NOT_FOUND',
  CARRIER_NOT_SUPPORTED = 'CARRIER_NOT_SUPPORTED',
  TRACKING_UNAVAILABLE = 'TRACKING_UNAVAILABLE',
  TRACKING_EXPIRED = 'TRACKING_EXPIRED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNKNOWN = 'UNKNOWN',
}

/**
 * 物流追踪结果接口
 *
 * @interface TrackingResult
 */
export interface TrackingResult {
  tracking?: TrackingInfo
  userErrors: TrackingUserError[]
}

/**
 * 物流服务商信息接口
 *
 * @interface CarrierInfo
 */
export interface CarrierInfo {
  name: string
  code: string
  logoUrl?: string
  website?: string
  trackingUrl?: string
  phone?: string
  email?: string
  services?: CarrierService[]
  supportedCountries?: string[]
  features?: CarrierFeature[]
}

/**
 * 物流服务商服务接口
 *
 * @interface CarrierService
 */
export interface CarrierService {
  code: string
  name: string
  description?: string
  estimatedDeliveryDays?: {
    min: number
    max: number
  }
  price?: Money
  features?: string[]
}

/**
 * 物流服务商特性接口
 *
 * @interface CarrierFeature
 */
export interface CarrierFeature {
  code: string
  name: string
  description?: string
  available: boolean
}

/**
 * 导入 FulfillmentStatus 枚举
 */
import { FulfillmentStatus } from './order'

export { FulfillmentStatus }
