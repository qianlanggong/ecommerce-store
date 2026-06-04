import type {
  Product,
  ProductConnection,
  Collection,
  CollectionConnection,
  ProductFilter,
  Cart,
  CartInput,
  CartLineInput,
  CartLineUpdateInput,
  Customer,
  CustomerCreateInput,
  CustomerUpdateInput,
  MailingAddress,
  MailingAddressInput,
  CustomerAccessToken,
  OrderConnection,
  Order,
  UserError,
  Checkout,
  CheckoutCreateInput,
  CheckoutUpdateInput,
  CheckoutLineItemInput,
  CheckoutLineItemUpdateInput,
  ShippingRate,
  CheckoutResult,
  CheckoutUserError,
  TrackingInfoConnection,
  TrackingFilter,
  TrackingResult,
  TrackingUserError,
  CarrierInfo,
  Fulfillment,
} from '@/types'

/**
 * 电商后端适配器接口
 * 
 * 定义了所有电商后端操作的标准接口，采用适配器模式设计。
 * 所有具体的后端实现（Shopify、Mock、自定义后端等）都必须实现此接口。
 * 这样可以在不修改前端业务代码的情况下，灵活切换不同的后端实现。
 * 
 * @interface IEcommerceAdapter
 */
export interface IEcommerceAdapter {
  // =========================================================================
  // 商品相关接口
  // =========================================================================

  /**
   * 获取商品列表
   * 
   * @param filter - 商品筛选条件，包括分页、排序、价格范围、分类等
   * @returns 商品连接对象，包含商品列表数组和分页信息
   */
  getProducts(filter?: ProductFilter): Promise<ProductConnection>

  /**
   * 根据 Handle 获取单个商品详情
   * 
   * @param handle - 商品的 URL 友好标识符（Shopify 中的 handle）
   * @returns 商品详情对象，如果未找到返回 null
   */
  getProduct(handle: string): Promise<Product | null>

  /**
   * 获取商品推荐列表
   * 
   * @param productId - 商品的唯一标识符
   * @returns 推荐商品数组
   */
  getProductRecommendations(productId: string): Promise<Product[]>

  /**
   * 获取所有商品分类
   * 
   * @returns 分类连接对象，包含分类列表和分页信息
   */
  getCollections(): Promise<CollectionConnection>

  /**
   * 根据 Handle 获取单个分类详情
   * 
   * @param handle - 分类的 URL 友好标识符
   * @returns 分类详情对象，如果未找到返回 null
   */
  getCollection(handle: string): Promise<Collection | null>

  // =========================================================================
  // 购物车相关接口
  // =========================================================================

  /**
   * 创建新购物车
   * 
   * @param input - 购物车初始化参数，可包含商品、买家身份、折扣码等
   * @returns 新创建的购物车对象
   */
  createCart(input?: CartInput): Promise<Cart>

  /**
   * 获取购物车详情
   * 
   * @param cartId - 购物车的唯一标识符
   * @returns 购物车对象，如果未找到返回 null
   */
  getCart(cartId: string): Promise<Cart | null>

  /**
   * 向购物车添加商品
   * 
   * @param cartId - 购物车 ID
   * @param lines - 要添加的商品行数组，每个包含商品变体 ID 和数量
   * @returns 更新后的购物车对象
   */
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>

  /**
   * 更新购物车中的商品行
   * 
   * @param cartId - 购物车 ID
   * @param lines - 要更新的商品行数组，每个包含行 ID、新数量等
   * @returns 更新后的购物车对象
   */
  updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>

  /**
   * 从购物车移除商品行
   * 
   * @param cartId - 购物车 ID
   * @param lineIds - 要移除的商品行 ID 数组
   * @returns 更新后的购物车对象
   */
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>

  /**
   * 更新购物车的买家身份信息
   * 
   * 用于在结账过程中关联用户信息、设置配送国家等。
   * 
   * @param cartId - 购物车 ID
   * @param buyerIdentity - 买家身份信息，包括邮箱、用户访问令牌、国家代码
   * @returns 更新后的购物车对象
   */
  updateCartBuyerIdentity(
    cartId: string,
    buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
  ): Promise<Cart>

  /**
   * 更新购物车的折扣码
   * 
   * @param cartId - 购物车 ID
   * @param discountCodes - 折扣码数组，传空数组可移除所有折扣
   * @returns 更新后的购物车对象
   */
  updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart>

  // =========================================================================
  // 用户认证相关接口
  // =========================================================================

  /**
   * 创建新用户账户
   * 
   * @param input - 用户注册信息
   * @returns 包含创建的用户对象和可能的错误信息
   */
  createCustomer(
    input: CustomerCreateInput,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  /**
   * 用户登录
   * 
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 包含用户访问令牌和可能的错误信息。登录成功时返回 accessToken
   */
  login(
    email: string,
    password: string,
  ): Promise<{ customerAccessToken?: CustomerAccessToken; userErrors: UserError[] }>

  /**
   * 用户登出
   * 
   * @param accessToken - 当前用户的访问令牌
   */
  logout(accessToken: string): Promise<void>

  /**
   * 获取当前登录用户信息
   * 
   * @param accessToken - 用户访问令牌
   * @returns 用户信息对象，如果令牌无效返回 null
   */
  getCustomer(accessToken: string): Promise<Customer | null>

  /**
   * 更新用户信息
   * 
   * @param accessToken - 用户访问令牌
   * @param input - 要更新的用户信息
   * @returns 包含更新后的用户对象和可能的错误信息
   */
  updateCustomer(
    accessToken: string,
    input: CustomerUpdateInput,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  /**
   * 重置用户密码
   * 
   * @param password - 新密码
   * @param resetToken - 密码重置令牌（从重置邮件链接中获取）
   * @returns 包含更新后的用户对象和可能的错误信息
   */
  resetPassword(
    password: string,
    resetToken: string,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  /**
   * 发送密码重置邮件
   * 
   * @param email - 用户注册邮箱
   * @returns 可能的错误信息数组
   */
  recoverCustomer(email: string): Promise<{ userErrors: UserError[] }>

  /**
   * 激活用户账户
   * 
   * 用于新用户首次激活账户或被管理员禁用后重新激活。
   * 
   * @param id - 用户 ID
   * @param input - 包含新密码和激活令牌
   * @returns 包含激活后的用户对象和可能的错误信息
   */
  activateCustomer(
    id: string,
    input: { password: string; activationToken: string },
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  // =========================================================================
  // 用户地址相关接口
  // =========================================================================

  /**
   * 创建用户收货地址
   * 
   * @param accessToken - 用户访问令牌
   * @param address - 地址信息
   * @returns 包含创建的地址对象和可能的错误信息
   */
  createCustomerAddress(
    accessToken: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>

  /**
   * 更新用户收货地址
   * 
   * @param accessToken - 用户访问令牌
   * @param addressId - 要更新的地址 ID
   * @param address - 新的地址信息
   * @returns 包含更新后的地址对象和可能的错误信息
   */
  updateCustomerAddress(
    accessToken: string,
    addressId: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>

  /**
   * 删除用户收货地址
   * 
   * @param accessToken - 用户访问令牌
   * @param addressId - 要删除的地址 ID
   * @returns 包含被删除的地址 ID 和可能的错误信息
   */
  deleteCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ deletedCustomerAddressId?: string; userErrors: UserError[] }>

  /**
   * 设置默认收货地址
   * 
   * @param accessToken - 用户访问令牌
   * @param addressId - 要设为默认的地址 ID
   * @returns 包含更新后的用户对象和可能的错误信息
   */
  updateDefaultCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  // =========================================================================
  // 订单相关接口
  // =========================================================================

  /**
   * 获取用户订单列表
   * 
   * 按时间倒序排列（最新的在前）。
   * 
   * @param accessToken - 用户访问令牌
   * @param first - 返回的订单数量，默认值由后端决定
   * @returns 订单连接对象，包含订单列表和分页信息
   */
  getOrders(accessToken: string, first?: number): Promise<OrderConnection>

  /**
   * 获取单个订单详情
   * 
   * @param orderId - 订单的唯一标识符（gid://shopify/Order/xxx）
   * @returns 订单详情对象，如果未找到或权限不足返回 null
   */
  getOrder(orderId: string): Promise<Order | null>

  // =========================================================================
  // Checkout 相关接口
  // =========================================================================

  /**
   * 创建新的 Checkout
   * 
   * 根据购物车信息创建一个新的 Checkout 对象，用于后续的支付流程。
   * 
   * @param input - Checkout 创建参数，可包含商品、买家信息、地址等
   * @returns 包含创建的 Checkout 对象和可能的错误信息
   */
  createCheckout(input?: CheckoutCreateInput): Promise<CheckoutResult>

  /**
   * 获取 Checkout 详情
   * 
   * 根据 Checkout ID 获取当前的 Checkout 状态和信息。
   * 
   * @param checkoutId - Checkout 的唯一标识符
   * @returns Checkout 对象，如果未找到返回 null
   */
  getCheckout(checkoutId: string): Promise<Checkout | null>

  /**
   * 更新 Checkout 信息
   * 
   * 更新 Checkout 的买家信息、地址、备注等。
   * 
   * @param checkoutId - Checkout ID
   * @param input - 要更新的 Checkout 信息
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  updateCheckout(checkoutId: string, input: CheckoutUpdateInput): Promise<CheckoutResult>

  /**
   * 向 Checkout 添加商品
   * 
   * 向现有的 Checkout 中添加商品行。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItems - 要添加的商品行数组
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  addCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<CheckoutResult>

  /**
   * 更新 Checkout 中的商品行
   * 
   * 更新 Checkout 中已有商品行的数量或变体。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItems - 要更新的商品行数组
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  updateCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemUpdateInput[]): Promise<CheckoutResult>

  /**
   * 移除 Checkout 中的商品行
   * 
   * 从 Checkout 中移除指定的商品行。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItemIds - 要移除的商品行 ID 数组
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  removeCheckoutLines(checkoutId: string, lineItemIds: string[]): Promise<CheckoutResult>

  /**
   * 更新 Checkout 买家身份
   * 
   * 更新 Checkout 的买家身份信息，包括邮箱、用户访问令牌等。
   * 
   * @param checkoutId - Checkout ID
   * @param buyerIdentity - 买家身份信息
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  updateCheckoutBuyerIdentity(
    checkoutId: string,
    buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
  ): Promise<CheckoutResult>

  /**
   * 更新 Checkout 配送地址
   * 
   * 更新 Checkout 的配送地址，这会触发可用配送方式的重新计算。
   * 
   * @param checkoutId - Checkout ID
   * @param shippingAddress - 配送地址信息
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  updateCheckoutShippingAddress(
    checkoutId: string,
    shippingAddress: MailingAddressInput,
  ): Promise<CheckoutResult>

  /**
   * 获取 Checkout 可用配送方式
   * 
   * 根据当前的配送地址和商品，获取可用的配送方式列表。
   * 
   * @param checkoutId - Checkout ID
   * @returns 可用配送方式数组，如果地址不完整可能返回空数组
   */
  getAvailableShippingRates(checkoutId: string): Promise<ShippingRate[]>

  /**
   * 选择 Checkout 配送方式
   * 
   * 为 Checkout 选择指定的配送方式。
   * 
   * @param checkoutId - Checkout ID
   * @param shippingRateHandle - 配送方式的 handle
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  updateCheckoutShippingLine(checkoutId: string, shippingRateHandle: string): Promise<CheckoutResult>

  /**
   * 应用折扣码到 Checkout
   * 
   * 为 Checkout 应用折扣码。
   * 
   * @param checkoutId - Checkout ID
   * @param discountCode - 折扣码
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  applyDiscountCode(checkoutId: string, discountCode: string): Promise<CheckoutResult>

  /**
   * 移除 Checkout 折扣码
   * 
   * 移除 Checkout 已应用的折扣码。
   * 
   * @param checkoutId - Checkout ID
   * @returns 包含更新后的 Checkout 对象和可能的错误信息
   */
  removeDiscountCode(checkoutId: string): Promise<CheckoutResult>

  /**
   * 完成 Checkout
   *
   * 标记 Checkout 为已完成，创建订单。
   * 注意：在 Shopify 无头模式下，通常是跳转到 Shopify 官方支付页面完成支付，
   * 支付完成后 Shopify 会自动创建订单。
   *
   * @param checkoutId - Checkout ID
   * @returns 包含创建的订单对象和可能的错误信息
   */
  completeCheckout(checkoutId: string): Promise<{ order?: Order; userErrors: CheckoutUserError[] }>

  // =========================================================================
  // 物流追踪相关接口
  // =========================================================================

  /**
   * 根据订单获取物流追踪信息
   *
   * 根据订单 ID 获取该订单的所有物流追踪信息。
   * 一个订单可能有多个物流包裹，因此可能返回多个追踪信息。
   *
   * @param orderId - 订单 ID
   * @param accessToken - 用户访问令牌（可选，用于验证权限）
   * @returns 物流追踪信息连接对象，包含追踪列表和分页信息
   */
  getTrackingByOrder(orderId: string, accessToken?: string): Promise<TrackingInfoConnection>

  /**
   * 根据追踪单号获取物流追踪信息
   *
   * 根据物流追踪单号获取详细的物流追踪信息。
   *
   * @param trackingNumber - 物流追踪单号
   * @returns 包含物流追踪信息和可能的错误信息
   */
  getTrackingByNumber(trackingNumber: string): Promise<TrackingResult>

  /**
   * 根据 Fulfillment ID 获取物流追踪信息
   *
   * @param fulfillmentId - Fulfillment ID
   * @returns 包含物流追踪信息和可能的错误信息
   */
  getTrackingByFulfillment(fulfillmentId: string): Promise<TrackingResult>

  /**
   * 批量查询物流追踪信息
   *
   * 根据多个查询条件批量获取物流追踪信息。
   *
   * @param filter - 查询筛选条件，包括订单 ID、追踪号、状态等
   * @param accessToken - 用户访问令牌（可选）
   * @returns 物流追踪信息连接对象
   */
  getTrackings(filter?: TrackingFilter, accessToken?: string): Promise<TrackingInfoConnection>

  /**
   * 获取订单的 Fulfillment 列表
   *
   * @param orderId - 订单 ID
   * @param accessToken - 用户访问令牌（可选）
   * @returns Fulfillment 列表
   */
  getFulfillmentsByOrder(orderId: string, accessToken?: string): Promise<Fulfillment[]>

  /**
   * 获取物流服务商信息
   *
   * 根据物流服务商代码获取详细信息，包括联系电话、官网、服务等。
   *
   * @param carrierCode - 物流服务商代码，如 'DHL', 'FEDEX', 'UPS' 等
   * @returns 物流服务商信息，如果不支持返回 null
   */
  getCarrierInfo(carrierCode: string): Promise<CarrierInfo | null>

  /**
   * 获取所有支持的物流服务商列表
   *
   * @returns 支持的物流服务商列表
   */
  getSupportedCarriers(): Promise<CarrierInfo[]>

  /**
   * 订阅物流追踪更新
   *
   * 订阅指定物流追踪的更新通知，当物流状态变化时通过 Webhook 或邮件通知。
   *
   * @param trackingId - 物流追踪 ID
   * @param webhookUrl - Webhook 回调 URL（可选）
   * @param email - 通知邮箱（可选）
   * @returns 包含订阅结果和可能的错误信息
   */
  subscribeTrackingUpdates(
    trackingId: string,
    webhookUrl?: string,
    email?: string,
  ): Promise<{ success: boolean; userErrors: TrackingUserError[] }>

  /**
   * 取消物流追踪更新订阅
   *
   * @param trackingId - 物流追踪 ID
   * @returns 包含取消结果和可能的错误信息
   */
  unsubscribeTrackingUpdates(trackingId: string): Promise<{ success: boolean; userErrors: TrackingUserError[] }>

  /**
   * 刷新物流追踪信息
   *
   * 强制从物流服务商获取最新的追踪信息。
   *
   * @param trackingId - 物流追踪 ID
   * @returns 包含更新后的物流追踪信息和可能的错误信息
   */
  refreshTracking(trackingId: string): Promise<TrackingResult>
}

/**
 * 适配器类型枚举
 * 
 * 定义了支持的后端适配器类型：
 * - shopify: Shopify Storefront API 官方实现
 * - custom: 自定义后端实现（预留）
 * - mock: 本地 Mock 数据实现，用于开发和测试
 */
export type AdapterType = 'shopify' | 'custom' | 'mock'

/**
 * 适配器配置接口
 * 
 * 用于初始化电商适配器的配置参数。
 * 不同类型的适配器需要的配置可能不同。
 * 
 * @interface AdapterConfig
 */
export interface AdapterConfig {
  /** 适配器类型，决定使用哪个后端实现 */
  type: AdapterType
  /** Shopify 店铺域名，如 your-store.myshopify.com（Shopify 适配器必需） */
  storeDomain?: string
  /** Shopify Storefront API 访问令牌（Shopify 适配器必需） */
  storefrontApiToken?: string
  /** Shopify API 版本，如 2024-07（可选，有默认值） */
  apiVersion?: string
}
