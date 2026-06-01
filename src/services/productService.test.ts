import { describe, expect, it } from 'vitest'
import { productKeys, collectionKeys } from './productService'
import type { ProductFilter } from '@/types'

describe('productKeys', () => {
  it('should generate correct all key', () => {
    expect(productKeys.all).toEqual(['products'])
  })

  it('should generate correct lists key', () => {
    expect(productKeys.lists()).toEqual(['products', 'list'])
  })

  it('should generate correct list key with filter', () => {
    const filter: ProductFilter = { first: 12, sortKey: 'TITLE' }
    expect(productKeys.list(filter)).toEqual(['products', 'list', filter])
  })

  it('should generate correct details key', () => {
    expect(productKeys.details()).toEqual(['products', 'detail'])
  })

  it('should generate correct detail key with handle', () => {
    expect(productKeys.detail('test-handle')).toEqual(['products', 'detail', 'test-handle'])
  })

  it('should generate correct recommendations key', () => {
    expect(productKeys.recommendations('prod-123')).toEqual([
      'products',
      'recommendations',
      'prod-123',
    ])
  })
})

describe('collectionKeys', () => {
  it('should generate correct all key', () => {
    expect(collectionKeys.all).toEqual(['collections'])
  })

  it('should generate correct lists key', () => {
    expect(collectionKeys.lists()).toEqual(['collections', 'list'])
  })

  it('should generate correct detail key with handle', () => {
    expect(collectionKeys.detail('collection-handle')).toEqual([
      'collections',
      'detail',
      'collection-handle',
    ])
  })
})
