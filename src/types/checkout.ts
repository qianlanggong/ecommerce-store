import type { Money, PageInfo } from './product'
import type { MailingAddress, MailingAddressInput } from './user'
import type { Order } from './order'

export type { Money, PageInfo }

export interface Checkout {
  id: string
  email?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  currencyCode: string
  subtotalPrice: Money
  totalTax: Money
  totalPrice: Money
  totalDuties?: Money
  shippingLine?: ShippingRate
  shippingAddress?: MailingAddress
  billingAddress?: MailingAddress
  buyerIdentity?: CheckoutBuyerIdentity
  paymentDue: Money
  paymentDueV2: Money
  ready: boolean
  requiresShipping: boolean
  shippingRates?: ShippingRate[]
  availableShippingRates?: AvailableShippingRates
  order?: Order
  orderStatusUrl?: string
  checkoutUrl: string
  webUrl: string
  lineItems: CheckoutLineItemConnection
  discountApplications: CheckoutDiscountApplicationConnection
  giftCards?: CheckoutGiftCardConnection
  appliedGiftCards?: CheckoutAppliedGiftCardConnection
}

export interface CheckoutLineItem {
  id: string
  title: string
  quantity: number
  variant: {
    id: string
    title: string
    price: Money
    image?: {
      url: string
      altText?: string
    }
    product?: {
      id: string
      title: string
    }
  }
  originalTotalPrice: Money
  discountedTotalPrice: Money
  discounts?: CheckoutDiscountAllocation[]
}

export interface CheckoutLineItemConnection {
  edges: Array<{ node: CheckoutLineItem }>
  pageInfo: PageInfo
}

export interface CheckoutBuyerIdentity {
  email?: string
  phone?: string
  customer?: {
    id: string
    email?: string
    firstName?: string
    lastName?: string
    displayName?: string
  }
  countryCode?: string
}

export interface CheckoutBuyerIdentityInput {
  email?: string
  phone?: string
  customerAccessToken?: string
  countryCode?: string
}

export interface ShippingRate {
  id?: string
  handle?: string
  title: string
  price: Money
  estimatedDeliveryTime?: string
  carrierIdentifier?: string
  code?: string
  source?: string
}

export interface AvailableShippingRates {
  ready: boolean
  rates: ShippingRate[]
}

export interface CheckoutDiscountApplication {
  targetType: string
  targetSelection: string
  allocationMethod: string
  value: Money | { percentage: number }
  description?: string
  title?: string
  code?: string
}

export interface CheckoutDiscountApplicationConnection {
  edges: Array<{ node: CheckoutDiscountApplication }>
  pageInfo?: PageInfo
}

export interface CheckoutDiscountAllocation {
  allocatedAmount: Money
  discountApplication: CheckoutDiscountApplication
}

export interface CheckoutGiftCard {
  id: string
  lastCharacters: string
  balance: Money
  amountUsed: Money
  presentmentAmountUsed: Money
}

export interface CheckoutGiftCardConnection {
  edges: Array<{ node: CheckoutGiftCard }>
}

export interface CheckoutAppliedGiftCard {
  id: string
  amountUsed: Money
  lastCharacters: string
}

export interface CheckoutAppliedGiftCardConnection {
  edges: Array<{ node: CheckoutAppliedGiftCard }>
}

export interface CheckoutCreateInput {
  email?: string
  lineItems?: CheckoutLineItemInput[]
  shippingAddress?: MailingAddressInput
  billingAddress?: MailingAddressInput
  buyerIdentity?: CheckoutBuyerIdentityInput
  discountCode?: string
  note?: string
  shippingLine?: {
    handle: string
    price: Money
    title: string
  }
  allowPartialAddresses?: boolean
}

export interface CheckoutLineItemInput {
  variantId: string
  quantity: number
  customAttributes?: { key: string; value: string }[]
}

export interface CheckoutUpdateInput {
  email?: string
  shippingAddress?: MailingAddressInput
  billingAddress?: MailingAddressInput
  buyerIdentity?: CheckoutBuyerIdentityInput
  note?: string
}

export interface CheckoutLineItemUpdateInput {
  id: string
  quantity: number
  variantId?: string
  customAttributes?: { key: string; value: string }[]
}

export interface CheckoutUserError {
  field: string[]
  message: string
  code: CheckoutErrorCode
}

export enum CheckoutErrorCode {
  ALREADY_COMPLETED = 'ALREADY_COMPLETED',
  BAD_DOMAIN = 'BAD_DOMAIN',
  CARD_EXPIRED = 'CARD_EXPIRED',
  CARD_DECLINED = 'CARD_DECLINED',
  CARD_INVALID = 'CARD_INVALID',
  DISCOUNT_CODE_NOT_FOUND = 'DISCOUNT_CODE_NOT_FOUND',
  DISCOUNT_CODE_NOT_APPLICABLE = 'DISCOUNT_CODE_NOT_APPLICABLE',
  EMAIL_INVALID = 'EMAIL_INVALID',
  GIFT_CARD_NOT_FOUND = 'GIFT_CARD_NOT_FOUND',
  GIFT_CARD_INVALID = 'GIFT_CARD_INVALID',
  GIFT_CARD_CODE_ALREADY_APPLIED = 'GIFT_CARD_CODE_ALREADY_APPLIED',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INVALID_PROVINCE = 'INVALID_PROVINCE',
  INVALID_COUNTRY = 'INVALID_COUNTRY',
  INVALID_DISCOUNT = 'INVALID_DISCOUNT',
  MISSING_PAYMENT = 'MISSING_PAYMENT',
  MISSING_SHIPPING_ADDRESS = 'MISSING_SHIPPING_ADDRESS',
  PAYMENT_AMOUNT_MISMATCH = 'PAYMENT_AMOUNT_MISMATCH',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  SHIPPING_RATE_NOT_FOUND = 'SHIPPING_RATE_NOT_FOUND',
  TAX_REQUIRED = 'TAX_REQUIRED',
  TOTAL_PRICE_MISMATCH = 'TOTAL_PRICE_MISMATCH',
  UNKNOWN = 'UNKNOWN',
}

export interface CheckoutResult {
  checkout?: Checkout
  checkoutUserErrors: CheckoutUserError[]
}
