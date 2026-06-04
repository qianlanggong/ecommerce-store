/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import type { IEcommerceAdapter, AdapterConfig } from '../interface'
import { TrackingErrorCode } from '@/types'
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
  MailingAddressInput,
  CustomerAccessToken,
  OrderConnection,
  Order,
  Checkout,
  CheckoutCreateInput,
  CheckoutUpdateInput,
  CheckoutLineItemInput,
  CheckoutLineItemUpdateInput,
  ShippingRate,
  CheckoutResult,
  CheckoutUserError,
  TrackingInfoConnection,
  TrackingResult,
  TrackingFilter,
  Fulfillment,
  CarrierInfo,
  TrackingUserError,
} from '@/types'

// =========================================================================
// 环境变量配置
// =========================================================================

/** Shopify 店铺域名，从环境变量读取，无配置时为空字符串 */
const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || ''
/** Shopify Storefront API 访问令牌，从环境变量读取 */
const SHOPIFY_API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || ''
/** Shopify API 版本，默认使用 2024-07 */
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-07'

// =========================================================================
// 类型别名
// =========================================================================

/**
 * Shopify API 响应类型
 * 用于类型边界层，处理 Shopify API 返回的原始响应
 */
type ShopifyApiResponse = { data: any; errors?: unknown[] }

/**
 * Shopify 客户端请求函数类型
 * 用于类型转换，因为官方类型定义不够精确
 */
type ShopifyClientRequest = (
  query: string,
  variables?: Record<string, unknown>,
) => Promise<ShopifyApiResponse>

// =========================================================================
// Shopify 适配器实现
// =========================================================================

/**
 * Shopify Storefront API 适配器实现
 * 
 * 这是 IEcommerceAdapter 接口的 Shopify 官方实现。
 * 封装了所有与 Shopify Storefront API 的交互，包括：
 * - 商品查询
 * - 购物车管理
 * - 用户认证
 * - 订单查询
 * 
 * 设计特点：
 * 1. 所有 API 调用通过统一的 request 方法，便于错误处理和日志记录
 * 2. 使用 GraphQL 查询精确获取所需字段，避免过度请求
 * 3. 响应数据直接转换为项目定义的标准类型
 * 
 * @class ShopifyAdapter
 * @implements IEcommerceAdapter
 */
export class ShopifyAdapter implements IEcommerceAdapter {
  /** Shopify Storefront API 客户端实例 */
  private client: ReturnType<typeof createStorefrontApiClient>

  /**
   * 构造函数
   * 
   * 创建 Shopify 适配器实例，初始化 Storefront API 客户端。
   * 配置优先级：传入的 config > 环境变量。
   * 
   * @param config - 可选的适配器配置，可覆盖环境变量设置
   */
  constructor(config?: Partial<AdapterConfig>) {
    this.client = createStorefrontApiClient({
      storeDomain: config?.storeDomain || SHOPIFY_DOMAIN,
      apiVersion: config?.apiVersion || SHOPIFY_API_VERSION,
      publicAccessToken: config?.storefrontApiToken || SHOPIFY_API_TOKEN,
    })
  }

  /**
   * 统一的 API 请求方法
   * 
   * 所有 GraphQL 查询都通过此方法发送，集中处理：
   * 1. 类型转换（官方 SDK 类型不够精确）
   * 2. 错误日志记录
   * 3. 统一的响应格式
   * 
   * @param query - GraphQL 查询字符串
   * @param variables - GraphQL 查询变量
   * @returns Shopify API 响应，包含 data 和可能的 errors
   */
  private async request(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<ShopifyApiResponse> {
    // 类型转换：官方 SDK 的 request 方法类型定义不完全匹配
    const result = await (this.client.request as unknown as ShopifyClientRequest)(query, variables)

    // 记录 API 错误（不抛出，让上层业务决定如何处理）
    if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
      console.error('Shopify API errors:', result.errors)
    }

    return result
  }

  async getProducts(filter?: ProductFilter): Promise<ProductConnection> {
    const query = `
      query GetProducts($first: Int, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
        products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
          edges {
            node {
              id
              handle
              title
              description
              descriptionHtml
              availableForSale
              totalInventory
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              featuredImage {
                id
                url
                altText
                width
                height
              }
              images(first: 5) {
                edges {
                  node {
                    id
                    url
                    altText
                    width
                    height
                  }
                }
              }
              options {
                id
                name
                values
              }
              tags
              productType
              vendor
              createdAt
              updatedAt
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `

    const variables = {
      first: filter?.first || 24,
      sortKey: filter?.sortKey || 'BEST_SELLING',
      reverse: filter?.reverse || false,
      query: filter?.query || '',
    }

    const { data } = await this.request(query, variables)
    return data.products
  }

  async getProduct(handle: string): Promise<Product | null> {
    const query = `
      query GetProduct($handle: String!) {
        productByHandle(handle: $handle) {
          id
          handle
          title
          description
          descriptionHtml
          availableForSale
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            id
            url
            altText
            width
            height
          }
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          options {
            id
            name
            values
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          collections(first: 5) {
            edges {
              node {
                id
                handle
                title
              }
            }
          }
          tags
          productType
          vendor
          createdAt
          updatedAt
        }
      }
    `

    const { data } = await this.request(query, { handle })
    return data.productByHandle as Product | null
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    const query = `
      query GetProductRecommendations($productId: ID!) {
        productRecommendations(productId: $productId) {
          id
          handle
          title
          availableForSale
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          featuredImage {
            id
            url
            altText
            width
            height
          }
        }
      }
    `

    const { data } = await this.request(query, { productId })
    return data.productRecommendations as Product[]
  }

  async getCollections(): Promise<CollectionConnection> {
    const query = `
      query GetCollections($first: Int) {
        collections(first: $first) {
          edges {
            node {
              id
              handle
              title
              description
              descriptionHtml
              image {
                id
                url
                altText
                width
                height
              }
              updatedAt
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `

    const { data } = await this.request(query, { first: 20 })
    return data.collections as CollectionConnection
  }

  async getCollection(handle: string): Promise<Collection | null> {
    const query = `
      query GetCollection($handle: String!) {
        collectionByHandle(handle: $handle) {
          id
          handle
          title
          description
          descriptionHtml
          image {
            id
            url
            altText
            width
            height
          }
          products(first: 24) {
            edges {
              node {
                id
                handle
                title
                availableForSale
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                featuredImage {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
          updatedAt
        }
      }
    `

    const { data } = await this.request(query, { handle })
    return data.collectionByHandle as Collection | null
  }

  async createCart(input?: CartInput): Promise<Cart> {
    const query = `
      mutation CreateCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
            createdAt
            updatedAt
            totalQuantity
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
              totalTaxAmount {
                amount
                currencyCode
              }
              totalDutyAmount {
                amount
                currencyCode
              }
              totalShippingAmount {
                amount
                currencyCode
              }
            }
            lines(first: 10) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        id
                        title
                        handle
                        featuredImage {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  cost {
                    amountPerQuantity {
                      amount
                      currencyCode
                    }
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
            discountCodes {
              code
              applicable
            }
            attributes {
              key
              value
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { input })
    return data.cartCreate.cart as Cart
  }

  async getCart(cartId: string): Promise<Cart | null> {
    const query = `
      query GetCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          createdAt
          updatedAt
          totalQuantity
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
            totalShippingAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    sku
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                      currencyCode
                    }
                    availableForSale
                    quantityAvailable
                    product {
                      id
                      title
                      handle
                      availableForSale
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                    image {
                      id
                      url
                      altText
                      width
                      height
                    }
                    selectedOptions {
                      name
                      value
                    }
                  }
                }
                cost {
                  amountPerQuantity {
                    amount
                    currencyCode
                  }
                  compareAtAmountPerQuantity {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
                  totalAmount {
                    amount
                    currencyCode
                  }
                }
                attributes {
                  key
                  value
                }
              }
            }
          }
          discountCodes {
            code
            applicable
          }
          note
          attributes {
            key
            value
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId })
    return data.cart as Cart | null
  }

  async addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart> {
    const query = `
      mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        id
                        title
                        handle
                        featuredImage {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                      image {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                  cost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId, lines })
    return data.cartLinesAdd.cart as Cart
  }

  async updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart> {
    const query = `
      mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            totalQuantity
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                      product {
                        id
                        title
                        handle
                        featuredImage {
                          id
                          url
                          altText
                          width
                          height
                        }
                      }
                    }
                  }
                  cost {
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId, lines })
    return data.cartLinesUpdate.cart as Cart
  }

  async removeCartLines(cartId: string, lineIds: string[]): Promise<Cart> {
    const query = `
      mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            totalQuantity
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId, lineIds })
    return data.cartLinesRemove.cart as Cart
  }

  async updateCartBuyerIdentity(
    cartId: string,
    buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
  ): Promise<Cart> {
    const query = `
      mutation UpdateCartBuyerIdentity($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
        cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
          cart {
            id
            buyerIdentity {
              email
              countryCode
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId, buyerIdentity })
    return data.cartBuyerIdentityUpdate.cart as Cart
  }

  async updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart> {
    const query = `
      mutation UpdateCartDiscountCodes($cartId: ID!, $discountCodes: [String!]) {
        cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
          cart {
            id
            discountCodes {
              code
              applicable
            }
            estimatedCost {
              totalAmount {
                amount
                currencyCode
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `

    const { data } = await this.request(query, { cartId, discountCodes })
    return data.cartDiscountCodesUpdate.cart as Cart
  }

  async createCustomer(
    input: CustomerCreateInput,
  ): Promise<{ customer?: Customer; userErrors: any[] }> {
    const query = `
      mutation CreateCustomer($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
            displayName
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { input })
    return {
      customer: data.customerCreate.customer as Customer,
      userErrors: data.customerCreate.userErrors as any[],
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ customerAccessToken?: CustomerAccessToken; userErrors: any[] }> {
    const query = `
      mutation Login($input: CustomerAccessTokenCreateInput!) {
        customerAccessTokenCreate(input: $input) {
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { input: { email, password } })
    return {
      customerAccessToken: data.customerAccessTokenCreate
        .customerAccessToken as CustomerAccessToken,
      userErrors: data.customerAccessTokenCreate.userErrors as any[],
    }
  }

  async logout(accessToken: string): Promise<void> {
    const query = `
      mutation Logout($accessToken: String!) {
        customerAccessTokenDelete(customerAccessToken: $accessToken) {
          deletedAccessToken
          userErrors {
            field
            message
          }
        }
      }
    `

    await this.request(query, { accessToken })
  }

  async getCustomer(accessToken: string): Promise<Customer | null> {
    const query = `
      query GetCustomer($accessToken: String!) {
        customer(customerAccessToken: $accessToken) {
          id
          email
          firstName
          lastName
          phone
          displayName
          createdAt
          updatedAt
          numberOfOrders
          acceptsMarketing
          tags
          addresses(first: 10) {
            edges {
              node {
                id
                firstName
                lastName
                phone
                company
                address1
                address2
                city
                province
                provinceCode
                zip
                country
                countryCode
                name
              }
            }
          }
          defaultAddress {
            id
            firstName
            lastName
            address1
            city
            province
            zip
            country
          }
          orders(first: 10) {
            edges {
              node {
                id
                name
                orderNumber
                statusPageUrl
                processedAt
                financialStatus
                fulfillmentStatus
                totalPrice {
                  amount
                  currencyCode
                }
                lineItems(first: 5) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      variant {
                        id
                        title
                        product {
                          id
                          featuredImage {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      }
    `

    const { data } = await this.request(query, { accessToken })
    return data.customer as Customer | null
  }

  async updateCustomer(
    accessToken: string,
    input: CustomerUpdateInput,
  ): Promise<{ customer?: Customer; userErrors: any[] }> {
    const query = `
      mutation UpdateCustomer($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
        customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
          customer {
            id
            email
            firstName
            lastName
            phone
            displayName
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, {
      customerAccessToken: accessToken,
      customer: input,
    })
    return {
      customer: data.customerUpdate.customer as Customer,
      userErrors: data.customerUpdate.userErrors as any[],
    }
  }

  async resetPassword(
    password: string,
    resetToken: string,
  ): Promise<{ customer?: Customer; userErrors: any[] }> {
    const query = `
      mutation ResetPassword($id: ID!, $input: CustomerResetInput!) {
        customerReset(id: $id, input: $input) {
          customer {
            id
            email
            displayName
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { id: '', input: { password, resetToken } })
    return {
      customer: data.customerReset.customer as Customer,
      userErrors: data.customerReset.userErrors as any[],
    }
  }

  async recoverCustomer(email: string): Promise<{ userErrors: any[] }> {
    const query = `
      mutation RecoverCustomer($email: String!) {
        customerRecover(email: $email) {
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { email })
    return {
      userErrors: data.customerRecover.userErrors as any[],
    }
  }

  async activateCustomer(
    id: string,
    input: { password: string; activationToken: string },
  ): Promise<{ customer?: Customer; userErrors: any[] }> {
    const query = `
      mutation ActivateCustomer($id: ID!, $input: CustomerActivateInput!) {
        customerActivate(id: $id, input: $input) {
          customer {
            id
            email
            displayName
          }
          customerAccessToken {
            accessToken
            expiresAt
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { id, input })
    return {
      customer: data.customerActivate.customer as Customer,
      userErrors: data.customerActivate.userErrors as any[],
    }
  }

  async createCustomerAddress(
    accessToken: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: any; userErrors: any[] }> {
    const query = `
      mutation CreateAddress($customerAccessToken: String!, $address: MailingAddressInput!) {
        customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
          customerAddress {
            id
            firstName
            lastName
            address1
            city
            province
            zip
            country
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { customerAccessToken: accessToken, address })
    return {
      customerAddress: data.customerAddressCreate.customerAddress,
      userErrors: data.customerAddressCreate.userErrors as any[],
    }
  }

  async updateCustomerAddress(
    accessToken: string,
    addressId: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: any; userErrors: any[] }> {
    const query = `
      mutation UpdateAddress($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
          customerAddress {
            id
            firstName
            lastName
            address1
            city
            province
            zip
            country
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, {
      customerAccessToken: accessToken,
      id: addressId,
      address,
    })
    return {
      customerAddress: data.customerAddressUpdate.customerAddress,
      userErrors: data.customerAddressUpdate.userErrors as any[],
    }
  }

  async deleteCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ deletedCustomerAddressId?: string; userErrors: any[] }> {
    const query = `
      mutation DeleteAddress($customerAccessToken: String!, $id: ID!) {
        customerAddressDelete(customerAccessToken: $customerAccessToken, id: $id) {
          deletedCustomerAddressId
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { customerAccessToken: accessToken, id: addressId })
    return {
      deletedCustomerAddressId: data.customerAddressDelete.deletedCustomerAddressId as string,
      userErrors: data.customerAddressDelete.userErrors as any[],
    }
  }

  async updateDefaultCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ customer?: Customer; userErrors: any[] }> {
    const query = `
      mutation UpdateDefaultAddress($customerAccessToken: String!, $addressId: ID!) {
        customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
          customer {
            id
            defaultAddress {
              id
              address1
              city
              province
              zip
              country
            }
          }
          userErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { customerAccessToken: accessToken, addressId })
    return {
      customer: data.customerDefaultAddressUpdate.customer as Customer,
      userErrors: data.customerDefaultAddressUpdate.userErrors as any[],
    }
  }

  // =========================================================================
  // 订单相关方法
  // =========================================================================

  /**
   * 获取用户订单列表
   * 
   * 通过 customerAccessToken 查询当前用户的订单列表。
   * 使用 GraphQL 精确查询所需字段，包括：
   * - 订单基本信息（ID、订单号、状态、金额等）
   * - 商品明细（最多10项）
   * - 收/账单地址
   * - 物流信息
   * - 履行信息
   * 
   * 注意：
   * 1. 订单按时间倒序排列（最新的在前）
   * 2. 需要有效的用户访问令牌
   * 3. 每个订单最多返回10个商品行，更多商品需要单独查询
   * 
   * @param accessToken - 用户访问令牌，用于身份验证
   * @param first - 返回的订单数量，默认10条
   * @returns 订单连接对象，包含订单列表和分页信息
   * @throws 如果访问令牌无效或权限不足，Shopify API 会返回错误
   */
  async getOrders(accessToken: string, first: number = 10): Promise<OrderConnection> {
    // GraphQL 查询：通过 customerAccessToken 获取用户订单
    const query = `
      query GetOrders($accessToken: String!, $first: Int) {
        customer(customerAccessToken: $accessToken) {
          orders(first: $first, reverse: true) {
            edges {
              node {
                id
                name
                orderNumber
                statusPageUrl
                processedAt
                canceledAt
                cancelReason
                currencyCode
                currentTotalPrice {
                  amount
                  currencyCode
                }
                currentSubtotalPrice {
                  amount
                  currencyCode
                }
                totalShippingPrice {
                  amount
                  currencyCode
                }
                totalTax {
                  amount
                  currencyCode
                }
                financialStatus
                fulfillmentStatus
                lineItems(first: 10) {
                  edges {
                    node {
                      id
                      title
                      quantity
                      originalTotalPrice {
                        amount
                        currencyCode
                      }
                      discountedTotalPrice {
                        amount
                        currencyCode
                      }
                      variant {
                        id
                        title
                        product {
                          id
                          featuredImage {
                            id
                            url
                            altText
                            width
                            height
                          }
                        }
                      }
                    }
                  }
                }
                shippingAddress {
                  firstName
                  lastName
                  address1
                  city
                  province
                  zip
                  country
                }
                billingAddress {
                  firstName
                  lastName
                  address1
                  city
                  province
                  zip
                  country
                }
                shippingLines(first: 5) {
                  edges {
                    node {
                      id
                      title
                      price {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
                fulfillments(first: 5) {
                  edges {
                    node {
                      id
                      status
                      trackingInfo {
                        company
                        number
                        url
                      }
                    }
                  }
                }
                createdAt
                updatedAt
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      }
    `

    const { data } = await this.request(query, { accessToken, first })
    return data.customer.orders as OrderConnection
  }

  /**
   * 获取单个订单详情
   * 
   * 通过订单 ID（gid://shopify/Order/xxx）查询订单详情。
   * 使用 GraphQL 的 node 查询方式，可以查询任何 Shopify 对象。
   * 
   * 与 getOrders 相比，此方法查询更详细的信息：
   * - 更多的商品明细（最多20项）
   * - 更详细的物流追踪信息（包括时间节点）
   * 
   * 注意：
   * 1. 订单 ID 必须是完整的 GID 格式
   * 2. 用户必须拥有该订单的访问权限
   * 3. 如果订单不存在或权限不足，返回 null
   * 
   * @param orderId - 订单的全局唯一标识符（GID）
   * @returns 订单详情对象，如果未找到或权限不足返回 null
   */
  async getOrder(orderId: string): Promise<Order | null> {
    // GraphQL 查询：使用 node 查询获取订单详情
    // ... on Order 是 GraphQL 的类型片段语法，用于指定具体类型
    const query = `
      query GetOrder($orderId: ID!) {
        node(id: $orderId) {
          ... on Order {
            id
            name
            orderNumber
            statusPageUrl
            processedAt
            currencyCode
            currentTotalPrice {
              amount
              currencyCode
            }
            financialStatus
            fulfillmentStatus
            lineItems(first: 20) {
              edges {
                node {
                  id
                  title
                  quantity
                  variant {
                    id
                    title
                    product {
                      id
                      featuredImage {
                        id
                        url
                        altText
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            fulfillments(first: 10) {
              edges {
                node {
                  id
                  status
                  trackingInfo {
                    company
                    number
                    url
                  }
                  estimatedDeliveryAt
                  inTransitAt
                  outForDeliveryAt
                  deliveredAt
                }
              }
            }
          }
        }
      }
    `

    const { data } = await this.request(query, { orderId })
    return data.node as Order | null
  }

  // =========================================================================
  // Checkout 相关方法
  // =========================================================================

  /**
   * 创建新的 Checkout（Shopify 实现）
   * 
   * 使用 checkoutCreate mutation 创建新的 Checkout 对象。
   * 包含完整的字段查询，确保返回所有必要的信息。
   * 
   * @param input - Checkout 创建参数
   * @returns 包含创建的 Checkout 和可能的错误信息
   */
  async createCheckout(input?: CheckoutCreateInput): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            email
            createdAt
            updatedAt
            completedAt
            currencyCode
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            paymentDue {
              amount
              currencyCode
            }
            paymentDueV2 {
              amount
              currencyCode
            }
            ready
            requiresShipping
            checkoutUrl
            webUrl
            order {
              id
              name
              orderNumber
            }
            orderStatusUrl
            buyerIdentity {
              email
              phone
              countryCode
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            billingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            shippingLine {
              handle
              title
              price {
                amount
                currencyCode
              }
            }
            availableShippingRates {
              ready
              rates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      id
                      title
                    }
                  }
                }
              }
            }
            discountApplications(first: 10) {
              edges {
                node {
                  targetType
                  targetSelection
                  allocationMethod
                  description
                  title
                  code
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const variables: any = {
      input: input || {},
    }

    const { data } = await this.request(query, variables)
    const result = data.checkoutCreate

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 获取 Checkout 详情（Shopify 实现）
   * 
   * 使用 node 查询获取 Checkout 的详细信息。
   * 
   * @param checkoutId - Checkout ID
   * @returns Checkout 对象，如果未找到返回 null
   */
  async getCheckout(checkoutId: string): Promise<Checkout | null> {
    const query = `
      query GetCheckout($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            id
            email
            createdAt
            updatedAt
            completedAt
            currencyCode
            subtotalPrice {
              amount
              currencyCode
            }
            totalTax {
              amount
              currencyCode
            }
            totalPrice {
              amount
              currencyCode
            }
            paymentDue {
              amount
              currencyCode
            }
            paymentDueV2 {
              amount
              currencyCode
            }
            ready
            requiresShipping
            checkoutUrl
            webUrl
            order {
              id
              name
              orderNumber
            }
            orderStatusUrl
            buyerIdentity {
              email
              phone
              countryCode
            }
            shippingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            billingAddress {
              firstName
              lastName
              address1
              address2
              city
              province
              zip
              country
              phone
            }
            shippingLine {
              handle
              title
              price {
                amount
                currencyCode
              }
            }
            availableShippingRates {
              ready
              rates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                  originalTotalPrice {
                    amount
                    currencyCode
                  }
                  discountedTotalPrice {
                    amount
                    currencyCode
                  }
                  variant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                    product {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId })
    return data.node as Checkout | null
  }

  /**
   * 更新 Checkout 信息（Shopify 实现）
   * 
   * 使用 checkoutAttributesUpdateV2 mutation 更新 Checkout 属性。
   * 
   * @param checkoutId - Checkout ID
   * @param input - 要更新的 Checkout 信息
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async updateCheckout(checkoutId: string, input: CheckoutUpdateInput): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutAttributesUpdateV2($checkoutId: ID!, $input: CheckoutAttributesUpdateV2Input!) {
        checkoutAttributesUpdateV2(checkoutId: $checkoutId, input: $input) {
          checkout {
            id
            email
            updatedAt
            webUrl
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, input })
    const result = data.checkoutAttributesUpdateV2

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 向 Checkout 添加商品（Shopify 实现）
   * 
   * 使用 checkoutLineItemsAdd mutation 向 Checkout 添加商品。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItems - 要添加的商品行数组
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async addCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemInput[]): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
        checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            updatedAt
            webUrl
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, lineItems })
    const result = data.checkoutLineItemsAdd

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 更新 Checkout 商品行（Shopify 实现）
   * 
   * 使用 checkoutLineItemsUpdate mutation 更新 Checkout 商品行。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItems - 要更新的商品行数组
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async updateCheckoutLines(checkoutId: string, lineItems: CheckoutLineItemUpdateInput[]): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutLineItemsUpdate($checkoutId: ID!, $lineItems: [CheckoutLineItemUpdateInput!]!) {
        checkoutLineItemsUpdate(checkoutId: $checkoutId, lineItems: $lineItems) {
          checkout {
            id
            updatedAt
            webUrl
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, lineItems })
    const result = data.checkoutLineItemsUpdate

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 移除 Checkout 商品行（Shopify 实现）
   * 
   * 使用 checkoutLineItemsRemove mutation 移除 Checkout 商品行。
   * 
   * @param checkoutId - Checkout ID
   * @param lineItemIds - 要移除的商品行 ID 数组
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async removeCheckoutLines(checkoutId: string, lineItemIds: string[]): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
        checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
          checkout {
            id
            updatedAt
            webUrl
            lineItems(first: 50) {
              edges {
                node {
                  id
                  title
                  quantity
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, lineItemIds })
    const result = data.checkoutLineItemsRemove

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 更新 Checkout 买家身份（Shopify 实现）
   * 
   * 使用 checkoutBuyerIdentityUpdate mutation 更新买家身份。
   * 
   * @param checkoutId - Checkout ID
   * @param buyerIdentity - 买家身份信息
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async updateCheckoutBuyerIdentity(
    checkoutId: string,
    buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
  ): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutBuyerIdentityUpdate($checkoutId: ID!, $buyerIdentity: CheckoutBuyerIdentityInput!) {
        checkoutBuyerIdentityUpdate(checkoutId: $checkoutId, buyerIdentity: $buyerIdentity) {
          checkout {
            id
            email
            updatedAt
            webUrl
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, buyerIdentity })
    const result = data.checkoutBuyerIdentityUpdate

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 更新 Checkout 配送地址（Shopify 实现）
   * 
   * 使用 checkoutShippingAddressUpdateV2 mutation 更新配送地址。
   * 
   * @param checkoutId - Checkout ID
   * @param shippingAddress - 配送地址信息
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async updateCheckoutShippingAddress(
    checkoutId: string,
    shippingAddress: MailingAddressInput,
  ): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutShippingAddressUpdateV2($checkoutId: ID!, $shippingAddress: MailingAddressInput!) {
        checkoutShippingAddressUpdateV2(checkoutId: $checkoutId, shippingAddress: $shippingAddress) {
          checkout {
            id
            updatedAt
            webUrl
            shippingAddress {
              firstName
              lastName
              address1
              city
              province
              zip
              country
            }
            availableShippingRates {
              ready
              rates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, shippingAddress })
    const result = data.checkoutShippingAddressUpdateV2

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 获取 Checkout 可用配送方式（Shopify 实现）
   * 
   * 通过查询 Checkout 的 availableShippingRates 字段获取可用配送方式。
   * 
   * @param checkoutId - Checkout ID
   * @returns 可用配送方式数组
   */
  async getAvailableShippingRates(checkoutId: string): Promise<ShippingRate[]> {
    const query = `
      query GetShippingRates($checkoutId: ID!) {
        node(id: $checkoutId) {
          ... on Checkout {
            availableShippingRates {
              ready
              rates {
                handle
                title
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId })
    const checkout = data.node as Checkout | null

    if (!checkout?.availableShippingRates?.ready) {
      return []
    }

    return checkout.availableShippingRates.rates
  }

  /**
   * 选择 Checkout 配送方式（Shopify 实现）
   * 
   * 使用 checkoutShippingLineUpdate mutation 选择配送方式。
   * 
   * @param checkoutId - Checkout ID
   * @param shippingRateHandle - 配送方式的 handle
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async updateCheckoutShippingLine(checkoutId: string, shippingRateHandle: string): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutShippingLineUpdate($checkoutId: ID!, $shippingRateHandle: String!) {
        checkoutShippingLineUpdate(checkoutId: $checkoutId, shippingRateHandle: $shippingRateHandle) {
          checkout {
            id
            updatedAt
            webUrl
            shippingLine {
              handle
              title
              price {
                amount
                currencyCode
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, shippingRateHandle })
    const result = data.checkoutShippingLineUpdate

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 应用折扣码到 Checkout（Shopify 实现）
   * 
   * 使用 checkoutDiscountCodeApplyV2 mutation 应用折扣码。
   * 
   * @param checkoutId - Checkout ID
   * @param discountCode - 折扣码
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async applyDiscountCode(checkoutId: string, discountCode: string): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutDiscountCodeApplyV2($checkoutId: ID!, $discountCode: String!) {
        checkoutDiscountCodeApplyV2(checkoutId: $checkoutId, discountCode: $discountCode) {
          checkout {
            id
            updatedAt
            webUrl
            discountApplications(first: 10) {
              edges {
                node {
                  title
                  code
                }
              }
            }
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId, discountCode })
    const result = data.checkoutDiscountCodeApplyV2

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 移除 Checkout 折扣码（Shopify 实现）
   * 
   * 使用 checkoutDiscountCodeRemove mutation 移除折扣码。
   * 
   * @param checkoutId - Checkout ID
   * @returns 包含更新后的 Checkout 和可能的错误信息
   */
  async removeDiscountCode(checkoutId: string): Promise<CheckoutResult> {
    const query = `
      mutation CheckoutDiscountCodeRemove($checkoutId: ID!) {
        checkoutDiscountCodeRemove(checkoutId: $checkoutId) {
          checkout {
            id
            updatedAt
            webUrl
            totalPrice {
              amount
              currencyCode
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId })
    const result = data.checkoutDiscountCodeRemove

    return {
      checkout: result.checkout,
      checkoutUserErrors: result.checkoutUserErrors || [],
    }
  }

  /**
   * 完成 Checkout（Shopify 实现）
   * 
   * 注意：在 Shopify 无头模式下，通常不需要手动调用此方法，
   * 而是通过跳转到 checkoutUrl 让用户在 Shopify 官方页面完成支付。
   * 支付完成后 Shopify 会自动创建订单。
   * 
   * 此方法作为备选方案，用于特殊场景下的 Checkout 完成。
   * 
   * @param checkoutId - Checkout ID
   * @returns 包含创建的订单和可能的错误信息
   */
  async completeCheckout(checkoutId: string): Promise<{ order?: Order; userErrors: CheckoutUserError[] }> {
    const query = `
      mutation CheckoutCompleteFree($checkoutId: ID!) {
        checkoutCompleteFree(checkoutId: $checkoutId) {
          checkout {
            id
            order {
              id
              name
              orderNumber
              statusPageUrl
              processedAt
              currencyCode
              currentTotalPrice {
                amount
                currencyCode
              }
            }
          }
          checkoutUserErrors {
            field
            message
            code
          }
        }
      }
    `

    const { data } = await this.request(query, { checkoutId })
    const result = data.checkoutCompleteFree

    return {
      order: result.checkout?.order,
      userErrors: result.checkoutUserErrors || [],
    }
  }

  // =========================================================================
  // 物流追踪相关方法（待实现）
  // =========================================================================

  /**
   * 根据订单ID获取物流追踪信息（Shopify 实现）
   * 
   * @param orderId - 订单ID
   * @param accessToken - 用户访问令牌
   * @returns 物流追踪信息连接
   */
  async getTrackingByOrder(orderId: string, accessToken?: string): Promise<TrackingInfoConnection> {
    // TODO: 实现 Shopify Fulfillment API 调用
    void orderId
    void accessToken
    console.warn('getTrackingByOrder not implemented in ShopifyAdapter')
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  /**
   * 根据追踪号获取物流追踪信息（Shopify 实现）
   * 
   * @param trackingNumber - 物流追踪号
   * @returns 物流追踪结果
   */
  async getTrackingByNumber(trackingNumber: string): Promise<TrackingResult> {
    // TODO: 实现 Shopify Fulfillment API 调用
    void trackingNumber
    console.warn('getTrackingByNumber not implemented in ShopifyAdapter')
    return {
      tracking: undefined,
      userErrors: [
        {
          field: ['trackingNumber'],
          message: 'Tracking not implemented for Shopify adapter yet',
          code: TrackingErrorCode.TRACKING_UNAVAILABLE,
        },
      ],
    }
  }

  /**
   * 根据配送ID获取物流追踪信息（Shopify 实现）
   * 
   * @param fulfillmentId - 配送ID
   * @returns 物流追踪结果
   */
  async getTrackingByFulfillment(fulfillmentId: string): Promise<TrackingResult> {
    // TODO: 实现 Shopify Fulfillment API 调用
    void fulfillmentId
    console.warn('getTrackingByFulfillment not implemented in ShopifyAdapter')
    return {
      tracking: undefined,
      userErrors: [],
    }
  }

  /**
   * 获取物流追踪信息列表（Shopify 实现）
   * 
   * @param filter - 过滤条件
   * @param accessToken - 用户访问令牌
   * @returns 物流追踪信息连接
   */
  async getTrackings(filter?: TrackingFilter, accessToken?: string): Promise<TrackingInfoConnection> {
    // TODO: 实现 Shopify Fulfillment API 调用
    void filter
    void accessToken
    console.warn('getTrackings not implemented in ShopifyAdapter')
    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }

  /**
   * 根据订单ID获取配送信息（Shopify 实现）
   * 
   * @param orderId - 订单ID
   * @param accessToken - 用户访问令牌
   * @returns 配送信息数组
   */
  async getFulfillmentsByOrder(orderId: string, accessToken?: string): Promise<Fulfillment[]> {
    // TODO: 实现 Shopify Fulfillment API 调用
    void orderId
    void accessToken
    console.warn('getFulfillmentsByOrder not implemented in ShopifyAdapter')
    return []
  }

  /**
   * 获取物流公司信息（Shopify 实现）
   * 
   * @param carrierCode - 物流公司代码
   * @returns 物流公司信息
   */
  async getCarrierInfo(carrierCode: string): Promise<CarrierInfo | null> {
    // TODO: 实现物流公司信息查询
    void carrierCode
    console.warn('getCarrierInfo not implemented in ShopifyAdapter')
    return null
  }

  /**
   * 获取支持的物流公司列表（Shopify 实现）
   * 
   * @returns 物流公司信息数组
   */
  async getSupportedCarriers(): Promise<CarrierInfo[]> {
    // TODO: 实现支持的物流公司列表查询
    console.warn('getSupportedCarriers not implemented in ShopifyAdapter')
    return []
  }

  /**
   * 订阅物流追踪更新（Shopify 实现）
   * 
   * @param trackingId - 物流追踪ID
   * @param webhookUrl - Webhook URL
   * @param email - 通知邮箱
   * @returns 订阅结果
   */
  async subscribeTrackingUpdates(
    trackingId: string,
    webhookUrl?: string,
    email?: string,
  ): Promise<{ success: boolean; userErrors: TrackingUserError[] }> {
    // TODO: 实现物流追踪更新订阅
    void trackingId
    void webhookUrl
    void email
    console.warn('subscribeTrackingUpdates not implemented in ShopifyAdapter')
    return {
      success: false,
      userErrors: [
        {
          field: ['trackingId'],
          message: 'Subscription not implemented for Shopify adapter yet',
          code: TrackingErrorCode.TRACKING_UNAVAILABLE,
        },
      ],
    }
  }

  /**
   * 取消订阅物流追踪更新（Shopify 实现）
   * 
   * @param trackingId - 物流追踪ID
   * @returns 取消订阅结果
   */
  async unsubscribeTrackingUpdates(
    trackingId: string,
  ): Promise<{ success: boolean; userErrors: TrackingUserError[] }> {
    // TODO: 实现取消物流追踪更新订阅
    void trackingId
    console.warn('unsubscribeTrackingUpdates not implemented in ShopifyAdapter')
    return {
      success: false,
      userErrors: [],
    }
  }

  /**
   * 刷新物流追踪信息（Shopify 实现）
   * 
   * @param trackingId - 物流追踪ID
   * @returns 刷新后的物流追踪结果
   */
  async refreshTracking(trackingId: string): Promise<TrackingResult> {
    // TODO: 实现刷新物流追踪信息
    void trackingId
    console.warn('refreshTracking not implemented in ShopifyAdapter')
    return {
      tracking: undefined,
      userErrors: [],
    }
  }
}

/**
 * 创建 Shopify 适配器实例的工厂函数
 * 
 * 使用工厂模式创建适配器，便于将来扩展（如添加缓存、中间件等）。
 * 
 * @param config - 可选的适配器配置
 * @returns 实现了 IEcommerceAdapter 接口的 Shopify 适配器实例
 */
export function createShopifyAdapter(config?: Partial<AdapterConfig>): IEcommerceAdapter {
  return new ShopifyAdapter(config)
}
