import type { Money, Image, PageInfo, Product, ProductVariant } from './product'
import type { MailingAddress } from './user'

export type { Money, Image, PageInfo }

export interface Order {
  id: string
  name: string
  orderNumber: number
  statusPageUrl: string
  processedAt: string
  canceledAt?: string
  cancelReason?: OrderCancelReason
  currencyCode: string
  currentTotalPrice: Money
  currentSubtotalPrice: Money
  currentTotalTax: Money
  totalShippingPrice: Money
  totalPrice: Money
  subtotalPrice: Money
  totalTax: Money
  totalRefunded: Money
  customerUrl?: string
  financialStatus: OrderFinancialStatus
  fulfillmentStatus: OrderFulfillmentStatus
  lineItems: OrderLineItemConnection
  shippingAddress?: MailingAddress
  billingAddress?: MailingAddress
  shippingLines: ShippingLineConnection
  discountApplications: DiscountApplicationConnection
  fulfillments: FulfillmentConnection
  refunds: RefundConnection
  createdAt: string
  updatedAt: string
}

export interface OrderLineItem {
  id: string
  variantTitle: string
  title: string
  quantity: number
  originalTotalPrice: Money
  discountedTotalPrice: Money
  originalUnitPrice: Money
  discountedUnitPrice?: Money
  product?: Product
  variant?: ProductVariant
  image?: Image
  taxLines: TaxLine[]
  discounts: DiscountAllocation[]
}

export interface OrderLineItemConnection {
  edges: Array<{ node: OrderLineItem }>
}

export interface ShippingLine {
  id: string
  title: string
  price: Money
  discountedPrice: Money
  code?: string
  source: string
  carrierIdentifier?: string
  requestedFulfillmentServiceId?: string
}

export interface ShippingLineConnection {
  edges: Array<{ node: ShippingLine }>
}

export interface TaxLine {
  title: string
  price: Money
  rate: number
}

export interface DiscountAllocation {
  allocatedAmount: Money
  discountApplication: DiscountApplication
}

export interface DiscountApplication {
  targetType: DiscountApplicationTargetType
  targetSelection: DiscountApplicationTargetSelection
  allocationMethod: DiscountApplicationAllocationMethod
  value: PricingValue
  description?: string
  title?: string
  code?: string
}

export interface DiscountApplicationConnection {
  edges: Array<{ node: DiscountApplication }>
}

export interface Fulfillment {
  id: string
  name: string
  status: FulfillmentStatus
  createdAt: string
  updatedAt: string
  trackingInfo: FulfillmentTrackingInfo[]
  lineItems: FulfillmentLineItemConnection
  deliveredAt?: string
  estimatedDeliveryAt?: string
  inTransitAt?: string
  outForDeliveryAt?: string
}

export interface FulfillmentConnection {
  edges: Array<{ node: Fulfillment }>
}

export interface FulfillmentTrackingInfo {
  company?: string
  number?: string
  url?: string
}

export interface FulfillmentLineItem {
  id: string
  quantity: number
  lineItem: OrderLineItem
}

export interface FulfillmentLineItemConnection {
  edges: Array<{ node: FulfillmentLineItem }>
}

export interface Refund {
  id: string
  createdAt: string
  totalRefunded: Money
  refundLineItems: RefundLineItemConnection
  transactions: TransactionConnection
}

export interface RefundConnection {
  edges: Array<{ node: Refund }>
}

export interface RefundLineItem {
  id: string
  quantity: number
  restockType: RefundRestockType
  lineItem: OrderLineItem
  refund: Refund
}

export interface RefundLineItemConnection {
  edges: Array<{ node: RefundLineItem }>
}

export interface Transaction {
  id: string
  amount: Money
  kind: TransactionKind
  status: TransactionStatus
  createdAt: string
  gateway: string
  parentTransaction?: Transaction
  errorCode?: string
}

export interface TransactionConnection {
  edges: Array<{ node: Transaction }>
}

export enum OrderCancelReason {
  CUSTOMER = 'customer',
  DECLINED = 'declined',
  FRAUD = 'fraud',
  INVENTORY = 'inventory',
  OTHER = 'other',
  STAFF = 'staff',
}

export enum OrderFinancialStatus {
  AUTHORIZED = 'AUTHORIZED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  PENDING = 'PENDING',
  REFUNDED = 'REFUNDED',
  UNPAID = 'UNPAID',
  VOIDED = 'VOIDED',
}

export enum OrderFulfillmentStatus {
  FULFILLED = 'FULFILLED',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  OPEN = 'OPEN',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  RESTOCKED = 'RESTOCKED',
  SCHEDULED = 'SCHEDULED',
  UNFULFILLED = 'UNFULFILLED',
}

export enum FulfillmentStatus {
  ATTEMPTED_DELIVERY = 'ATTEMPTED_DELIVERY',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  FAILURE = 'FAILURE',
  FULFILLED = 'FULFILLED',
  IN_TRANSIT = 'IN_TRANSIT',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  PARTIAL = 'PARTIAL',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  SCHEDULED = 'SCHEDULED',
  SUBMITTED = 'SUBMITTED',
  CANCELED = 'CANCELED',
  ERROR = 'ERROR',
}

export enum DiscountApplicationTargetType {
  LINE_ITEM = 'LINE_ITEM',
  SHIPPING_LINE = 'SHIPPING_LINE',
}

export enum DiscountApplicationTargetSelection {
  ALL = 'ALL',
  ENTITLED = 'ENTITLED',
  EXPLICIT = 'EXPLICIT',
}

export enum DiscountApplicationAllocationMethod {
  ACROSS = 'ACROSS',
  EACH = 'EACH',
  ONE = 'ONE',
}

export enum RefundRestockType {
  CANCEL = 'CANCEL',
  NO_RESTOCK = 'NO_RESTOCK',
  RESTOCK = 'RESTOCK',
}

export enum TransactionKind {
  AUTHORIZATION = 'AUTHORIZATION',
  CAPTURE = 'CAPTURE',
  SALE = 'SALE',
  VOID = 'VOID',
  REFUND = 'REFUND',
  SUGGESTED_REFUND = 'SUGGESTED_REFUND',
  CHANGE = 'CHANGE',
  UNKNOWN = 'UNKNOWN',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  FAILURE = 'FAILURE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export type PricingValue = Money | PricingPercentageValue

export interface PricingPercentageValue {
  percentage: number
}

export interface OrderConnection {
  edges: Array<{ node: Order }>
  pageInfo: PageInfo
}
