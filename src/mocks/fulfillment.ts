import type {
  TrackingInfo,
  TrackingEvent,
  CarrierInfo,
  Fulfillment,
} from '@/types'
import {
  TrackingEventType,
  FulfillmentStatus,
  TrackingExceptionType,
  TrackingExceptionSeverity,
} from '@/types'

/**
 * 生成模拟的物流追踪事件
 *
 * @param status - 物流当前状态，用于确定已完成哪些事件
 * @returns 物流追踪事件数组
 */
function generateTrackingEvents(
  status: FulfillmentStatus,
): TrackingEvent[] {
  const now = new Date()
  const baseTime = now.getTime() - 7 * 24 * 60 * 60 * 1000 // 7天前

  const eventTypes: TrackingEventType[] = [
    TrackingEventType.ORDER_PLACED,
    TrackingEventType.ORDER_CONFIRMED,
    TrackingEventType.PACKING,
    TrackingEventType.PACKED,
    TrackingEventType.SHIPPED,
    TrackingEventType.IN_TRANSIT,
    TrackingEventType.OUT_FOR_DELIVERY,
    TrackingEventType.DELIVERED,
  ]

  const statusToEventIndex: Record<FulfillmentStatus, number> = {
    [FulfillmentStatus.CONFIRMED]: 1,
    [FulfillmentStatus.FULFILLED]: 4,
    [FulfillmentStatus.IN_TRANSIT]: 5,
    [FulfillmentStatus.OUT_FOR_DELIVERY]: 6,
    [FulfillmentStatus.DELIVERED]: 7,
    [FulfillmentStatus.ATTEMPTED_DELIVERY]: 6,
    [FulfillmentStatus.FAILURE]: 5,
    [FulfillmentStatus.ERROR]: 5,
    [FulfillmentStatus.PARTIAL]: 4,
    [FulfillmentStatus.READY_FOR_PICKUP]: 6,
    [FulfillmentStatus.SCHEDULED]: 3,
    [FulfillmentStatus.SUBMITTED]: 2,
    [FulfillmentStatus.CANCELED]: 1,
  }

  const completedIndex = statusToEventIndex[status] ?? 1

  const locations = [
    'Los Angeles, CA',
    'Los Angeles, CA',
    'Los Angeles, CA',
    'Los Angeles, CA',
    'Los Angeles, CA',
    'Phoenix, AZ',
    'Dallas, TX',
    'New York, NY',
  ]

  const descriptions: Record<TrackingEventType, string> = {
    [TrackingEventType.ORDER_PLACED]: 'Order has been placed successfully',
    [TrackingEventType.ORDER_CONFIRMED]: 'Order has been confirmed by the seller',
    [TrackingEventType.PACKING]: 'Your package is being prepared for shipment',
    [TrackingEventType.PACKED]: 'Package has been packed and is ready for pickup',
    [TrackingEventType.SHIPPED]: 'Package has been shipped and is on its way',
    [TrackingEventType.IN_TRANSIT]: 'Package is in transit to destination',
    [TrackingEventType.OUT_FOR_DELIVERY]: 'Package is out for delivery today',
    [TrackingEventType.DELIVERED]: 'Package has been delivered successfully',
    [TrackingEventType.ATTEMPTED_DELIVERY]: 'Delivery attempt failed - recipient not available',
    [TrackingEventType.FAILED]: 'Delivery failed',
    [TrackingEventType.RETURNED]: 'Package has been returned to sender',
    [TrackingEventType.LOST]: 'Package has been lost in transit',
    [TrackingEventType.HELD]: 'Package is being held at carrier facility',
    [TrackingEventType.CUSTOMS]: 'Package is being processed by customs',
  }

  return eventTypes.slice(0, completedIndex + 1).map((type, index) => {
    const eventTime = new Date(baseTime + index * 12 * 60 * 60 * 1000)
    return {
      id: `event-${index}`,
      type,
      status: type,
      description: descriptions[type],
      location: locations[index],
      city: locations[index]?.split(', ')[0],
      province: locations[index]?.split(', ')[1],
      country: 'United States',
      timestamp: eventTime.toISOString(),
      updatedAt: eventTime.toISOString(),
      createdAt: eventTime.toISOString(),
    }
  })
}

/**
 * 生成模拟的物流追踪信息
 *
 * @param trackingNumber - 物流追踪号
 * @param status - 物流状态
 * @param orderName - 订单号
 * @returns 物流追踪信息
 */
export function generateMockTracking(
  trackingNumber: string,
  status: FulfillmentStatus = FulfillmentStatus.IN_TRANSIT,
  orderName: string = '#1001',
): TrackingInfo {
  const events = generateTrackingEvents(status)
  const now = new Date()
  const baseTime = now.getTime() - 5 * 24 * 60 * 60 * 1000

  const carriers: Record<string, CarrierInfo> = {
    DHL: {
      name: 'DHL Express',
      code: 'DHL',
      logoUrl: 'https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg',
      website: 'https://www.dhl.com',
      trackingUrl: `https://www.dhl.com/us-en/home/tracking?tracking-id=${trackingNumber}`,
      phone: '+1 800-225-5345',
      email: 'support@dhl.com',
      supportedCountries: ['US', 'CN', 'UK', 'DE', 'JP'],
    },
    FEDEX: {
      name: 'FedEx',
      code: 'FEDEX',
      logoUrl: 'https://www.fedex.com/content/dam/fedex-com/logos/fedex-logo.svg',
      website: 'https://www.fedex.com',
      trackingUrl: `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`,
      phone: '+1 800-463-3339',
      email: 'support@fedex.com',
      supportedCountries: ['US', 'CA', 'MX', 'EU'],
    },
    UPS: {
      name: 'UPS',
      code: 'UPS',
      logoUrl: 'https://www.ups.com/assets/resources/images/ups-logo.svg',
      website: 'https://www.ups.com',
      trackingUrl: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      phone: '+1 800-742-5877',
      email: 'support@ups.com',
      supportedCountries: ['US', 'CA', 'EU', 'APAC'],
    },
    USPS: {
      name: 'USPS',
      code: 'USPS',
      logoUrl: 'https://www.usps.com/assets/images/logo.svg',
      website: 'https://www.usps.com',
      trackingUrl: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      phone: '+1 800-275-8777',
      email: 'support@usps.com',
      supportedCountries: ['US'],
    },
  }

  const carrierCodes = ['DHL', 'FEDEX', 'UPS', 'USPS']
  const carrierCode = carrierCodes[Math.floor(Math.random() * carrierCodes.length)]
  const carrier = carriers[carrierCode]

  const estimatedDelivery = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000)

  return {
    id: `gid://shopify/FulfillmentEvent/${Date.now()}`,
    fulfillmentId: `gid://shopify/Fulfillment/${Date.now()}`,
    orderId: `gid://shopify/Order/1001`,
    orderName,
    trackingNumber,
    trackingUrl: carrier.trackingUrl,
    carrier: carrier.name,
    carrierCode,
    carrierLogoUrl: carrier.logoUrl,
    status,
    originAddress: {
      name: 'Warehouse',
      address1: '123 Commerce St',
      city: 'Los Angeles',
      province: 'CA',
      country: 'United States',
      countryCode: 'US',
      zip: '90001',
      phone: '+1 555-0100',
      latitude: 34.0522,
      longitude: -118.2437,
    },
    destinationAddress: {
      name: 'Demo User',
      address1: '456 Oak Ave',
      address2: 'Apt 3B',
      city: 'New York',
      province: 'NY',
      country: 'United States',
      countryCode: 'US',
      zip: '10001',
      phone: '+1 555-0123',
      latitude: 40.7128,
      longitude: -74.0060,
    },
    currentLocation: {
      city: events[events.length - 1]?.city,
      province: events[events.length - 1]?.province,
      country: 'United States',
    },
    estimatedDeliveryAt:
      status === FulfillmentStatus.DELIVERED ? undefined : estimatedDelivery.toISOString(),
    estimatedDeliveryFrom:
      status === FulfillmentStatus.DELIVERED
        ? undefined
        : new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedDeliveryTo:
      status === FulfillmentStatus.DELIVERED ? undefined : estimatedDelivery.toISOString(),
    actualDeliveryAt:
      status === FulfillmentStatus.DELIVERED
        ? new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
        : undefined,
    shippedAt: events.find((e) => e.type === TrackingEventType.SHIPPED)?.timestamp,
    deliveredAt:
      status === FulfillmentStatus.DELIVERED
        ? events.find((e) => e.type === TrackingEventType.DELIVERED)?.timestamp
        : undefined,
    inTransitAt: events.find((e) => e.type === TrackingEventType.IN_TRANSIT)?.timestamp,
    outForDeliveryAt: events.find((e) => e.type === TrackingEventType.OUT_FOR_DELIVERY)?.timestamp,
    events,
    latestEvent: events[events.length - 1],
    timeline: [],
    deliveryWindow:
      status !== FulfillmentStatus.DELIVERED
        ? {
            startAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            endAt: estimatedDelivery.toISOString(),
            timezone: 'America/New_York',
          }
        : undefined,
    totalDistance: 2790,
    remainingDistance: status === FulfillmentStatus.DELIVERED ? 0 : 200,
    updatedAt: now.toISOString(),
    createdAt: new Date(baseTime).toISOString(),
    exception:
      status === FulfillmentStatus.ATTEMPTED_DELIVERY
        ? {
            id: 'exception-1',
            type: TrackingExceptionType.DELAYED,
            severity: TrackingExceptionSeverity.MEDIUM,
            code: 'DELIVERY_ATTEMPT_FAILED',
            message: 'Delivery attempt failed',
            description: 'The recipient was not available at the time of delivery.',
            resolution:
              'Please ensure someone is available to receive the package, or contact the carrier to reschedule delivery.',
            actionRequired: true,
            actionDeadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            contactInfo: {
              name: carrier.name,
              phone: carrier.phone,
              email: carrier.email,
              website: carrier.website,
              workingHours: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
            },
            reportedAt: now.toISOString(),
            isResolved: false,
            updates: [
              {
                id: 'update-1',
                message: 'First delivery attempt failed',
                status: 'REPORTED',
                timestamp: now.toISOString(),
              },
            ],
          }
        : undefined,
  }
}

/**
 * 获取模拟的物流追踪信息
 *
 * @param trackingNumber - 物流追踪号
 * @returns 物流追踪信息，如果无效返回 null
 */
export function getMockTracking(trackingNumber: string): TrackingInfo | null {
  const normalizedNumber = trackingNumber.trim().toUpperCase()

  if (!normalizedNumber || normalizedNumber.length < 8) {
    return null
  }

  const validTrackingPrefixes = ['DHL', 'FX', 'UPS', 'USPS', 'TRK']
  const isValid = validTrackingPrefixes.some((prefix) =>
    normalizedNumber.startsWith(prefix),
  )

  if (!isValid) {
    return null
  }

  const statuses: FulfillmentStatus[] = [
    FulfillmentStatus.CONFIRMED,
    FulfillmentStatus.SUBMITTED,
    FulfillmentStatus.IN_TRANSIT,
    FulfillmentStatus.OUT_FOR_DELIVERY,
    FulfillmentStatus.DELIVERED,
    FulfillmentStatus.ATTEMPTED_DELIVERY,
  ]

  const hash = normalizedNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const statusIndex = hash % statuses.length
  const status = statuses[statusIndex]
  const orderNumber = 1001 + (hash % 100)

  return generateMockTracking(normalizedNumber, status, `#${orderNumber}`)
}

/**
 * 根据订单 ID 获取模拟的物流追踪列表
 *
 * @param orderId - 订单 ID
 * @returns 物流追踪信息数组
 */
export function getMockTrackingsByOrder(orderId: string): TrackingInfo[] {
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const trackingCount = (hash % 3) + 1

  const statuses: FulfillmentStatus[] = [
    FulfillmentStatus.IN_TRANSIT,
    FulfillmentStatus.DELIVERED,
    FulfillmentStatus.OUT_FOR_DELIVERY,
  ]

  return Array.from({ length: trackingCount }, (_, i) => {
    const prefixes = ['DHL', 'FX', 'UPS', 'USPS']
    const prefix = prefixes[hash % prefixes.length]
    const trackingNumber = `${prefix}${1000000000 + hash + i}`
    const status = statuses[(hash + i) % statuses.length]

    return generateMockTracking(trackingNumber, status, `#${1001 + (hash % 100)}`)
  })
}

/**
 * 获取模拟的物流服务商信息
 *
 * @param carrierCode - 物流服务商代码
 * @returns 物流服务商信息，如果不支持返回 null
 */
export function getMockCarrierInfo(carrierCode: string): CarrierInfo | null {
  const carriers: Record<string, CarrierInfo> = {
    DHL: {
      name: 'DHL Express',
      code: 'DHL',
      logoUrl: 'https://www.dhl.com/content/dam/dhl/global/core/images/logos/dhl-logo.svg',
      website: 'https://www.dhl.com',
      trackingUrl: 'https://www.dhl.com/us-en/home/tracking',
      phone: '+1 800-225-5345',
      email: 'support@dhl.com',
      services: [
        {
          code: 'EXPRESS',
          name: 'DHL Express',
          description: 'Next business day delivery',
          estimatedDeliveryDays: { min: 1, max: 2 },
          features: ['Track & Trace', 'Signature Required', 'Insurance'],
        },
        {
          code: 'STANDARD',
          name: 'DHL Standard',
          description: '2-5 business day delivery',
          estimatedDeliveryDays: { min: 2, max: 5 },
          features: ['Track & Trace', 'Insurance'],
        },
      ],
      supportedCountries: ['US', 'CN', 'UK', 'DE', 'JP', 'FR', 'AU'],
      features: [
        { code: 'REAL_TIME_TRACKING', name: 'Real-time Tracking', available: true },
        { code: 'SMS_NOTIFICATIONS', name: 'SMS Notifications', available: true },
        { code: 'SIGNATURE_REQUIRED', name: 'Signature Required', available: true },
      ],
    },
    FEDEX: {
      name: 'FedEx',
      code: 'FEDEX',
      logoUrl: 'https://www.fedex.com/content/dam/fedex-com/logos/fedex-logo.svg',
      website: 'https://www.fedex.com',
      trackingUrl: 'https://www.fedex.com/fedextrack/',
      phone: '+1 800-463-3339',
      email: 'support@fedex.com',
      services: [
        {
          code: 'PRIORITY_OVERNIGHT',
          name: 'Priority Overnight',
          description: 'Next business day by 10:30 AM',
          estimatedDeliveryDays: { min: 1, max: 1 },
          features: ['Track & Trace', 'Signature Required', 'Money-back guarantee'],
        },
        {
          code: 'GROUND',
          name: 'FedEx Ground',
          description: '1-5 business day delivery',
          estimatedDeliveryDays: { min: 1, max: 5 },
          features: ['Track & Trace'],
        },
      ],
      supportedCountries: ['US', 'CA', 'MX', 'UK', 'DE', 'JP'],
      features: [
        { code: 'REAL_TIME_TRACKING', name: 'Real-time Tracking', available: true },
        { code: 'DELIVERY_WINDOW', name: 'Delivery Window', available: true },
        { code: 'PHOTO_PROOF', name: 'Photo Proof of Delivery', available: true },
      ],
    },
    UPS: {
      name: 'UPS',
      code: 'UPS',
      logoUrl: 'https://www.ups.com/assets/resources/images/ups-logo.svg',
      website: 'https://www.ups.com',
      trackingUrl: 'https://www.ups.com/track',
      phone: '+1 800-742-5877',
      email: 'support@ups.com',
      services: [
        {
          code: 'NEXT_DAY_AIR',
          name: 'UPS Next Day Air',
          description: 'Next business day delivery',
          estimatedDeliveryDays: { min: 1, max: 1 },
          features: ['Track & Trace', 'Signature Required'],
        },
        {
          code: 'GROUND',
          name: 'UPS Ground',
          description: '1-5 business day delivery',
          estimatedDeliveryDays: { min: 1, max: 5 },
          features: ['Track & Trace'],
        },
      ],
      supportedCountries: ['US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES'],
      features: [
        { code: 'REAL_TIME_TRACKING', name: 'Real-time Tracking', available: true },
        { code: 'MY_CHOICE', name: 'UPS My Choice', available: true },
      ],
    },
    USPS: {
      name: 'United States Postal Service',
      code: 'USPS',
      logoUrl: 'https://www.usps.com/assets/images/logo.svg',
      website: 'https://www.usps.com',
      trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction',
      phone: '+1 800-275-8777',
      email: 'support@usps.com',
      services: [
        {
          code: 'PRIORITY_MAIL',
          name: 'Priority Mail',
          description: '1-3 business day delivery',
          estimatedDeliveryDays: { min: 1, max: 3 },
          features: ['Track & Trace', 'Insurance up to $50'],
        },
        {
          code: 'FIRST_CLASS',
          name: 'First-Class Mail',
          description: '2-5 business day delivery',
          estimatedDeliveryDays: { min: 2, max: 5 },
          features: ['Track & Trace'],
        },
      ],
      supportedCountries: ['US'],
      features: [
        { code: 'REAL_TIME_TRACKING', name: 'Real-time Tracking', available: true },
        { code: 'INFORMED_DELIVERY', name: 'Informed Delivery', available: true },
      ],
    },
  }

  const normalizedCode = carrierCode.trim().toUpperCase()
  return carriers[normalizedCode] || null
}

/**
 * 获取所有支持的模拟物流服务商列表
 *
 * @returns 物流服务商信息数组
 */
export function getMockSupportedCarriers(): CarrierInfo[] {
  return [
    getMockCarrierInfo('DHL')!,
    getMockCarrierInfo('FEDEX')!,
    getMockCarrierInfo('UPS')!,
    getMockCarrierInfo('USPS')!,
  ]
}

/**
 * 获取订单的模拟 Fulfillment 列表
 *
 * @param orderId - 订单 ID
 * @returns Fulfillment 数组
 */
export function getMockFulfillmentsByOrder(orderId: string): Fulfillment[] {
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const fulfillmentCount = (hash % 2) + 1

  const statuses: FulfillmentStatus[] = [
    FulfillmentStatus.FULFILLED,
    FulfillmentStatus.IN_TRANSIT,
    FulfillmentStatus.DELIVERED,
  ]

  return Array.from({ length: fulfillmentCount }, (_, i) => {
    const status = statuses[(hash + i) % statuses.length]
    const now = new Date()
    const createdAt = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000)

    return {
      id: `gid://shopify/Fulfillment/${Date.now() + i}`,
      name: `Fulfillment #${i + 1}`,
      status,
      createdAt: createdAt.toISOString(),
      updatedAt: now.toISOString(),
      trackingInfo: [
        {
          company: i % 2 === 0 ? 'DHL' : 'FedEx',
          number: `${i % 2 === 0 ? 'DHL' : 'FX'}${1000000000 + hash + i}`,
          url: i % 2 === 0 ? 'https://www.dhl.com' : 'https://www.fedex.com',
        },
      ],
      lineItems: {
        edges: [],
      },
      estimatedDeliveryAt:
        status === FulfillmentStatus.DELIVERED
          ? undefined
          : new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      inTransitAt:
        status === FulfillmentStatus.IN_TRANSIT || status === FulfillmentStatus.DELIVERED
          ? new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      deliveredAt:
        status === FulfillmentStatus.DELIVERED
          ? new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
          : undefined,
    }
  })
}

/**
 * 有效的测试追踪号列表
 * 用于开发和测试时快速获取物流信息
 */
export const VALID_TRACKING_NUMBERS = [
  'DHL1234567890',
  'FX9876543210',
  'UPS1357924680',
  'USPS2468013579',
  'TRK0000000001',
  'TRK0000000002',
]

/**
 * 检查追踪号是否有效
 *
 * @param trackingNumber - 物流追踪号
 * @returns 是否有效
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  const normalized = trackingNumber.trim().toUpperCase()
  return VALID_TRACKING_NUMBERS.some((num) => num.startsWith(normalized)) ||
    normalized.match(/^(DHL|FX|UPS|USPS|TRK)\d{8,}$/) !== null
}
