import type { OrderConnection } from './order'

/**
 * 客户接口
 *
 * 定义用户的完整信息，包含基本资料、地址、
 * 订单历史等。
 *
 * @interface Customer
 */
export interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  displayName: string
  createdAt: string
  updatedAt: string
  addresses: MailingAddressConnection
  defaultAddress?: MailingAddress
  orders: OrderConnection
  numberOfOrders: number
  acceptsMarketing: boolean
  tags: string[]
}

/**
 * 邮寄地址接口
 *
 * 定义收货地址/账单地址的完整结构。
 * 支持多级行政区划，适配不同国家的地址格式。
 *
 * @interface MailingAddress
 */
export interface MailingAddress {
  id?: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  provinceCode?: string
  zip?: string
  country?: string
  countryCode?: string
  name?: string
}

export interface MailingAddressConnection {
  edges: Array<{ node: MailingAddress }>
}

/**
 * 客户访问令牌接口
 *
 * 登录成功后返回的访问令牌及其过期时间。
 * 用于后续需要认证的 API 调用。
 *
 * @interface CustomerAccessToken
 */
export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

/**
 * 客户操作错误接口
 *
 * 用户操作（注册、登录等）失败时返回的错误信息。
 * field 字段指示错误发生的具体字段路径。
 *
 * @interface CustomerUserError
 */
export interface CustomerUserError {
  field: string[]
  message: string
  code: CustomerErrorCode
}

/**
 * 客户错误代码枚举
 *
 * 定义所有可能的用户操作错误类型，
 * 用于前端进行错误提示和处理。
 *
 * @enum CustomerErrorCode
 */
export enum CustomerErrorCode {
  BLANK = 'BLANK',
  INVALID = 'INVALID',
  INVALID_EMAIL = 'INVALID_EMAIL',
  TAKEN = 'TAKEN',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  NOT_FOUND = 'NOT_FOUND',
  PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE = 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE',
  PASSWORD_TOO_COMMON = 'PASSWORD_TOO_COMMON',
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',
  CONFIRMED_PASSWORD_DOES_NOT_MATCH = 'CONFIRMED_PASSWORD_DOES_NOT_MATCH',
  UNIDENTIFIED_CUSTOMER = 'UNIDENTIFIED_CUSTOMER',
  ALREADY_ENABLED = 'ALREADY_ENABLED',
  SEND_NOTIFICATION_FAILURE = 'SEND_NOTIFICATION_FAILURE',
  INVALID_PHONE_NUMBER = 'INVALID_PHONE_NUMBER',
}

export interface CustomerCreateInput {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  acceptsMarketing?: boolean
  tags?: string[]
}

export interface CustomerUpdateInput {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  newPassword?: string
  acceptsMarketing?: boolean
}

export interface MailingAddressInput {
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  address1?: string
  address2?: string
  city?: string
  province?: string
  provinceCode?: string
  zip?: string
  country?: string
  countryCode?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ResetPasswordInput {
  password: string
  resetToken: string
}

export interface AuthState {
  customer: Customer | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
