// =========================================================================
// Mock 适配器 - 用于开发和测试环境
// =========================================================================

import type {
  IEcommerceAdapter
} from '../interface'
import type {
  Product,
  ProductConnection,
  ProductFilter,
  Collection,
  CollectionConnection,
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
  CartLine,
  ProductVariant,
  Money,
  Checkout,
  CheckoutCreateInput,
  CheckoutUpdateInput,
  CheckoutLineItemInput,
  CheckoutLineItemUpdateInput,
  ShippingRate,
  CheckoutResult,
  CheckoutUserError,
} from '@/types'
import {
  OrderFulfillmentStatus,
  OrderFinancialStatus,
  OrderCancelReason,
  CheckoutErrorCode,
} from '@/types'
import {
  getMockProducts,
  getMockProduct,
  getMockProductRecommendations,
  getMockCollections,
  getMockCollection,
  getAllMockProducts,
} from '@/mocks/products'
import { delay } from '@/lib/utils'

// =========================================================================
// 内存存储
// =========================================================================

/**
 * 模拟购物车内存存储
 * 使用 Map 存储，key 为 cartId，value 为 Cart 对象
 * 注意：仅在开发环境使用，生产环境会被 Shopify 适配器替代
 */
const mockCarts = new Map<string, Cart>()

// =========================================================================
// 测试账号
// =========================================================================

/**
 * 预定义的测试账号列表
 * 用于开发环境快速登录测试，生产环境不使用这些账号
 */
const TEST_ACCOUNTS = [
  {
    email: 'demo@example.com',
    password: 'demo123456',
    customer: {
      id: 'gid://shopify/Customer/123',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      displayName: 'Demo User',
      acceptsMarketing: true,
      numberOfOrders: 5,
      tags: ['vip'],
    },
  },
  {
    email: 'admin@example.com',
    password: 'admin123',
    customer: {
      id: 'gid://shopify/Customer/456',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      displayName: 'Admin User',
      acceptsMarketing: false,
      numberOfOrders: 12,
      tags: ['admin'],
    },
  },
]

/**
 * 生成模拟订单数据
 * 
 * 根据指定的数量生成模拟订单，包括各种状态组合，用于测试不同场景：
 * - 已支付 + 已完成
 * - 已支付 + 处理中
 * - 待支付 + 待处理
 * - 已支付 + 已完成
 * - 已退款
 * 
 * @param customerId - 所属用户的 ID
 * @param count - 要生成的订单数量
 * @returns 订单数组，格式符合 Shopify Connection 模式（{ node: Order }[]）
 */
function generateMockOrders(customerId: string, count: number): Array<{ node: Order }> {
  // 履行状态序列，模拟真实订单的各种状态
  const statuses = [
    OrderFulfillmentStatus.FULFILLED,
    OrderFulfillmentStatus.IN_PROGRESS,
    OrderFulfillmentStatus.OPEN,
    OrderFulfillmentStatus.FULFILLED,
    OrderFulfillmentStatus.FULFILLED,
  ]
  // 财务状态序列，与履行状态对应
  const financialStatuses = [
    OrderFinancialStatus.PAID,
    OrderFinancialStatus.PAID,
    OrderFinancialStatus.PENDING,
    OrderFinancialStatus.PAID,
    OrderFinancialStatus.REFUNDED,
  ]
  const products = getAllMockProducts()

  return Array.from({ length: count }, (_, i) => {
    const orderNumber = 1000 + i
    const productIndex = i % products.length
    const product = products[productIndex]
    const variant = product.variants.edges[0]?.node
    const daysAgo = Math.floor(Math.random() * 30)
    const processedAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    const totalAmount = (Math.random() * 200 + 20).toFixed(2)

    return {
      node: {
        id: `gid://shopify/Order/${orderNumber}`,
        name: `#${orderNumber}`,
        orderNumber,
        statusPageUrl: `/account/orders/gid://shopify/Order/${orderNumber}`,
        processedAt,
        currencyCode: 'USD',
        currentTotalPrice: { amount: totalAmount, currencyCode: 'USD' },
        currentSubtotalPrice: { amount: (parseFloat(totalAmount) - 10).toFixed(2), currencyCode: 'USD' },
        currentTotalTax: { amount: '10.00', currencyCode: 'USD' },
        totalShippingPrice: { amount: '5.99', currencyCode: 'USD' },
        totalPrice: { amount: totalAmount, currencyCode: 'USD' },
        subtotalPrice: { amount: (parseFloat(totalAmount) - 10).toFixed(2), currencyCode: 'USD' },
        totalTax: { amount: '10.00', currencyCode: 'USD' },
        totalDiscounts: { amount: '0.00', currencyCode: 'USD' },
        totalShipping: { amount: '5.99', currencyCode: 'USD' },
        totalRefunded: { amount: financialStatuses[i] === OrderFinancialStatus.REFUNDED ? totalAmount : '0.00', currencyCode: 'USD' },
        fulfillmentStatus: statuses[i],
        financialStatus: financialStatuses[i],
        cancelReason: financialStatuses[i] === OrderFinancialStatus.REFUNDED ? OrderCancelReason.CUSTOMER : undefined,
        canceledAt: financialStatuses[i] === OrderFinancialStatus.REFUNDED ? processedAt : undefined,
        lineItems: {
          edges: [
            {
              node: {
                id: `gid://shopify/LineItem/${orderNumber}-1`,
                variantTitle: variant?.title || 'Default',
                title: product.title,
                quantity: i % 3 + 1,
                originalTotalPrice: { amount: totalAmount, currencyCode: 'USD' },
                discountedTotalPrice: { amount: totalAmount, currencyCode: 'USD' },
                originalUnitPrice: { amount: (parseFloat(totalAmount) / (i % 3 + 1)).toFixed(2), currencyCode: 'USD' },
                product,
                variant,
                image: product.images.edges[0]?.node,
                taxLines: [],
                discounts: [],
              },
            },
          ],
        },
        shippingAddress: {
          id: 'gid://shopify/MailingAddress/1',
          address1: '123 Main St',
          address2: 'Apt 4B',
          city: 'New York',
          province: 'NY',
          country: 'United States',
          zip: '10001',
          phone: '+1 555-123-4567',
          firstName: 'Demo',
          lastName: 'User',
          name: 'Demo User',
          countryCode: 'US',
          provinceCode: 'NY',
        },
        billingAddress: {
          id: 'gid://shopify/MailingAddress/1',
          address1: '123 Main St',
          address2: 'Apt 4B',
          city: 'New York',
          province: 'NY',
          country: 'United States',
          zip: '10001',
          phone: '+1 555-123-4567',
          firstName: 'Demo',
          lastName: 'User',
          name: 'Demo User',
          countryCode: 'US',
          provinceCode: 'NY',
        },
        shippingLines: {
          edges: [
            {
              node: {
                id: 'gid://shopify/ShippingLine/1',
                title: 'Standard Shipping',
                price: { amount: '5.99', currencyCode: 'USD' },
                discountedPrice: { amount: '5.99', currencyCode: 'USD' },
                source: 'shopify',
              },
            },
          ],
        },
        discountApplications: { edges: [] },
        fulfillments: { edges: [] },
        refunds: { edges: [] },
        createdAt: processedAt,
        updatedAt: processedAt,
        customer: {
          id: customerId,
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User',
          displayName: 'Demo User',
        },
      },
    }
  })
}

function findVariantById(variantId: string): ProductVariant | null {
  const products = getAllMockProducts()
  for (const product of products) {
    for (const edge of product.variants.edges) {
      if (edge.node.id === variantId) {
        return edge.node
      }
    }
  }
  return null
}

function findProductByVariantId(variantId: string): Product | null {
  const products = getAllMockProducts()
  for (const product of products) {
    for (const edge of product.variants.edges) {
      if (edge.node.id === variantId) {
        return product
      }
    }
  }
  return null
}

function calculateMoney(amount: number, currencyCode: string = 'USD'): Money {
  return {
    amount: amount.toFixed(2),
    currencyCode,
  }
}

function createCartLine(variantId: string, quantity: number, lineId: string): CartLine | null {
  const variant = findVariantById(variantId)
  const product = findProductByVariantId(variantId)

  if (!variant || !product) return null

  const price = parseFloat(variant.price.amount)
  const total = price * quantity

  return {
    id: lineId,
    quantity,
    merchandise: variant,
    cost: {
      amountPerQuantity: variant.price,
      totalAmount: calculateMoney(total),
      subtotalAmount: calculateMoney(total),
    },
    attributes: [],
  }
}

function recalculateCart(cart: Cart): Cart {
  const lines = cart.lines.edges.map((e) => e.node)
  const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0)

  let subtotal = 0
  for (const line of lines) {
    subtotal += parseFloat(line.cost.totalAmount.amount)
  }

  const tax = subtotal * 0.08
  const total = subtotal + tax

  return {
    ...cart,
    totalQuantity,
    updatedAt: new Date().toISOString(),
    estimatedCost: {
      subtotalAmount: calculateMoney(subtotal),
      totalAmount: calculateMoney(total),
      taxAmount: calculateMoney(tax),
      dutyAmount: calculateMoney(0),
      shippingAmount: calculateMoney(0),
      subtotalAmountEstimated: false,
      totalAmountEstimated: false,
      taxAmountEstimated: true,
      dutyAmountEstimated: false,
      shippingAmountEstimated: true,
    },
  }
}

function createEmptyCart(cartId: string): Cart {
  const now = new Date().toISOString()
  return {
    id: cartId,
    checkoutUrl: '/checkout',
    createdAt: now,
    updatedAt: now,
    lines: { edges: [] },
    estimatedCost: {
      subtotalAmount: calculateMoney(0),
      totalAmount: calculateMoney(0),
      dutyAmount: calculateMoney(0),
      taxAmount: calculateMoney(0),
      shippingAmount: calculateMoney(0),
      subtotalAmountEstimated: false,
      totalAmountEstimated: false,
    },
    totalQuantity: 0,
    buyerIdentity: {
      countryCode: 'US',
    },
    attributes: [],
    discountCodes: [],
  }
}

/**
 * 创建 Mock 适配器实例
 * 
 * Mock 适配器用于开发和测试环境，提供完整的模拟数据：
 * - 商品数据：使用预设的 mock 商品数据
 * - 购物车：使用内存 Map 存储，支持完整的购物车操作
 * - 用户认证：使用预设的测试账号（demo@example.com/demo123456）
 * - 订单：动态生成模拟订单数据，包含各种状态组合
 * 
 * 设计特点：
 * 1. 所有方法添加 200-500ms 的延迟，模拟真实网络请求
 * 2. 数据格式与 Shopify 适配器完全一致，便于无缝切换
 * 3. 不依赖任何外部服务，可完全离线运行
 * 
 * @returns 实现了 IEcommerceAdapter 接口的 Mock 适配器实例
 */
export function createMockAdapter(): IEcommerceAdapter {
  return {
    // =========================================================================
    // 商品相关方法
    // =========================================================================

    async getProducts(filter: ProductFilter = {}): Promise<ProductConnection> {
      await delay(300)
      return getMockProducts(filter)
    },

    async getProduct(handle: string): Promise<Product | null> {
      await delay(200)
      return getMockProduct(handle)
    },

    async getProductRecommendations(productId: string): Promise<Product[]> {
      await delay(200)
      return getMockProductRecommendations(productId)
    },

    async getCollections(): Promise<CollectionConnection> {
      await delay(300)
      return getMockCollections()
    },

    async getCollection(handle: string): Promise<Collection | null> {
      await delay(200)
      return getMockCollection(handle)
    },

    async createCart(input?: CartInput): Promise<Cart> {
      await delay(200)
      const cartId = `gid://shopify/Cart/${Date.now()}`
      let cart = createEmptyCart(cartId)

      if (input?.lines && input.lines.length > 0) {
        const cartLines: CartLine[] = []
        for (let i = 0; i < input.lines.length; i++) {
          const line = input.lines[i]
          const cartLine = createCartLine(
            line.merchandiseId,
            line.quantity,
            `gid://shopify/CartLine/${Date.now()}-${i}`,
          )
          if (cartLine) {
            cartLines.push(cartLine)
          }
        }
        cart.lines.edges = cartLines.map((node) => ({ node }))
        cart = recalculateCart(cart)
      }

      if (input?.buyerIdentity) {
        cart.buyerIdentity = {
          ...cart.buyerIdentity,
          ...input.buyerIdentity,
          countryCode: input.buyerIdentity.countryCode || 'US',
        }
      }

      if (input?.discountCodes) {
        cart.discountCodes = input.discountCodes.map((code) => ({
          code,
          applicable: true,
        }))
      }

      if (input?.note) {
        cart.note = input.note
      }

      if (input?.attributes) {
        cart.attributes = input.attributes
      }

      mockCarts.set(cartId, cart)
      return cart
    },

    async getCart(cartId: string): Promise<Cart | null> {
      await delay(200)
      const cart = mockCarts.get(cartId)
      return cart || null
    },

    async addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
      await delay(200)
      let cart = mockCarts.get(cartId) || createEmptyCart(cartId)

      const existingLines = cart.lines.edges.map((e) => e.node)

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const existingLine = existingLines.find(
          (l) => l.merchandise.id === line.merchandiseId,
        )

        if (existingLine) {
          existingLine.quantity += line.quantity
          const price = parseFloat(existingLine.cost.amountPerQuantity.amount)
          existingLine.cost.totalAmount = calculateMoney(price * existingLine.quantity)
          existingLine.cost.subtotalAmount = calculateMoney(price * existingLine.quantity)
        } else {
          const cartLine = createCartLine(
            line.merchandiseId,
            line.quantity,
            `gid://shopify/CartLine/${Date.now()}-${i}`,
          )
          if (cartLine) {
            existingLines.push(cartLine)
          }
        }
      }

      cart.lines.edges = existingLines.map((node) => ({ node }))
      cart = recalculateCart(cart)
      mockCarts.set(cartId, cart)
      return cart
    },

    async updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
      await delay(200)
      let cart = mockCarts.get(cartId)
      if (!cart) {
        cart = createEmptyCart(cartId)
      }

      const existingLines = cart.lines.edges.map((e) => e.node)

      for (const update of lines) {
        const line = existingLines.find((l) => l.id === update.id)
        if (line) {
          if (update.quantity <= 0) {
            const index = existingLines.indexOf(line)
            existingLines.splice(index, 1)
          } else {
            line.quantity = update.quantity
            const price = parseFloat(line.cost.amountPerQuantity.amount)
            line.cost.totalAmount = calculateMoney(price * line.quantity)
            line.cost.subtotalAmount = calculateMoney(price * line.quantity)
          }
        }
      }

      cart.lines.edges = existingLines.map((node) => ({ node }))
      cart = recalculateCart(cart)
      mockCarts.set(cartId, cart)
      return cart
    },

    async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
      await delay(200)
      let cart = mockCarts.get(cartId)
      if (!cart) {
        cart = createEmptyCart(cartId)
      }

      cart.lines.edges = cart.lines.edges.filter((e) => !lineIds.includes(e.node.id))
      cart = recalculateCart(cart)
      mockCarts.set(cartId, cart)
      return cart
    },

    async updateCartBuyerIdentity(
      cartId: string,
      buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
    ): Promise<Cart> {
      await delay(200)
      let cart = mockCarts.get(cartId)
      if (!cart) {
        cart = createEmptyCart(cartId)
      }

      cart.buyerIdentity = {
        ...cart.buyerIdentity,
        countryCode: buyerIdentity.countryCode || 'US',
        email: buyerIdentity.email,
      }
      cart.updatedAt = new Date().toISOString()
      mockCarts.set(cartId, cart)
      return cart
    },

    async updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart> {
      await delay(200)
      let cart = mockCarts.get(cartId)
      if (!cart) {
        cart = createEmptyCart(cartId)
      }

      cart.discountCodes = discountCodes.map((code) => ({
        code,
        applicable: true,
      }))
      cart.updatedAt = new Date().toISOString()
      mockCarts.set(cartId, cart)
      return cart
    },

    async createCustomer(
      input: CustomerCreateInput,
    ): Promise<{ customer?: Customer; userErrors: UserError[] }> {
      await delay(300)
      const now = new Date().toISOString()
      const firstName = input.firstName || ''
      const lastName = input.lastName || ''
      return {
        customer: {
          id: `gid://shopify/Customer/${Date.now()}`,
          email: input.email,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`.trim(),
          createdAt: now,
          updatedAt: now,
          acceptsMarketing: input.acceptsMarketing || false,
          orders: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
          addresses: { edges: [] },
          defaultAddress: null,
          numberOfOrders: 0,
          tags: input.tags || [],
        },
        userErrors: [],
      }
    },

    async login(
      email: string,
      password: string,
    ): Promise<{ customerAccessToken?: CustomerAccessToken; userErrors: UserError[] }> {
      await delay(500)

      const account = TEST_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === email.toLowerCase(),
      )

      if (!account) {
        return {
          userErrors: [
            {
              field: ['email'],
              message: 'Invalid email or password',
            },
          ],
        }
      }

      if (account.password !== password) {
        return {
          userErrors: [
            {
              field: ['password'],
              message: 'Invalid email or password',
            },
          ],
        }
      }

      return {
        customerAccessToken: {
          accessToken: `mock-token-${Date.now()}-${account.customer.id}`,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        userErrors: [],
      }
    },

    async logout(accessToken: string): Promise<void> {
      void accessToken
      await delay(100)
    },

    async getCustomer(accessToken: string): Promise<Customer | null> {
      void accessToken
      await delay(200)

      const now = new Date().toISOString()
      let customerData = TEST_ACCOUNTS[0].customer

      if (accessToken.includes('Customer/456')) {
        customerData = TEST_ACCOUNTS[1].customer
      }

      const orders = generateMockOrders(customerData.id, customerData.numberOfOrders)

      return {
        id: customerData.id,
        email: customerData.email,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        displayName: customerData.displayName,
        createdAt: now,
        updatedAt: now,
        acceptsMarketing: customerData.acceptsMarketing,
        orders: { edges: orders, pageInfo: { hasNextPage: false, hasPreviousPage: false } },
        addresses: { edges: [] },
        defaultAddress: null,
        numberOfOrders: orders.length,
        tags: customerData.tags,
      }
    },

    async updateCustomer(
      accessToken: string,
      input: CustomerUpdateInput,
    ): Promise<{ customer?: Customer; userErrors: UserError[] }> {
      void accessToken
      await delay(200)
      const now = new Date().toISOString()
      const firstName = input.firstName || 'John'
      const lastName = input.lastName || 'Doe'
      const customerId = 'gid://shopify/Customer/123'
      const orders = generateMockOrders(customerId, 5)
      return {
        customer: {
          id: customerId,
          email: input.email || 'customer@example.com',
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`.trim(),
          createdAt: now,
          updatedAt: now,
          acceptsMarketing: input.acceptsMarketing || false,
          orders: { edges: orders, pageInfo: { hasNextPage: false, hasPreviousPage: false } },
          addresses: { edges: [] },
          defaultAddress: null,
          numberOfOrders: orders.length,
          tags: [],
        },
        userErrors: [],
      }
    },

    async resetPassword(
      password: string,
      resetToken: string,
    ): Promise<{ customer?: Customer; userErrors: UserError[] }> {
      void password
      void resetToken
      await delay(200)
      return { userErrors: [] }
    },

    async recoverCustomer(email: string): Promise<{ userErrors: UserError[] }> {
      void email
      await delay(200)
      return { userErrors: [] }
    },

    async activateCustomer(
      id: string,
      input: { password: string; activationToken: string },
    ): Promise<{ customer?: Customer; userErrors: UserError[] }> {
      void id
      void input
      await delay(200)
      return { userErrors: [] }
    },

    async createCustomerAddress(
      accessToken: string,
      address: MailingAddressInput,
    ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }> {
      void accessToken
      await delay(200)
      const firstName = address.firstName || ''
      const lastName = address.lastName || ''
      return {
        customerAddress: {
          id: `gid://shopify/MailingAddress/${Date.now()}`,
          address1: address.address1 || '',
          address2: address.address2,
          city: address.city || '',
          province: address.province,
          zip: address.zip || '',
          country: address.country || '',
          countryCode: address.countryCode || 'US',
          phone: address.phone,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          company: address.company,
        },
        userErrors: [],
      }
    },

    async updateCustomerAddress(
      accessToken: string,
      addressId: string,
      address: MailingAddressInput,
    ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }> {
      void accessToken
      await delay(200)
      const firstName = address.firstName || ''
      const lastName = address.lastName || ''
      return {
        customerAddress: {
          id: addressId,
          address1: address.address1 || '',
          address2: address.address2,
          city: address.city || '',
          province: address.province,
          zip: address.zip || '',
          country: address.country || '',
          countryCode: address.countryCode || 'US',
          phone: address.phone,
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          company: address.company,
        },
        userErrors: [],
      }
    },

    async deleteCustomerAddress(
      accessToken: string,
      addressId: string,
    ): Promise<{ deletedCustomerAddressId?: string; userErrors: UserError[] }> {
      void accessToken
      await delay(200)
      return {
        deletedCustomerAddressId: addressId,
        userErrors: [],
      }
    },

    async updateDefaultCustomerAddress(
      accessToken: string,
      addressId: string,
    ): Promise<{ customer?: Customer; userErrors: UserError[] }> {
      void accessToken
      void addressId
      await delay(200)
      return { userErrors: [] }
    },

    // =========================================================================
    // 订单相关方法
    // =========================================================================

    /**
     * 获取用户订单列表（Mock 实现）
     * 
     * 动态生成模拟订单数据，忽略 accessToken 参数（Mock 环境无需验证）。
     * 每次调用都会重新生成订单数据，确保测试时能看到不同的状态组合。
     * 
     * 注意：
     * 1. 忽略 accessToken 参数，因为 Mock 环境不做身份验证
     * 2. 模拟 200ms 延迟，模拟真实网络请求
     * 3. 固定返回 5 个订单（可通过 first 参数限制数量）
     * 4. pageInfo.hasNextPage 始终为 false，因为 Mock 数据不支持分页
     * 
     * @param accessToken - 用户访问令牌（Mock 环境忽略）
     * @param first - 返回的订单数量，默认返回全部 5 个
     * @returns 订单连接对象
     */
    async getOrders(accessToken: string, first?: number): Promise<OrderConnection> {
      void accessToken // Mock 环境忽略访问令牌
      await delay(200)
      const customerId = 'gid://shopify/Customer/123'
      const allOrders = generateMockOrders(customerId, 5)
      const edges = first ? allOrders.slice(0, first) : allOrders
      return {
        edges,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    },

    /**
     * 获取单个订单详情（Mock 实现）
     * 
     * 重新生成 5 个模拟订单，然后根据 orderId 查找匹配的订单。
     * 这种设计确保即使 orderId 未知，也能通过查看所有生成的订单进行调试。
     * 
     * 注意：
     * 1. 每次调用都会重新生成订单数据
     * 2. 如果找不到匹配的订单，返回 null
     * 3. Mock 订单 ID 格式：gid://shopify/Order/1000、gid://shopify/Order/1001 等
     * 
     * @param orderId - 订单 ID
     * @returns 订单详情，如果未找到返回 null
     */
    async getOrder(orderId: string): Promise<Order | null> {
      await delay(200)
      const customerId = 'gid://shopify/Customer/123'
      const allOrders = generateMockOrders(customerId, 5)
      const order = allOrders.find((o) => o.node.id === orderId)
      return order ? order.node : null
    },

    // =========================================================================
    // Checkout 相关方法（Mock 实现）
    // =========================================================================

    /**
     * 创建新的 Checkout（Mock 实现）
     * 
     * 生成一个模拟的 Checkout 对象，包含完整的商品、价格、地址等信息。
     * 如果提供了 input 参数，会使用 input 中的数据覆盖默认值。
     * 
     * @param input - Checkout 创建参数
     * @returns 包含创建的 Checkout 和可能的错误信息
     */
    async createCheckout(input?: CheckoutCreateInput): Promise<CheckoutResult> {
      await delay(200)

      const mockProducts = getAllMockProducts()
      const lineItems = input?.lineItems?.map((lineItem, index) => {
        const product = mockProducts[index % mockProducts.length]
        const variant = product.variants.edges[0]?.node

        return {
          id: `gid://shopify/CheckoutLineItem/${Date.now() + index}`,
          title: product.title,
          quantity: lineItem.quantity,
          originalTotalPrice: {
            amount: (Number(variant?.price?.amount || '0') * lineItem.quantity).toString(),
            currencyCode: 'USD',
          },
          discountedTotalPrice: {
            amount: (Number(variant?.price?.amount || '0') * lineItem.quantity).toString(),
            currencyCode: 'USD',
          },
          variant: variant ? {
            id: variant.id,
            title: variant.title,
            price: variant.price,
            image: variant.image,
            product: {
              id: product.id,
              title: product.title,
            },
          } : undefined,
        }
      }) || []

      const subtotal = lineItems.reduce(
        (sum, item) => sum + Number(item.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const total = subtotal + tax

      const mockCheckout: Checkout = {
        id: `gid://shopify/Checkout/${Date.now()}`,
        email: input?.email || 'test@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        currencyCode: 'USD',
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalTax: {
          amount: tax.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        ready: true,
        requiresShipping: true,
        checkoutUrl: `https://checkout.example.com/${Date.now()}`,
        webUrl: `https://checkout.example.com/${Date.now()}`,
        order: null,
        orderStatusUrl: null,
        buyerIdentity: {
          email: input?.email || 'test@example.com',
          phone: null,
          countryCode: 'US',
        },
        shippingAddress: input?.shippingAddress ? {
          firstName: input.shippingAddress.firstName || '',
          lastName: input.shippingAddress.lastName || '',
          address1: input.shippingAddress.address1 || '',
          address2: input.shippingAddress.address2 || '',
          city: input.shippingAddress.city || '',
          province: input.shippingAddress.province || '',
          zip: input.shippingAddress.zip || '',
          country: input.shippingAddress.country || '',
          phone: input.shippingAddress.phone || null,
        } : null,
        billingAddress: null,
        shippingLine: null,
        availableShippingRates: {
          ready: true,
          rates: [
            {
              handle: 'standard',
              title: 'Standard Shipping',
              price: {
                amount: '5.99',
                currencyCode: 'USD',
              },
            },
            {
              handle: 'express',
              title: 'Express Shipping',
              price: {
                amount: '15.99',
                currencyCode: 'USD',
              },
            },
            {
              handle: 'free',
              title: 'Free Shipping',
              price: {
                amount: '0.00',
                currencyCode: 'USD',
              },
            },
          ],
        },
        lineItems: {
          edges: lineItems.map((item) => ({
            cursor: Buffer.from(item.id).toString('base64'),
            node: item,
          })),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        discountApplications: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }

      return {
        checkout: mockCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 获取 Checkout 详情（Mock 实现）
     * 
     * 生成一个模拟的 Checkout 对象，包含完整的商品信息。
     * 
     * @param checkoutId - Checkout ID
     * @returns Checkout 对象
     */
    async getCheckout(checkoutId: string): Promise<Checkout | null> {
      await delay(200)

      const mockProducts = getAllMockProducts()
      const lineItems = mockProducts.slice(0, 2).map((product, index) => {
        const variant = product.variants.edges[0]?.node
        const quantity = index + 1

        return {
          id: `gid://shopify/CheckoutLineItem/${Date.now() + index}`,
          title: product.title,
          quantity,
          originalTotalPrice: {
            amount: (Number(variant?.price?.amount || '0') * quantity).toString(),
            currencyCode: 'USD',
          },
          discountedTotalPrice: {
            amount: (Number(variant?.price?.amount || '0') * quantity).toString(),
            currencyCode: 'USD',
          },
          variant: variant ? {
            id: variant.id,
            title: variant.title,
            price: variant.price,
            image: variant.image,
            product: {
              id: product.id,
              title: product.title,
            },
          } : undefined,
        }
      })

      const subtotal = lineItems.reduce(
        (sum, item) => sum + Number(item.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = 5.99
      const total = subtotal + tax + shipping

      return {
        id: checkoutId,
        email: 'test@example.com',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date().toISOString(),
        completedAt: null,
        currencyCode: 'USD',
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalTax: {
          amount: tax.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        ready: true,
        requiresShipping: true,
        checkoutUrl: `https://checkout.example.com/${checkoutId}`,
        webUrl: `https://checkout.example.com/${checkoutId}`,
        order: null,
        orderStatusUrl: null,
        buyerIdentity: {
          email: 'test@example.com',
          phone: null,
          countryCode: 'US',
        },
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          address2: 'Apt 4B',
          city: 'New York',
          province: 'NY',
          zip: '10001',
          country: 'United States',
          phone: '+1234567890',
        },
        billingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          address2: 'Apt 4B',
          city: 'New York',
          province: 'NY',
          zip: '10001',
          country: 'United States',
          phone: '+1234567890',
        },
        shippingLine: {
          handle: 'standard',
          title: 'Standard Shipping',
          price: {
            amount: '5.99',
            currencyCode: 'USD',
          },
        },
        availableShippingRates: {
          ready: true,
          rates: [
            {
              handle: 'standard',
              title: 'Standard Shipping',
              price: {
                amount: '5.99',
                currencyCode: 'USD',
              },
            },
            {
              handle: 'express',
              title: 'Express Shipping',
              price: {
                amount: '15.99',
                currencyCode: 'USD',
              },
            },
            {
              handle: 'free',
              title: 'Free Shipping',
              price: {
                amount: '0.00',
                currencyCode: 'USD',
              },
            },
          ],
        },
        lineItems: {
          edges: lineItems.map((item) => ({
            cursor: Buffer.from(item.id).toString('base64'),
            node: item,
          })),
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        discountApplications: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }
    },

    /**
     * 更新 Checkout 信息（Mock 实现）
     * 
     * 简单地返回一个更新后的 Checkout 对象。
     * 
     * @param checkoutId - Checkout ID
     * @param input - 要更新的 Checkout 信息
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async updateCheckout(checkoutId: string, input: CheckoutUpdateInput): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        email: input.email || existingCheckout.email,
        updatedAt: new Date().toISOString(),
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 向 Checkout 添加商品（Mock 实现）
     * 
     * 模拟向 Checkout 添加商品的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param lineItems - 要添加的商品行数组
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async addCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const mockProducts = getAllMockProducts()
      const newLineItems = lineItems.map((lineItem, index) => {
        const product = mockProducts[index % mockProducts.length]
        const variant = product.variants.edges[0]?.node

        return {
          cursor: Buffer.from(`gid://shopify/CheckoutLineItem/${Date.now() + index}`).toString('base64'),
          node: {
            id: `gid://shopify/CheckoutLineItem/${Date.now() + index}`,
            title: product.title,
            quantity: lineItem.quantity,
            originalTotalPrice: {
              amount: (Number(variant?.price?.amount || '0') * lineItem.quantity).toString(),
              currencyCode: 'USD',
            },
            discountedTotalPrice: {
              amount: (Number(variant?.price?.amount || '0') * lineItem.quantity).toString(),
              currencyCode: 'USD',
            },
            variant: variant ? {
              id: variant.id,
              title: variant.title,
              price: variant.price,
              image: variant.image,
              product: {
                id: product.id,
                title: product.title,
              },
            } : undefined,
          },
        }
      })

      const allLineItems = [
        ...existingCheckout.lineItems.edges,
        ...newLineItems,
      ]

      const subtotal = allLineItems.reduce(
        (sum, edge) => sum + Number(edge.node.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = Number(existingCheckout.shippingLine?.price.amount || '0')
      const total = subtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalTax: {
          amount: tax.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        lineItems: {
          ...existingCheckout.lineItems,
          edges: allLineItems,
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 更新 Checkout 商品行（Mock 实现）
     * 
     * 模拟更新 Checkout 商品行的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param lineItems - 要更新的商品行数组
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async updateCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemUpdateInput[]): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const updatedEdges = existingCheckout.lineItems.edges.map((edge) => {
        const updateItem = lineItems.find((item) => item.id === edge.node.id)
        if (updateItem) {
          const unitPrice = Number(edge.node.originalTotalPrice.amount) / edge.node.quantity
          return {
            ...edge,
            node: {
              ...edge.node,
              quantity: updateItem.quantity,
              originalTotalPrice: {
                amount: (unitPrice * updateItem.quantity).toFixed(2),
                currencyCode: 'USD',
              },
              discountedTotalPrice: {
                amount: (unitPrice * updateItem.quantity).toFixed(2),
                currencyCode: 'USD',
              },
            },
          }
        }
        return edge
      }).filter((edge) => edge.node.quantity > 0)

      const subtotal = updatedEdges.reduce(
        (sum, edge) => sum + Number(edge.node.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = Number(existingCheckout.shippingLine?.price.amount || '0')
      const total = subtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalTax: {
          amount: tax.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        lineItems: {
          ...existingCheckout.lineItems,
          edges: updatedEdges,
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 移除 Checkout 商品行（Mock 实现）
     * 
     * 模拟移除 Checkout 商品行的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param lineItemIds - 要移除的商品行 ID 数组
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async removeCheckoutLines(checkoutId: string, lineItemIds: string[]): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const updatedEdges = existingCheckout.lineItems.edges.filter(
        (edge) => !lineItemIds.includes(edge.node.id),
      )

      const subtotal = updatedEdges.reduce(
        (sum, edge) => sum + Number(edge.node.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = Number(existingCheckout.shippingLine?.price.amount || '0')
      const total = subtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalTax: {
          amount: tax.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        lineItems: {
          ...existingCheckout.lineItems,
          edges: updatedEdges,
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 更新 Checkout 买家身份（Mock 实现）
     * 
     * 模拟更新 Checkout 买家身份的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param buyerIdentity - 买家身份信息
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async updateCheckoutBuyerIdentity(
      checkoutId: string,
      buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
    ): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        email: buyerIdentity.email || existingCheckout.email,
        buyerIdentity: {
          ...existingCheckout.buyerIdentity,
          email: buyerIdentity.email || existingCheckout.buyerIdentity?.email,
          countryCode: buyerIdentity.countryCode || existingCheckout.buyerIdentity?.countryCode,
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 更新 Checkout 配送地址（Mock 实现）
     * 
     * 模拟更新 Checkout 配送地址的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param shippingAddress - 配送地址信息
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async updateCheckoutShippingAddress(
      checkoutId: string,
      shippingAddress: MailingAddressInput,
    ): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        shippingAddress: {
          firstName: shippingAddress.firstName || '',
          lastName: shippingAddress.lastName || '',
          address1: shippingAddress.address1 || '',
          address2: shippingAddress.address2 || '',
          city: shippingAddress.city || '',
          province: shippingAddress.province || '',
          zip: shippingAddress.zip || '',
          country: shippingAddress.country || '',
          phone: shippingAddress.phone || null,
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 获取 Checkout 可用配送方式（Mock 实现）
     * 
     * 返回模拟的可用配送方式列表。
     * 
     * @param checkoutId - Checkout ID
     * @returns 可用配送方式数组
     */
    async getAvailableShippingRates(checkoutId: string): Promise<ShippingRate[]> {
      await delay(200)
      void checkoutId

      return [
        {
          handle: 'standard',
          title: 'Standard Shipping',
          price: {
            amount: '5.99',
            currencyCode: 'USD',
          },
        },
        {
          handle: 'express',
          title: 'Express Shipping',
          price: {
            amount: '15.99',
            currencyCode: 'USD',
          },
        },
        {
          handle: 'free',
          title: 'Free Shipping',
          price: {
            amount: '0.00',
            currencyCode: 'USD',
          },
        },
      ]
    },

    /**
     * 选择 Checkout 配送方式（Mock 实现）
     * 
     * 模拟选择 Checkout 配送方式的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param shippingRateHandle - 配送方式的 handle
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async updateCheckoutShippingLine(checkoutId: string, shippingRateHandle: string): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const rates = await this.getAvailableShippingRates(checkoutId)
      const selectedRate = rates.find((r) => r.handle === shippingRateHandle)

      if (!selectedRate) {
        return {
          checkout: existingCheckout,
          checkoutUserErrors: [{
            field: ['shippingRateHandle'],
            message: 'Invalid shipping rate',
            code: CheckoutErrorCode.SHIPPING_RATE_NOT_FOUND,
          }],
        }
      }

      const subtotal = existingCheckout.lineItems.edges.reduce(
        (sum, edge) => sum + Number(edge.node.discountedTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = Number(selectedRate.price.amount)
      const total = subtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        shippingLine: {
          handle: selectedRate.handle,
          title: selectedRate.title,
          price: selectedRate.price,
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 应用折扣码到 Checkout（Mock 实现）
     * 
     * 模拟应用折扣码的操作。
     * 
     * @param checkoutId - Checkout ID
     * @param discountCode - 折扣码
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async applyDiscountCode(checkoutId: string, discountCode: string): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const validCodes = ['SAVE10', 'SAVE20', 'FREE', 'WELCOME10']
      if (!validCodes.includes(discountCode.toUpperCase())) {
        return {
          checkout: existingCheckout,
          checkoutUserErrors: [{
            field: ['discountCode'],
            message: 'Invalid discount code',
            code: CheckoutErrorCode.INVALID_DISCOUNT,
          }],
        }
      }

      const subtotal = existingCheckout.lineItems.edges.reduce(
        (sum, edge) => sum + Number(edge.node.discountedTotalPrice.amount),
        0,
      )
      const discountRate = discountCode.toUpperCase() === 'SAVE20' ? 0.2 : 0.1
      const discountAmount = subtotal * discountRate
      const discountedSubtotal = subtotal - discountAmount
      const tax = discountedSubtotal * 0.08
      const shipping = Number(existingCheckout.shippingLine?.price.amount || '0')
      const total = discountedSubtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        subtotalPrice: {
          amount: discountedSubtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        discountApplications: {
          edges: [
            {
              cursor: Buffer.from(discountCode).toString('base64'),
              node: {
                targetType: 'LINE_ITEM',
                targetSelection: 'ALL',
                allocationMethod: 'ACROSS',
                description: `Discount code: ${discountCode}`,
                title: discountCode.toUpperCase(),
                code: discountCode.toUpperCase(),
              },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 移除 Checkout 折扣码（Mock 实现）
     * 
     * 模拟移除 Checkout 折扣码的操作。
     * 
     * @param checkoutId - Checkout ID
     * @returns 包含更新后的 Checkout 和可能的错误信息
     */
    async removeDiscountCode(checkoutId: string): Promise<CheckoutResult> {
      await delay(200)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          checkout: null,
          checkoutUserErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const subtotal = existingCheckout.lineItems.edges.reduce(
        (sum, edge) => sum + Number(edge.node.originalTotalPrice.amount),
        0,
      )
      const tax = subtotal * 0.08
      const shipping = Number(existingCheckout.shippingLine?.price.amount || '0')
      const total = subtotal + tax + shipping

      const updatedCheckout: Checkout = {
        ...existingCheckout,
        updatedAt: new Date().toISOString(),
        subtotalPrice: {
          amount: subtotal.toFixed(2),
          currencyCode: 'USD',
        },
        totalPrice: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDue: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        paymentDueV2: {
          amount: total.toFixed(2),
          currencyCode: 'USD',
        },
        discountApplications: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
      }

      return {
        checkout: updatedCheckout,
        checkoutUserErrors: [],
      }
    },

    /**
     * 完成 Checkout（Mock 实现）
     * 
     * 模拟完成 Checkout 的操作，创建一个模拟订单。
     * 
     * @param checkoutId - Checkout ID
     * @returns 包含创建的订单和可能的错误信息
     */
    async completeCheckout(checkoutId: string): Promise<{ order?: Order; userErrors: CheckoutUserError[] }> {
      await delay(500)

      const existingCheckout = await this.getCheckout(checkoutId)
      if (!existingCheckout) {
        return {
          userErrors: [{
            field: ['checkoutId'],
            message: 'Checkout not found',
            code: CheckoutErrorCode.UNKNOWN,
          }],
        }
      }

      const orderId = `gid://shopify/Order/${Date.now()}`
      const order: Order = {
        id: orderId,
        name: `#${Math.floor(Math.random() * 10000)}`,
        orderNumber: Math.floor(Math.random() * 10000),
        statusPageUrl: `https://shop.example.com/orders/${orderId}`,
        processedAt: new Date().toISOString(),
        canceledAt: null,
        cancelReason: null,
        currencyCode: existingCheckout.currencyCode,
        currentTotalPrice: existingCheckout.totalPrice,
        currentSubtotalPrice: existingCheckout.subtotalPrice,
        totalShippingPrice: existingCheckout.shippingLine?.price || { amount: '0', currencyCode: 'USD' },
        totalTax: existingCheckout.totalTax,
        financialStatus: OrderFinancialStatus.PAID,
        fulfillmentStatus: OrderFulfillmentStatus.UNFULFILLED,
        lineItems: {
          edges: existingCheckout.lineItems.edges.map((edge) => ({
            cursor: edge.cursor,
            node: {
              id: `gid://shopify/OrderLineItem/${Date.now()}`,
              title: edge.node.title,
              quantity: edge.node.quantity,
              originalTotalPrice: edge.node.originalTotalPrice,
              discountedTotalPrice: edge.node.discountedTotalPrice,
              variant: edge.node.variant,
            },
          })),
          pageInfo: existingCheckout.lineItems.pageInfo,
        },
        shippingAddress: existingCheckout.shippingAddress,
        billingAddress: existingCheckout.billingAddress,
        fulfillments: {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
          },
        },
        discountApplications: existingCheckout.discountApplications,
      }

      return {
        order,
        userErrors: [],
      }
    },
  }
}
