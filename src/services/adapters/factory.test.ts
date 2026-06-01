import { describe, it, expect } from 'vitest'
import { createAdapter } from './factory'
import type { AdapterType } from './interface'

describe('adapter factory', () => {
  it('默认使用 mock 适配器', () => {
    const adapter = createAdapter({ type: 'mock' })
    expect(adapter).toBeDefined()
    expect(typeof adapter.getProducts).toBe('function')
  })

  it('根据参数创建 mock 适配器', () => {
    const adapter = createAdapter({ type: 'mock' })
    expect(adapter).toBeDefined()
    expect(typeof adapter.getProducts).toBe('function')
  })

  it('根据参数创建 shopify 适配器', () => {
    const adapter = createAdapter({
      type: 'shopify',
      storeDomain: 'test.myshopify.com',
      storefrontApiToken: 'test-token',
      apiVersion: '2024-07',
    })
    expect(adapter).toBeDefined()
    expect(typeof adapter.getProducts).toBe('function')
  })

  it('支持通过参数覆盖默认配置', () => {
    const adapter = createAdapter({ type: 'mock' as AdapterType })
    expect(adapter).toBeDefined()
    expect(typeof adapter.getProducts).toBe('function')
  })

  it('未知类型默认使用 mock 适配器', () => {
    const adapter = createAdapter({ type: 'custom' as AdapterType })
    expect(adapter).toBeDefined()
  })

  it('创建的适配器包含所有必要方法', () => {
    const adapter = createAdapter({ type: 'mock' })
    expect(typeof adapter.getProducts).toBe('function')
    expect(typeof adapter.getProduct).toBe('function')
    expect(typeof adapter.createCart).toBe('function')
    expect(typeof adapter.getCart).toBe('function')
    expect(typeof adapter.addCartLines).toBe('function')
    expect(typeof adapter.createCustomer).toBe('function')
    expect(typeof adapter.login).toBe('function')
  })
})
