/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import type { IEcommerceAdapter, AdapterConfig } from '../interface'
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
} from '@/types'

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || ''
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-07'

// 类型别名用于 Shopify API 边界层
type ShopifyApiResponse = { data: any; errors?: unknown[] }
type ShopifyClientRequest = (
  query: string,
  variables?: Record<string, unknown>,
) => Promise<ShopifyApiResponse>

export class ShopifyAdapter implements IEcommerceAdapter {
  private client: ReturnType<typeof createStorefrontApiClient>

  constructor(config?: Partial<AdapterConfig>) {
    this.client = createStorefrontApiClient({
      storeDomain: config?.storeDomain || SHOPIFY_DOMAIN,
      apiVersion: config?.apiVersion || SHOPIFY_API_VERSION,
      publicAccessToken: config?.storefrontApiToken || SHOPIFY_API_TOKEN,
    })
  }

  private async request(
    query: string,
    variables?: Record<string, unknown>,
  ): Promise<ShopifyApiResponse> {
    const result = await (this.client.request as unknown as ShopifyClientRequest)(query, variables)

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

  async getOrders(accessToken: string, first: number = 10): Promise<OrderConnection> {
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

  async getOrder(orderId: string): Promise<any | null> {
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
    return data.node as any | null
  }
}

export function createShopifyAdapter(config?: Partial<AdapterConfig>): IEcommerceAdapter {
  return new ShopifyAdapter(config)
}
