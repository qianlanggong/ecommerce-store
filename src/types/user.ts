import type { OrderConnection } from './order'

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

export interface MailingAddress {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  company?: string
  address1: string
  address2?: string
  city: string
  province?: string
  provinceCode?: string
  zip: string
  country: string
  countryCode: string
  name: string
}

export interface MailingAddressConnection {
  edges: Array<{ node: MailingAddress }>
}

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface CustomerUserError {
  field: string[]
  message: string
  code: CustomerErrorCode
}

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
