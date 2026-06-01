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
} from '@/types'
import {
  getMockProducts,
  getMockProduct,
  getMockProductRecommendations,
  getMockCollections,
  getMockCollection,
} from '@/mocks/products'
import { delay } from '@/lib/utils'

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
      void input
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: `gid://shopify/Cart/${Date.now()}`,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
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
    },

    async getCart(cartId: string): Promise<Cart | null> {
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
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
    },

    async addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmountEstimated: false,
          totalAmountEstimated: false,
        },
        totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
        buyerIdentity: {
          countryCode: 'US',
        },
        attributes: [],
        discountCodes: [],
      }
    },

    async updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmountEstimated: false,
          totalAmountEstimated: false,
        },
        totalQuantity: lines.reduce((sum, line) => sum + (line.quantity || 0), 0),
        buyerIdentity: {
          countryCode: 'US',
        },
        attributes: [],
        discountCodes: [],
      }
    },

    async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
      void lineIds
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
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
    },

    async updateCartBuyerIdentity(
      cartId: string,
      buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
    ): Promise<Cart> {
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmountEstimated: false,
          totalAmountEstimated: false,
        },
        totalQuantity: 0,
        buyerIdentity: {
          countryCode: buyerIdentity.countryCode || 'US',
          email: buyerIdentity.email,
        },
        attributes: [],
        discountCodes: [],
      }
    },

    async updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart> {
      await delay(200)
      const now = new Date().toISOString()
      return {
        id: cartId,
        checkoutUrl: '/checkout',
        createdAt: now,
        updatedAt: now,
        lines: { edges: [] },
        estimatedCost: {
          subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
          totalAmount: { amount: '0.00', currencyCode: 'USD' },
          dutyAmount: { amount: '0.00', currencyCode: 'USD' },
          taxAmount: { amount: '0.00', currencyCode: 'USD' },
          subtotalAmountEstimated: false,
          totalAmountEstimated: false,
        },
        totalQuantity: 0,
        buyerIdentity: {
          countryCode: 'US',
        },
        attributes: [],
        discountCodes: discountCodes.map((code) => ({
          code,
          applicable: true,
        })),
      }
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
