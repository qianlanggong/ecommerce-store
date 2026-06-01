import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import type { ProductFilter } from '@/types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (handle: string) => [...productKeys.details(), handle] as const,
  recommendations: (productId: string) =>
    [...productKeys.all, 'recommendations', productId] as const,
}

export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  detail: (handle: string) => [...collectionKeys.all, 'detail', handle] as const,
}

export function useProducts(filter: ProductFilter = {}) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => adapter.getProducts(filter),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: productKeys.detail(handle),
    queryFn: () => adapter.getProduct(handle),
    enabled: !!handle,
    staleTime: 10 * 60 * 1000,
  })
}

export function useProductRecommendations(productId: string) {
  return useQuery({
    queryKey: productKeys.recommendations(productId),
    queryFn: () => adapter.getProductRecommendations(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => adapter.getCollections(),
    staleTime: 30 * 60 * 1000,
  })
}

export function useCollection(handle: string) {
  return useQuery({
    queryKey: collectionKeys.detail(handle),
    queryFn: () => adapter.getCollection(handle),
    enabled: !!handle,
    staleTime: 10 * 60 * 1000,
  })
}

export function usePrefetchProduct() {
  const queryClient = useQueryClient()

  return (handle: string) => {
    queryClient.prefetchQuery({
      queryKey: productKeys.detail(handle),
      queryFn: () => adapter.getProduct(handle),
      staleTime: 10 * 60 * 1000,
    })
  }
}

export { adapter }
