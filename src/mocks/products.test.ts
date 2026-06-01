import { describe, expect, it } from 'vitest'
import {
  mockProducts,
  getMockProducts,
  getMockProduct,
  getMockProductRecommendations,
  getMockCollections,
  getMockCollection,
} from './products'

describe('mock products data', () => {
  it('should have valid mock products', () => {
    expect(mockProducts).toHaveLength(8)
    mockProducts.forEach((product) => {
      expect(product.id).toBeTruthy()
      expect(product.handle).toBeTruthy()
      expect(product.title).toBeTruthy()
      expect(product.description).toBeTruthy()
      expect(product.priceRange).toBeTruthy()
      expect(product.images).toBeTruthy()
      expect(product.variants).toBeTruthy()
      expect(product.options).toBeTruthy()
    })
  })

  it('should have products with valid variants', () => {
    mockProducts.forEach((product) => {
      expect(product.variants.edges.length).toBeGreaterThan(0)
      product.variants.edges.forEach(({ node: variant }) => {
        expect(variant.id).toBeTruthy()
        expect(variant.price).toBeTruthy()
        expect(variant.selectedOptions).toBeTruthy()
      })
    })
  })

  it('should have products with valid images', () => {
    mockProducts.forEach((product) => {
      expect(product.images.edges.length).toBeGreaterThan(0)
      product.images.edges.forEach(({ node: image }) => {
        expect(image.id).toBeTruthy()
        expect(image.url).toBeTruthy()
      })
    })
  })
})

describe('getMockProducts', () => {
  it('should return all products without filter', () => {
    const result = getMockProducts()
    expect(result.edges).toHaveLength(mockProducts.length)
    expect(result.pageInfo.hasNextPage).toBe(false)
  })

  it('should filter products by query', () => {
    const result = getMockProducts({ query: 't-shirt' })
    expect(result.edges.length).toBeGreaterThan(0)
    result.edges.forEach(({ node }) => {
      const searchText = `${node.title} ${node.description} ${node.tags.join(' ')}`.toLowerCase()
      expect(searchText).toContain('t-shirt')
    })
  })

  it('should filter products by minimum price', () => {
    const result = getMockProducts({ minPrice: '100' })
    result.edges.forEach(({ node }) => {
      const price = parseFloat(node.priceRange.minVariantPrice.amount)
      expect(price).toBeGreaterThanOrEqual(100)
    })
  })

  it('should filter products by maximum price', () => {
    const result = getMockProducts({ maxPrice: '50' })
    result.edges.forEach(({ node }) => {
      const price = parseFloat(node.priceRange.maxVariantPrice.amount)
      expect(price).toBeLessThanOrEqual(50)
    })
  })

  it('should filter products by price range', () => {
    const result = getMockProducts({ minPrice: '50', maxPrice: '100' })
    result.edges.forEach(({ node }) => {
      const minPrice = parseFloat(node.priceRange.minVariantPrice.amount)
      const maxPrice = parseFloat(node.priceRange.maxVariantPrice.amount)
      expect(minPrice).toBeGreaterThanOrEqual(50)
      expect(maxPrice).toBeLessThanOrEqual(100)
    })
  })

  it('should filter products by tag', () => {
    const result = getMockProducts({ tag: 'sale' })
    expect(result.edges.length).toBeGreaterThan(0)
    result.edges.forEach(({ node }) => {
      expect(node.tags).toContain('sale')
    })
  })

  it('should filter products by productType', () => {
    const result = getMockProducts({ productType: 'T-Shirts' })
    expect(result.edges.length).toBeGreaterThan(0)
    result.edges.forEach(({ node }) => {
      expect(node.productType).toBe('T-Shirts')
    })
  })

  it('should filter products by vendor', () => {
    const result = getMockProducts({ vendor: 'Ecommerce Brand' })
    expect(result.edges.length).toBeGreaterThan(0)
    result.edges.forEach(({ node }) => {
      expect(node.vendor).toBe('Ecommerce Brand')
    })
  })

  it('should sort products by title', () => {
    const result = getMockProducts({ sortKey: 'TITLE' })
    const titles = result.edges.map(({ node }) => node.title)
    const sortedTitles = [...titles].sort((a, b) => a.localeCompare(b))
    expect(titles).toEqual(sortedTitles)
  })

  it('should sort products by price ascending', () => {
    const result = getMockProducts({ sortKey: 'PRICE' })
    const prices = result.edges.map(({ node }) =>
      parseFloat(node.priceRange.minVariantPrice.amount),
    )
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  })

  it('should sort products by creation date', () => {
    const result = getMockProducts({ sortKey: 'CREATED' })
    const dates = result.edges.map(({ node }) => new Date(node.createdAt).getTime())
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1])
    }
  })

  it('should reverse sort order', () => {
    const resultAsc = getMockProducts({ sortKey: 'TITLE' })
    const resultDesc = getMockProducts({ sortKey: 'TITLE', reverse: true })
    expect(resultDesc.edges.map(({ node }) => node.title)).toEqual(
      [...resultAsc.edges.map(({ node }) => node.title)].reverse(),
    )
  })

  it('should paginate products with first parameter', () => {
    const result = getMockProducts({ first: 3 })
    expect(result.edges).toHaveLength(3)
    expect(result.pageInfo.hasNextPage).toBe(true)
  })

  it('should handle pagination edge cases', () => {
    const result = getMockProducts({ first: 100 })
    expect(result.edges).toHaveLength(mockProducts.length)
    expect(result.pageInfo.hasNextPage).toBe(false)
  })

  it('should return empty result for non-matching query', () => {
    const result = getMockProducts({ query: 'nonexistent-product-xyz' })
    expect(result.edges).toHaveLength(0)
  })
})

describe('getMockProduct', () => {
  it('should return product by handle', () => {
    const handle = mockProducts[0].handle
    const product = getMockProduct(handle)
    expect(product).toBeTruthy()
    expect(product?.handle).toBe(handle)
    expect(product?.title).toBe(mockProducts[0].title)
  })

  it('should return null for non-existent handle', () => {
    const product = getMockProduct('non-existent-handle')
    expect(product).toBeNull()
  })
})

describe('getMockProductRecommendations', () => {
  it('should return recommendations based on tags', () => {
    const product = mockProducts[0]
    const recommendations = getMockProductRecommendations(product.id)
    expect(recommendations.length).toBeLessThanOrEqual(4)
    recommendations.forEach((rec) => {
      expect(rec.id).not.toBe(product.id)
      const hasMatchingTag = rec.tags.some((tag) => product.tags.includes(tag))
      expect(hasMatchingTag).toBe(true)
    })
  })

  it('should return empty array for non-existent product', () => {
    const recommendations = getMockProductRecommendations('non-existent-id')
    expect(recommendations).toEqual([])
  })
})

describe('getMockCollections', () => {
  it('should return all collections', () => {
    const result = getMockCollections()
    expect(result.edges).toHaveLength(3)
    expect(result.pageInfo.hasNextPage).toBe(false)
  })

  it('should have valid collections with products', () => {
    const result = getMockCollections()
    result.edges.forEach(({ node: collection }) => {
      expect(collection.id).toBeTruthy()
      expect(collection.handle).toBeTruthy()
      expect(collection.title).toBeTruthy()
      expect(collection.products.edges.length).toBeGreaterThan(0)
    })
  })
})

describe('getMockCollection', () => {
  it('should return collection by handle', () => {
    const result = getMockCollections()
    const firstCollection = result.edges[0].node
    const collection = getMockCollection(firstCollection.handle)
    expect(collection).toBeTruthy()
    expect(collection?.handle).toBe(firstCollection.handle)
  })

  it('should return null for non-existent handle', () => {
    const collection = getMockCollection('non-existent-collection')
    expect(collection).toBeNull()
  })
})
