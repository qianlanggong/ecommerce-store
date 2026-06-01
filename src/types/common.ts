import type { Money, PageInfo, Image } from './product'

export type { Money, PageInfo, Image }

export interface PaginationArgs {
  first?: number
  last?: number
  after?: string
  before?: string
}

export interface ListResponse<T> {
  data: T[]
  pageInfo: PageInfo
  totalCount?: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

export interface ApiResponse<T> {
  data?: T
  errors?: ApiError[]
  success: boolean
}

export interface SortOption<T = string> {
  value: T
  label: string
}

export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

export interface ToastOptions {
  title?: string
  description: string
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T, E = string> {
  data: T | null
  status: AsyncStatus
  error: E | null
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export function createAsyncState<T>(): AsyncState<T> {
  return {
    data: null,
    status: 'idle',
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  }
}

export interface CurrencyFormatterOptions {
  locale?: string
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
}

export function formatMoney(
  amount: string | number,
  currencyCode: string,
  locale: string = 'en-US',
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount)
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export interface ResponseErrors {
  message: string
  code?: string
  field?: string[]
}

export interface PaginationParams {
  first?: number
  last?: number
  after?: string
  before?: string
}

export interface UserError {
  field: string[]
  message: string
  code?: string
}
