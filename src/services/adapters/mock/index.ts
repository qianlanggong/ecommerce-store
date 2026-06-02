import type { IEcommerceAdapter } from '../interface'
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
  UserError,
  CartLine,
  ProductVariant,
  Money,
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

const mockCarts = new Map<string, Cart>()

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

export function createMockAdapter(): IEcommerceAdapter {
  return {
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
      void email
      void password
      await delay(300)
      return {
        customerAccessToken: {
          accessToken: `mock-token-${Date.now()}`,
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
      return {
        id: `gid://shopify/Customer/123`,
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        displayName: 'John Doe',
        createdAt: now,
        updatedAt: now,
        acceptsMarketing: false,
        orders: { edges: [], pageInfo: { hasNextPage: false, hasPreviousPage: false } },
        addresses: { edges: [] },
        defaultAddress: null,
        numberOfOrders: 0,
        tags: [],
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
      return {
        customer: {
          id: `gid://shopify/Customer/123`,
          email: input.email || 'customer@example.com',
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

    async getOrders(accessToken: string, first?: number): Promise<OrderConnection> {
      void accessToken
      void first
      await delay(200)
      return {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    },

    async getOrder(orderId: string): Promise<unknown | null> {
      void orderId
      await delay(200)
      return null
    },
  }
}
