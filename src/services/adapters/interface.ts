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
  UserError,
} from '@/types'

export interface IEcommerceAdapter {
  getProducts(filter?: ProductFilter): Promise<ProductConnection>
  getProduct(handle: string): Promise<Product | null>
  getProductRecommendations(productId: string): Promise<Product[]>
  getCollections(): Promise<CollectionConnection>
  getCollection(handle: string): Promise<Collection | null>

  createCart(input?: CartInput): Promise<Cart>
  getCart(cartId: string): Promise<Cart | null>
  addCartLines(cartId: string, lines: CartLineInput[]): Promise<Cart>
  updateCartLines(cartId: string, lines: CartLineUpdateInput[]): Promise<Cart>
  removeCartLines(cartId: string, lineIds: string[]): Promise<Cart>
  updateCartBuyerIdentity(
    cartId: string,
    buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string },
  ): Promise<Cart>
  updateCartDiscountCodes(cartId: string, discountCodes: string[]): Promise<Cart>

  createCustomer(
    input: CustomerCreateInput,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>
  login(
    email: string,
    password: string,
  ): Promise<{ customerAccessToken?: CustomerAccessToken; userErrors: UserError[] }>
  logout(accessToken: string): Promise<void>
  getCustomer(accessToken: string): Promise<Customer | null>
  updateCustomer(
    accessToken: string,
    input: CustomerUpdateInput,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>
  resetPassword(
    password: string,
    resetToken: string,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>
  recoverCustomer(email: string): Promise<{ userErrors: UserError[] }>
  activateCustomer(
    id: string,
    input: { password: string; activationToken: string },
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  createCustomerAddress(
    accessToken: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>
  updateCustomerAddress(
    accessToken: string,
    addressId: string,
    address: MailingAddressInput,
  ): Promise<{ customerAddress?: MailingAddress; userErrors: UserError[] }>
  deleteCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ deletedCustomerAddressId?: string; userErrors: UserError[] }>
  updateDefaultCustomerAddress(
    accessToken: string,
    addressId: string,
  ): Promise<{ customer?: Customer; userErrors: UserError[] }>

  getOrders(accessToken: string, first?: number): Promise<OrderConnection>
  getOrder(orderId: string): Promise<unknown | null>
}

export type AdapterType = 'shopify' | 'custom' | 'mock'

export interface AdapterConfig {
  type: AdapterType
  storeDomain?: string
  storefrontApiToken?: string
  apiVersion?: string
}
