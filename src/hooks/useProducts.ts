import { useMemo } from 'react'
import { useProducts as useProductsQuery, useProduct as useProductQuery } from '@/services/productService'
import type { Product, ProductFilter } from '@/types'

export function useProducts(filter: ProductFilter = {}) {
  const { data, isLoading, error, refetch } = useProductsQuery(filter)

  const products = useMemo(() => {
    return data?.edges.map((edge) => edge.node) || []
  }, [data])

  const pageInfo = useMemo(() => {
    return data?.pageInfo || { hasNextPage: false, hasPreviousPage: false }
  }, [data])

  const totalCount = useMemo(() => {
    return products.length
  }, [products])

  return {
    products,
    isLoading,
    error,
    refetch,
    pageInfo,
    totalCount,
  }
}

export function useProduct(handle: string) {
  const { data, isLoading, error, refetch } = useProductQuery(handle)

  return {
    product: data,
    isLoading,
    error,
    refetch,
  }
}

export function useProductVariants(product: Product | undefined | null) {
  return useMemo(() => {
    if (!product) return { variants: [], selectedVariant: null, options: [] }

    const variants = product.variants.edges.map((edge) => edge.node)
    const options = product.options

    return {
      variants,
      options,
      firstVariant: variants[0] || null,
    }
  }, [product])
}

export function useProductPrice(product: Product | undefined | null, locale: string = 'en-US') {
  return useMemo(() => {
    if (!product) return { displayPrice: '', minPrice: 0, maxPrice: 0, currency: 'USD' }

    const minPrice = parseFloat(product.priceRange.minVariantPrice.amount)
    const maxPrice = parseFloat(product.priceRange.maxVariantPrice.amount)
    const currency = product.priceRange.minVariantPrice.currencyCode

    const displayPrice =
      minPrice === maxPrice
        ? new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
          }).format(minPrice)
        : `${new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minPrice)} - ${new Intl.NumberFormat(locale, { style: 'currency', currency }).format(maxPrice)}`

    return {
      displayPrice,
      minPrice,
      maxPrice,
      currency,
    }
  }, [product, locale])
}

export function useFilteredProducts(
  products: Product[],
  options: {
    searchQuery?: string
    minPrice?: number
    maxPrice?: number
    tags?: string[]
    productType?: string
    vendor?: string
    availableOnly?: boolean
  } = {},
) {
  return useMemo(() => {
    let filtered = [...products]

    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.productType.toLowerCase().includes(query) ||
          p.vendor.toLowerCase().includes(query) ||
          p.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    if (options.minPrice !== undefined) {
      filtered = filtered.filter(
        (p) => parseFloat(p.priceRange.minVariantPrice.amount) >= options.minPrice!,
      )
    }

    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(
        (p) => parseFloat(p.priceRange.maxVariantPrice.amount) <= options.maxPrice!,
      )
    }

    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter((p) => options.tags!.some((tag) => p.tags.includes(tag)))
    }

    if (options.productType) {
      filtered = filtered.filter((p) => p.productType === options.productType)
    }

    if (options.vendor) {
      filtered = filtered.filter((p) => p.vendor === options.vendor)
    }

    if (options.availableOnly) {
      filtered = filtered.filter((p) => p.availableForSale)
    }

    return filtered
  }, [products, options])
}

export function useProductSort(
  products: Product[],
  sortKey?: ProductFilter['sortKey'],
  reverse: boolean = false,
) {
  return useMemo(() => {
    const sorted = [...products]

    if (sortKey) {
      switch (sortKey) {
        case 'TITLE':
          sorted.sort((a, b) => a.title.localeCompare(b.title))
          break
        case 'PRICE':
          sorted.sort(
            (a, b) =>
              parseFloat(a.priceRange.minVariantPrice.amount) -
              parseFloat(b.priceRange.minVariantPrice.amount),
          )
          break
        case 'CREATED':
          sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case 'BEST_SELLING':
          sorted.sort((a, b) => b.totalInventory - a.totalInventory)
          break
      }

      if (reverse) {
        sorted.reverse()
      }
    }

    return sorted
  }, [products, sortKey, reverse])
}

export { useProductsQuery, useProductQuery }
