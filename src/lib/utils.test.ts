import { describe, it, expect } from 'vitest'
import { cn, formatMoney, formatDate, validateEmail, validatePassword, truncateText, classNames } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('合并多个类名字符串', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('过滤 undefined 和 null 值', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
    })

    it('处理条件类名', () => {
      const isActive = true
      expect(cn('base', isActive && 'active')).toBe('base active')
      expect(cn('base', !isActive && 'inactive')).toBe('base')
    })

    it('处理空输入', () => {
      expect(cn()).toBe('')
      expect(cn('', undefined, null)).toBe('')
    })
  })

  describe('formatMoney', () => {
    it('格式化价格为美元格式', () => {
      expect(formatMoney('29.99', 'USD')).toBe('$29.99')
      expect(formatMoney('100', 'USD')).toBe('$100.00')
    })

    it('处理不同货币代码', () => {
      expect(formatMoney('29.99', 'EUR')).toContain('€')
      expect(formatMoney('29.99', 'CNY')).toContain('¥')
    })

    it('支持数字类型输入', () => {
      expect(formatMoney(29.99, 'USD')).toBe('$29.99')
    })
  })

  describe('formatDate', () => {
    it('格式化日期字符串', () => {
      const date = '2024-01-15T10:30:00Z'
      const result = formatDate(date)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('格式化 Date 对象', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })

  describe('validateEmail', () => {
    it('验证有效邮箱', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
    })

    it('验证无效邮箱', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@nodomain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('验证有效密码', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('12345678')).toBe(true)
    })

    it('验证无效密码', () => {
      expect(validatePassword('short')).toBe(false)
      expect(validatePassword('')).toBe(false)
    })
  })

  describe('truncateText', () => {
    it('截断过长文本', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is a...')
    })

    it('不截断短文本', () => {
      expect(truncateText('Short', 10)).toBe('Short')
    })
  })

  describe('classNames', () => {
    it('合并类名并过滤假值', () => {
      expect(classNames('foo', 'bar')).toBe('foo bar')
      expect(classNames('foo', false, null, undefined, 'bar')).toBe('foo bar')
      const condition = true
      expect(classNames('foo', condition && 'active')).toBe('foo active')
    })
  })
})
