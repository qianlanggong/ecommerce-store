import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Money, ProductVariant, Product } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function parseMoney(money: Money): number {
  return parseFloat(money.amount)
}

export function getProductPriceRange(product: Product): {
  min: number
  max: number
  currency: string
} {
  const min = parseMoney(product.priceRange.minVariantPrice)
  const max = parseMoney(product.priceRange.maxVariantPrice)
  return {
    min,
    max,
    currency: product.priceRange.minVariantPrice.currencyCode,
  }
}

export function getProductDisplayPrice(product: Product, locale: string = 'en-US'): string {
  const { min, max, currency } = getProductPriceRange(product)
  if (min === max) {
    return formatMoney(min, currency, locale)
  }
  return `${formatMoney(min, currency, locale)} - ${formatMoney(max, currency, locale)}`
}

export function getVariantPrice(variant: ProductVariant, locale: string = 'en-US'): string {
  return formatMoney(variant.price.amount, variant.price.currencyCode, locale)
}

export function getVariantCompareAtPrice(
  variant: ProductVariant,
  locale: string = 'en-US',
): string | null {
  if (!variant.compareAtPrice) return null
  return formatMoney(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode, locale)
}

export function getDiscountPercent(variant: ProductVariant): number | null {
  if (!variant.compareAtPrice) return null
  const price = parseMoney(variant.price)
  const compareAtPrice = parseMoney(variant.compareAtPrice)
  if (compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

export function isOnSale(variant: ProductVariant): boolean {
  if (!variant.compareAtPrice) return false
  return parseMoney(variant.compareAtPrice) > parseMoney(variant.price)
}

export function getStockStatus(
  available: boolean,
  quantity: number,
  t: (key: string) => string,
): { status: string; variant: 'success' | 'warning' | 'danger' } {
  if (!available) {
    return { status: t('product.outOfStock'), variant: 'danger' }
  }
  if (quantity > 0 && quantity <= 5) {
    return { status: t('product.lowStock'), variant: 'warning' }
  }
  return { status: t('product.inStock'), variant: 'success' }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 8
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key)
}

export function getUrlParam(param: string): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get(param)
}

export function setUrlParam(param: string, value: string): void {
  const params = new URLSearchParams(window.location.search)
  params.set(param, value)
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}

export function removeUrlParam(param: string): void {
  const params = new URLSearchParams(window.location.search)
  params.delete(param)
  const search = params.toString()
  window.history.replaceState(
    {},
    '',
    search ? `${window.location.pathname}?${search}` : window.location.pathname,
  )
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}

export function downloadFile(content: string, filename: string, mime: string = 'text/plain'): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function isMobile(): boolean {
  return window.innerWidth < 768
}

export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}

export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ top: 0, behavior })
}

export function scrollToElement(elementId: string, behavior: ScrollBehavior = 'smooth'): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 1000,
): Promise<T> {
  return fn().catch(async (error) => {
    if (retries <= 0) throw error
    await delay(delayMs)
    return retry(fn, retries - 1, delayMs * 2)
  })
}
