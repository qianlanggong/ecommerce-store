import type { ProductVariant, Money } from './product'
import type { Customer } from './user'

export type { ProductVariant, Money }

export interface Cart {
  id: string
  checkoutUrl: string
  createdAt: string
  updatedAt: string
  lines: CartLineConnection
  estimatedCost: CartEstimatedCost
  totalQuantity: number
  buyerIdentity?: CartBuyerIdentity
  discountCodes: CartDiscountCode[]
  note?: string
  attributes: Attribute[]
}

export interface CartLine {
  id: string
  quantity: number
  merchandise: ProductVariant
  cost: CartLineCost
  attributes: Attribute[]
  sellingPlanAllocation?: SellingPlanAllocation
}

export interface CartLineConnection {
  edges: Array<{ node: CartLine }>
}

export interface CartEstimatedCost {
  subtotalAmount: Money
  totalAmount: Money
  taxAmount?: Money
  dutyAmount?: Money
  shippingAmount?: Money
  subtotalAmountEstimated: boolean
  totalAmountEstimated: boolean
  taxAmountEstimated?: boolean
  dutyAmountEstimated?: boolean
  shippingAmountEstimated?: boolean
}

export interface CartLineCost {
  amountPerQuantity: Money
  compareAtAmountPerQuantity?: Money
  subtotalAmount?: Money
  totalAmount: Money
}

export interface CartBuyerIdentity {
  email?: string
  phone?: string
  customer?: Customer
  countryCode: string
}

export interface CartDiscountCode {
  code: string
  applicable: boolean
}

export interface Attribute {
  key: string
  value: string
}

export interface SellingPlanAllocation {
  sellingPlan: SellingPlan
  priceAdjustments: SellingPlanAllocationPriceAdjustment[]
}

export interface SellingPlan {
  id: string
  name: string
  description: string
  options: SellingPlanOption[]
  priceAdjustments: SellingPlanPriceAdjustment[]
}

export interface SellingPlanOption {
  name: string
  value: string
}

export interface SellingPlanAllocationPriceAdjustment {
  orderCount: number
  price: Money
  compareAtPrice?: Money
  perDeliveryPrice?: Money
  unitPrice?: Money
}

export interface SellingPlanPriceAdjustment {
  fixedValue?: Money
  percentage?: number
  orderCount?: number
}

export interface CartInput {
  lines?: CartLineInput[]
  buyerIdentity?: CartBuyerIdentityInput
  discountCodes?: string[]
  note?: string
  attributes?: AttributeInput[]
}

export interface CartLineInput {
  merchandiseId: string
  quantity: number
  sellingPlanId?: string
  attributes?: AttributeInput[]
}

export interface CartBuyerIdentityInput {
  email?: string
  phone?: string
  customerAccessToken?: string
  countryCode?: string
}

export interface AttributeInput {
  key: string
  value: string
}

export interface CartLineUpdateInput {
  id: string
  quantity: number
  sellingPlanId?: string
  attributes?: AttributeInput[]
}

export interface CartUserError {
  field: string[]
  message: string
  code: CartErrorCode
}

export enum CartErrorCode {
  EMPTY = 'EMPTY',
  INVALID = 'INVALID',
  NOT_FOUND = 'NOT_FOUND',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  QUANTITY_EXCEEDED = 'QUANTITY_EXCEEDED',
  TOO_MANY = 'TOO_MANY',
  UNAVAILABLE = 'UNAVAILABLE',
  QUANTITY_LIMIT_REACHED = 'QUANTITY_LIMIT_REACHED',
  MERCHANDISE_NOT_FOUND = 'MERCHANDISE_NOT_FOUND',
  VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND',
}
