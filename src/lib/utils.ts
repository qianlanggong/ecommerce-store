// =========================================================================
// 通用工具函数库
// 包含：样式合并、格式化、商品价格计算、表单验证、性能优化、本地存储、URL操作等
// =========================================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Money, ProductVariant, Product } from '@/types'

// =========================================================================
// 样式工具函数
// =========================================================================

/**
 * 合并 Tailwind CSS 类名
 * 
 * 结合 clsx 和 tailwind-merge 的功能：
 * - clsx: 支持条件类名、数组、对象等多种形式
 * - tailwind-merge: 智能合并冲突的 Tailwind 类名
 * 
 * 示例：
 * ```tsx
 * cn('flex', isActive && 'bg-primary', 'p-4')
 * ```
 * 
 * @param inputs - 类名列表，支持字符串、数组、对象、布尔值等
 * @returns 合并后的类名字符串
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// =========================================================================
// 格式化工具函数
// =========================================================================

/**
 * 格式化货币金额
 * 
 * 使用 Intl.NumberFormat 进行本地化货币格式化。
 * 处理边界情况：如果金额无效（NaN），返回 0 的格式化结果。
 * 
 * @param amount - 金额，支持字符串或数字
 * @param currencyCode - 货币代码，如 'USD'、'CNY'
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的货币字符串，如 "$19.99"
 */
export function formatMoney(
  amount: string | number,
  currencyCode: string,
  locale: string = 'en-US',
): string {
  // 边界条件：验证金额是否为有效数字
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numericAmount)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
    }).format(0)
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).format(numericAmount)
}

/** formatMoney 的别名 */
export const formatCurrency = formatMoney

/**
 * 格式化日期
 * 
 * 使用 Intl.DateTimeFormat 进行本地化日期格式化。
 * 
 * @param date - 日期字符串或 Date 对象
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的日期字符串，如 "June 1, 2024"
 */
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * 格式化日期时间
 * 
 * 与 formatDate 类似，但包含时分。
 * 
 * @param date - 日期字符串或 Date 对象
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的日期时间字符串，如 "June 1, 2024, 02:30 PM"
 */
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

// =========================================================================
// 价格计算工具函数
// =========================================================================

/**
 * 解析 Money 对象为数字
 * 
 * @param money - Money 对象，包含 amount 和 currencyCode
 * @returns 金额的数字形式
 */
export function parseMoney(money: Money): number {
  return parseFloat(money.amount)
}

/**
 * 获取商品价格范围
 * 
 * 从商品的 priceRange 中提取最低和最高价格。
 * 
 * @param product - 商品对象
 * @returns 包含 min、max 和 currency 的对象
 */
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

/**
 * 获取商品显示价格
 * 
 * 如果所有变体价格相同，显示单个价格；否则显示价格范围。
 * 
 * @param product - 商品对象
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的价格字符串，如 "$19.99" 或 "$19.99 - $49.99"
 */
export function getProductDisplayPrice(product: Product, locale: string = 'en-US'): string {
  const { min, max, currency } = getProductPriceRange(product)
  if (min === max) {
    return formatMoney(min, currency, locale)
  }
  return `${formatMoney(min, currency, locale)} - ${formatMoney(max, currency, locale)}`
}

/**
 * 获取商品变体价格
 * 
 * @param variant - 商品变体对象
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的价格字符串
 */
export function getVariantPrice(variant: ProductVariant, locale: string = 'en-US'): string {
  return formatMoney(variant.price.amount, variant.price.currencyCode, locale)
}

/**
 * 获取商品变体原价（划线价）
 * 
 * 用于显示促销价格。如果没有原价，返回 null。
 * 
 * @param variant - 商品变体对象
 * @param locale - 本地化代码，默认 'en-US'
 * @returns 格式化后的原价字符串，如果没有原价返回 null
 */
export function getVariantCompareAtPrice(
  variant: ProductVariant,
  locale: string = 'en-US',
): string | null {
  if (!variant.compareAtPrice) return null
  return formatMoney(variant.compareAtPrice.amount, variant.compareAtPrice.currencyCode, locale)
}

/**
 * 计算折扣百分比
 * 
 * 折扣 = (原价 - 现价) / 原价 * 100
 * 四舍五入到整数。
 * 
 * @param variant - 商品变体对象
 * @returns 折扣百分比，如果没有折扣返回 null
 */
export function getDiscountPercent(variant: ProductVariant): number | null {
  if (!variant.compareAtPrice) return null
  const price = parseMoney(variant.price)
  const compareAtPrice = parseMoney(variant.compareAtPrice)
  if (compareAtPrice <= price) return null
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
}

/**
 * 判断商品是否正在促销
 * 
 * 检查是否有原价且原价高于现价。
 * 
 * @param variant - 商品变体对象
 * @returns true 表示正在促销
 */
export function isOnSale(variant: ProductVariant): boolean {
  if (!variant.compareAtPrice) return false
  return parseMoney(variant.compareAtPrice) > parseMoney(variant.price)
}

/**
 * 获取库存状态
 * 
 * 根据库存数量返回状态文本和样式变体：
 * - 不可用：outOfStock, danger
 * - 库存紧张（1-5件）：lowStock, warning
 * - 正常：inStock, success
 * 
 * @param available - 是否可售
 * @param quantity - 库存数量
 * @param t - 翻译函数
 * @returns 包含 status 和 variant 的对象
 */
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

// =========================================================================
// 文本处理工具函数
// =========================================================================

/**
 * 截断文本
 * 
 * 如果文本长度超过 maxLength，截断并添加省略号。
 * 
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * 去除 HTML 标签
 * 
 * 使用正则表达式移除所有 HTML 标签。
 * 注意：对于复杂的 HTML，建议使用 DOMParser 替代。
 * 
 * @param html - 包含 HTML 的字符串
 * @returns 纯文本内容
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '')
}

/**
 * 生成随机 ID
 * 
 * 使用 Math.random() 生成 7 位随机字符串。
 * 注意：不适用于安全场景。
 * 
 * @returns 随机 ID 字符串
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// =========================================================================
// 表单验证工具函数
// =========================================================================

/**
 * 验证邮箱格式
 * 
 * 使用正则表达式验证邮箱格式。
 * 
 * @param email - 邮箱地址
 * @returns true 表示格式正确
 */
export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * 验证密码强度
 * 
 * 简单验证：密码长度至少 8 位。
 * 注意：实际项目中可能需要更复杂的密码策略。
 * 
 * @param password - 密码
 * @returns true 表示密码有效
 */
export function validatePassword(password: string): boolean {
  return password.length >= 8
}

// =========================================================================
// 性能优化工具函数
// =========================================================================

/**
 * 防抖函数
 * 
 * 在最后一次调用后等待 wait 毫秒才执行函数。
 * 适用于搜索输入、窗口 resize 等场景。
 * 
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @returns 防抖后的函数
 */
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

/**
 * 节流函数
 * 
 * 在 limit 毫秒内最多执行一次函数。
 * 适用于滚动、鼠标移动等高频事件。
 * 
 * @param func - 要节流的函数
 * @param limit - 时间间隔（毫秒）
 * @returns 节流后的函数
 */
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

// =========================================================================
// 本地存储工具函数
// =========================================================================

/**
 * 从 localStorage 获取项目
 * 
 * 自动处理 JSON 解析，解析失败返回默认值。
 * 
 * @param key - 存储键名
 * @param defaultValue - 默认值
 * @returns 解析后的值或默认值
 */
export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 保存项目到 localStorage
 * 
 * 自动进行 JSON 序列化，保存失败记录错误日志。
 * 
 * @param key - 存储键名
 * @param value - 要存储的值
 */
export function setLocalStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * 从 localStorage 移除项目
 * 
 * @param key - 存储键名
 */
export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key)
}

// =========================================================================
// URL 操作工具函数
// =========================================================================

/**
 * 获取 URL 查询参数
 * 
 * @param param - 参数名
 * @returns 参数值，如果不存在返回 null
 */
export function getUrlParam(param: string): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get(param)
}

/**
 * 设置 URL 查询参数
 * 
 * 使用 history.replaceState，不会产生新的历史记录。
 * 
 * @param param - 参数名
 * @param value - 参数值
 */
export function setUrlParam(param: string, value: string): void {
  const params = new URLSearchParams(window.location.search)
  params.set(param, value)
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
}

/**
 * 移除 URL 查询参数
 * 
 * 使用 history.replaceState，不会产生新的历史记录。
 * 如果移除后没有查询参数，URL 不会包含问号。
 * 
 * @param param - 参数名
 */
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

// =========================================================================
// 其他工具函数
// =========================================================================

/**
 * 合并类名（简化版）
 * 
 * 类似于 cn，但不处理 Tailwind 冲突。
 * 适用于简单的条件类名合并。
 * 
 * @param classes - 类名列表，支持布尔值
 * @returns 合并后的类名字符串
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 名词单复数转换
 * 
 * @param count - 数量
 * @param singular - 单数形式
 * @param plural - 复数形式（可选，默认在单数后加 s）
 * @returns 正确的单复数形式
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return singular
  return plural || `${singular}s`
}

/**
 * 复制文本到剪贴板
 * 
 * 使用 navigator.clipboard API，不支持时返回 false。
 * 
 * @param text - 要复制的文本
 * @returns Promise<true> 表示复制成功，Promise<false> 表示失败
 */
export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}

/**
 * 下载文件
 * 
 * 动态创建 <a> 标签触发下载。
 * 
 * @param content - 文件内容
 * @param filename - 文件名
 * @param mime - MIME 类型，默认 'text/plain'
 */
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

/**
 * 获取姓名首字母
 * 
 * 将姓名按空格分割，取每个词的首字母，最多返回 2 个字母。
 * 
 * @param name - 姓名，如 "John Doe"
 * @returns 首字母，如 "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// =========================================================================
// 响应式判断工具函数
// =========================================================================

/**
 * 判断是否为移动端
 * 
 * 断点：< 768px
 * 
 * @returns true 表示当前为移动端
 */
export function isMobile(): boolean {
  return window.innerWidth < 768
}

/**
 * 判断是否为平板设备
 * 
 * 断点：768px - 1023px
 * 
 * @returns true 表示当前为平板设备
 */
export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

/**
 * 判断是否为桌面端
 * 
 * 断点：>= 1024px
 * 
 * @returns true 表示当前为桌面端
 */
export function isDesktop(): boolean {
  return window.innerWidth >= 1024
}

// =========================================================================
// 滚动操作工具函数
// =========================================================================

/**
 * 滚动到页面顶部
 * 
 * @param behavior - 滚动行为，默认 'smooth'（平滑滚动）
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ top: 0, behavior })
}

/**
 * 滚动到指定元素
 * 
 * @param elementId - 目标元素的 ID
 * @param behavior - 滚动行为，默认 'smooth'
 */
export function scrollToElement(elementId: string, behavior: ScrollBehavior = 'smooth'): void {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior })
  }
}

// =========================================================================
// 异步工具函数
// =========================================================================

/**
 * 延迟执行
 * 
 * 返回一个在指定毫秒后 resolve 的 Promise。
 * 常用于模拟网络延迟、动画等待等场景。
 * 
 * @param ms - 延迟时间（毫秒）
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 重试异步操作
 * 
 * 如果操作失败，会自动重试指定次数。
 * 每次重试的延迟会指数退避（delayMs * 2）。
 * 
 * @param fn - 要执行的异步函数
 * @param retries - 重试次数，默认 3 次
 * @param delayMs - 初始延迟时间，默认 1000ms
 * @returns Promise，成功 resolve 结果，失败 reject 错误
 */
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
