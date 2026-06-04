import { useQuery, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import type { ProductFilter } from '@/types'

/**
 * 商品 Query Keys 配置
 *
 * 采用分层结构设计缓存键，支持精确的缓存失效策略：
 * - productKeys.all - 所有商品相关缓存
 * - productKeys.lists() - 所有商品列表缓存
 * - productKeys.list(filter) - 特定筛选条件的商品列表
 * - productKeys.details() - 所有商品详情缓存
 * - productKeys.detail(handle) - 特定商品详情
 * - productKeys.recommendations(productId) - 特定商品的推荐商品
 *
 * 设计考虑：
 * 1. filter 对象作为 queryKey 一部分，确保不同筛选条件独立缓存
 * 2. 使用 handle 而非 ID 作为详情键，与路由参数保持一致
 * 3. 推荐商品按 productId 独立缓存，便于跨页面复用
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filter: ProductFilter) => [...productKeys.lists(), filter] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (handle: string) => [...productKeys.details(), handle] as const,
  recommendations: (productId: string) =>
    [...productKeys.all, 'recommendations', productId] as const,
}

/**
 * 商品集合 Query Keys 配置
 *
 * 集合（Collection）是 Shopify 中的商品分类概念，
 * 类似于商品分类，用于组织和展示特定主题的商品集合。
 */
export const collectionKeys = {
  all: ['collections'] as const,
  lists: () => [...collectionKeys.all, 'list'] as const,
  detail: (handle: string) => [...collectionKeys.all, 'detail', handle] as const,
}

/**
 * 获取商品列表 Query
 *
 * 根据筛选条件获取商品列表，支持分页、排序和多种过滤条件。
 * 缓存时间 5 分钟，商品数据相对稳定，适合较长缓存。
 *
 * @param filter - 商品筛选条件，支持搜索、排序、价格区间等
 * @returns React Query 结果对象，包含商品连接对象和分页信息
 */
export function useProducts(filter: ProductFilter = {}) {
  return useQuery({
    queryKey: productKeys.list(filter),
    queryFn: () => adapter.getProducts(filter),
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 获取单个商品详情 Query
 *
 * 根据商品 handle 获取商品详情，包含完整的商品信息、
 * 变体、图片、选项等。
 * 缓存时间 10 分钟，商品详情变更频率低。
 *
 * 注意：handle 是 Shopify 中的 URL 友好标识符，
 * 通常用于路由中。
 *
 * @param handle - 商品的 handle 标识符
 * @returns React Query 结果对象，包含商品详情数据
 */
export function useProduct(handle: string) {
  return useQuery({
    queryKey: productKeys.detail(handle),
    queryFn: () => adapter.getProduct(handle),
    enabled: !!handle,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * 获取商品推荐 Query
 *
 * 根据商品 ID 获取相关推荐商品，常用于商品详情页
 * 的"你可能还喜欢"区域。
 *
 * 缓存时间 5 分钟，推荐算法可能定期更新。
 *
 * @param productId - 商品 ID
 * @returns React Query 结果对象，包含推荐商品列表
 */
export function useProductRecommendations(productId: string) {
  return useQuery({
    queryKey: productKeys.recommendations(productId),
    queryFn: () => adapter.getProductRecommendations(productId),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * 获取所有商品集合 Query
 *
 * 获取店铺的所有商品集合列表，用于导航栏、分类页面等。
 * 缓存时间 30 分钟，集合结构非常稳定。
 *
 * @returns React Query 结果对象，包含商品集合列表
 */
export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => adapter.getCollections(),
    staleTime: 30 * 60 * 1000,
  })
}

/**
 * 获取单个商品集合详情 Query
 *
 * 根据集合 handle 获取集合详情，包含集合信息和
 * 所属商品列表。
 * 缓存时间 10 分钟。
 *
 * @param handle - 集合的 handle 标识符
 * @returns React Query 结果对象，包含集合详情和商品列表
 */
export function useCollection(handle: string) {
  return useQuery({
    queryKey: collectionKeys.detail(handle),
    queryFn: () => adapter.getCollection(handle),
    enabled: !!handle,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * 预加载商品详情 Hook
 *
 * 返回一个预加载函数，用于在用户悬停或可能导航到
 * 商品详情页前预加载商品数据，提升用户体验。
 *
 * 典型使用场景：
 * - 商品卡片鼠标悬停时预加载
 * - 列表滚动到视口时预加载
 * - 搜索结果预测时预加载
 *
 * 注意事项：
 * - 预加载的数据会被缓存，后续 useProduct 可直接使用
 * - 与 useProduct 使用相同的缓存键，确保数据一致性
 *
 * @returns 预加载函数，接收商品 handle 作为参数
 */
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
