import { describe, it, expect } from 'vitest'
import { getLocaleFromPath, stripLocaleFromPath, addLocaleToPath, changeLocaleInUrl } from './config'
import type { Locale } from '@/types'

describe('i18n config utilities', () => {
  describe('getLocaleFromPath', () => {
    it('从路径中提取语言前缀', () => {
      expect(getLocaleFromPath('/en/products')).toBe('en')
      expect(getLocaleFromPath('/zh/products')).toBe('zh')
    })

    it('处理根路径', () => {
      expect(getLocaleFromPath('/en')).toBe('en')
      expect(getLocaleFromPath('/zh')).toBe('zh')
    })

    it('无语言前缀时返回默认语言', () => {
      expect(getLocaleFromPath('/products')).toBe('en')
      expect(getLocaleFromPath('/')).toBe('en')
    })

    it('处理深层路径', () => {
      expect(getLocaleFromPath('/en/products/handle')).toBe('en')
      expect(getLocaleFromPath('/zh/account/orders')).toBe('zh')
    })
  })

  describe('stripLocaleFromPath', () => {
    it('移除路径中的语言前缀', () => {
      expect(stripLocaleFromPath('/en/products')).toBe('/products')
      expect(stripLocaleFromPath('/zh/products')).toBe('/products')
    })

    it('处理根路径', () => {
      expect(stripLocaleFromPath('/en')).toBe('/')
      expect(stripLocaleFromPath('/zh')).toBe('/')
    })

    it('无语言前缀时保持原样', () => {
      expect(stripLocaleFromPath('/products')).toBe('/products')
      expect(stripLocaleFromPath('/')).toBe('/')
    })
  })

  describe('addLocaleToPath', () => {
    it('为路径添加语言前缀', () => {
      expect(addLocaleToPath('/products', 'en' as Locale)).toBe('/en/products')
      expect(addLocaleToPath('/products', 'zh' as Locale)).toBe('/zh/products')
    })

    it('处理根路径', () => {
      expect(addLocaleToPath('/', 'en' as Locale)).toBe('/en')
      expect(addLocaleToPath('/', 'zh' as Locale)).toBe('/zh')
    })

    it('已有语言前缀时保持原样', () => {
      expect(addLocaleToPath('/en/products', 'en' as Locale)).toBe('/en/products')
      expect(addLocaleToPath('/zh/products', 'zh' as Locale)).toBe('/zh/products')
    })
  })

  describe('changeLocaleInUrl', () => {
    it('切换 URL 中的语言', () => {
      expect(changeLocaleInUrl('/en/products', 'zh' as Locale)).toBe('/zh/products')
      expect(changeLocaleInUrl('/zh/products', 'en' as Locale)).toBe('/en/products')
    })

    it('处理根路径语言切换', () => {
      expect(changeLocaleInUrl('/en', 'zh' as Locale)).toBe('/zh')
      expect(changeLocaleInUrl('/zh', 'en' as Locale)).toBe('/en')
    })

    it('无语言前缀时添加新语言', () => {
      expect(changeLocaleInUrl('/products', 'zh' as Locale)).toBe('/zh/products')
    })
  })
})
