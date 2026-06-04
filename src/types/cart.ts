import type { ProductVariant, Money } from './product'
import type { Customer } from './user'

export type { ProductVariant, Money }

/**
 * 购物车接口
 *
 * 定义购物车的完整数据结构，包含商品、价格、
 * 购买者信息、折扣等所有购物车相关数据。
 *
 * @interface Cart
 */
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

/**
 * 购物车商品行接口
 *
 * 购物车中的单个商品条目，包含商品变体、数量、
 * 价格等信息。
 *
 * @interface CartLine
 */
export interface CartLine {
  id: string
  quantity: number
  merchandise: ProductVariant
  cost: CartLineCost
  attributes: Attribute[]
  sellingPlanAllocation?: SellingPlanAllocation
}

/**
 * 购物车商品行列表连接接口
 *
 * @interface CartLineConnection
 */
export interface CartLineConnection {
  edges: Array<{ node: CartLine }>
}

/**
 * 购物车预估费用接口
 *
 * 包含购物车的各项费用估算，所有金额可能是预估的，
 * 最终金额以结账时计算为准。
 *
 * 设计说明：
 * - 每项费用都有对应的 xxxEstimated 标志
 * - 标志为 true 表示金额是预估的，可能会变化
 * - 常见于税费、运费等需要地址信息才能精确计算的费用
 *
 * @interface CartEstimatedCost
 */
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

/**
 * 购物车商品行费用接口
 *
 * 定义单个商品行的费用明细，包含单价、对比价、小计等。
 *
 * @interface CartLineCost
 */
export interface CartLineCost {
  amountPerQuantity: Money
  compareAtAmountPerQuantity?: Money
  subtotalAmount?: Money
  totalAmount: Money
}

/**
 * 购物车购买者身份接口
 *
 * 关联购物车与用户身份信息，用于计算税费、运费等。
 *
 * @interface CartBuyerIdentity
 */
export interface CartBuyerIdentity {
  email?: string
  phone?: string
  customer?: Customer
  countryCode: string
}

/**
 * 购物车折扣码接口
 *
 * 已应用的折扣码及其适用状态。
 * applicable 为 false 表示折扣码无效或不适用。
 *
 * @interface CartDiscountCode
 */
export interface CartDiscountCode {
  code: string
  applicable: boolean
}

/**
 * 自定义属性接口
 *
 * 通用的键值对结构，用于存储自定义数据。
 *
 * @interface Attribute
 */
export interface Attribute {
  key: string
  value: string
}

/**
 * 销售计划分配接口
 *
 * 商品的订阅/定期购买计划分配信息。
 *
 * @interface SellingPlanAllocation
 */
export interface SellingPlanAllocation {
  sellingPlan: SellingPlan
  priceAdjustments: SellingPlanAllocationPriceAdjustment[]
}

/**
 * 销售计划接口
 *
 * 订阅/定期购买计划定义，如"每月配送一次"等。
 *
 * @interface SellingPlan
 */
export interface SellingPlan {
  id: string
  name: string
  description: string
  options: SellingPlanOption[]
  priceAdjustments: SellingPlanPriceAdjustment[]
}

/**
 * 销售计划选项接口
 *
 * @interface SellingPlanOption
 */
export interface SellingPlanOption {
  name: string
  value: string
}

/**
 * 销售计划分配价格调整接口
 *
 * 订阅计划的价格优惠信息。
 *
 * @interface SellingPlanAllocationPriceAdjustment
 */
export interface SellingPlanAllocationPriceAdjustment {
  orderCount: number
  price: Money
  compareAtPrice?: Money
  perDeliveryPrice?: Money
  unitPrice?: Money
}

/**
 * 销售计划价格调整接口
 *
 * 订阅计划的价格优惠规则。
 *
 * @interface SellingPlanPriceAdjustment
 */
export interface SellingPlanPriceAdjustment {
  fixedValue?: Money
  percentage?: number
  orderCount?: number
}

/**
 * 创建购物车输入接口
 *
 * 创建新购物车时的参数。
 *
 * @interface CartInput
 */
export interface CartInput {
  lines?: CartLineInput[]
  buyerIdentity?: CartBuyerIdentityInput
  discountCodes?: string[]
  note?: string
  attributes?: AttributeInput[]
}

/**
 * 添加购物车商品行输入接口
 *
 * 添加商品到购物车时的参数。
 *
 * @interface CartLineInput
 */
export interface CartLineInput {
  merchandiseId: string
  quantity: number
  sellingPlanId?: string
  attributes?: AttributeInput[]
}

/**
 * 更新购物车购买者身份输入接口
 *
 * 更新购物车购买者信息时的参数。
 *
 * @interface CartBuyerIdentityInput
 */
export interface CartBuyerIdentityInput {
  email?: string
  phone?: string
  customerAccessToken?: string
  countryCode?: string
}

/**
 * 自定义属性输入接口
 *
 * @interface AttributeInput
 */
export interface AttributeInput {
  key: string
  value: string
}

/**
 * 更新购物车商品行输入接口
 *
 * 更新购物车商品数量时的参数。
 *
 * @interface CartLineUpdateInput
 */
export interface CartLineUpdateInput {
  id: string
  quantity: number
  sellingPlanId?: string
  attributes?: AttributeInput[]
}

/**
 * 购物车用户错误接口
 *
 * 购物车操作失败时返回的错误信息。
 * field 字段指示错误发生的具体字段路径。
 *
 * @interface CartUserError
 */
export interface CartUserError {
  field: string[]
  message: string
  code: CartErrorCode
}

/**
 * 购物车错误代码枚举
 *
 * 定义所有可能的购物车操作错误类型。
 *
 * @enum CartErrorCode
 */
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
