import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { adapter } from './adapters/factory'
import { useCartStore } from '@/stores/cartStore'
import { useToastStore } from '@/stores/toastStore'
import type { CartInput, CartLineInput, CartLineUpdateInput } from '@/types'

/**
 * 购物车 Query Keys 配置
 *
 * 遵循 React Query 最佳实践，使用分层结构组织缓存键。
 * 这样可以精确控制缓存失效范围，例如：
 * - cartKeys.all 可用于使所有购物车相关缓存失效
 * - cartKeys.detail(cartId) 用于特定购物车的缓存
 *
 * 注意：使用 as const 确保类型安全，避免运行时键名错误。
 */
export const cartKeys = {
  all: ['cart'] as const,
  detail: (cartId: string) => [...cartKeys.all, cartId] as const,
}

/**
 * 获取当前购物车 ID
 *
 * 从 Zustand store 中获取购物车 ID，用于在非 React 组件
 * 环境中访问购物车状态（如 mutationFn 中）。
 *
 * @returns 购物车 ID，如果不存在则返回 null
 */
function getCartId(): string | null {
  return useCartStore.getState().cartId
}

/**
 * 设置购物车 ID
 *
 * 在创建新购物车后调用，将购物车 ID 持久化到 store 中。
 * 使用 store 的 getState() 方法确保在非组件环境中也能更新状态。
 *
 * @param cartId - 新创建的购物车 ID
 */
function setCartId(cartId: string): void {
  useCartStore.getState().setCartId(cartId)
}

/**
 * 清除购物车 ID
 *
 * 当购物车无效或需要重置时调用，清除 store 中的购物车 ID
 * 和相关的乐观更新数据。
 */
function clearCartId(): void {
  useCartStore.getState().clearCart()
}

/**
 * 获取当前购物车 Query
 *
 * 核心购物车查询 Hook，处理以下场景：
 * 1. 无购物车 ID 时自动创建新购物车
 * 2. 购物车 ID 无效时自动重建
 * 3. 30秒缓存，窗口聚焦时自动刷新
 *
 * 设计考虑：
 * - 使用 'empty' 作为占位符避免空键导致的查询异常
 * - 在 queryFn 内重新获取 cartId 防止闭包捕获旧值
 * - 购物车失效时自动重建，保证用户始终有可用购物车
 *
 * @returns React Query 结果对象，包含购物车数据和加载状态
 */
export function useCart() {
  const cartId = useCartStore((state) => state.cartId)

  return useQuery({
    queryKey: cartKeys.detail(cartId || 'empty'),
    queryFn: async () => {
      if (!cartId) {
        const newCart = await adapter.createCart()
        setCartId(newCart.id)
        return newCart
      }
      const cart = await adapter.getCart(cartId)
      if (!cart) {
        clearCartId()
        const newCart = await adapter.createCart()
        setCartId(newCart.id)
        return newCart
      }
      return cart
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    enabled: true,
  })
}

/**
 * 创建新购物车 Mutation
 *
 * 用于显式创建新购物车场景，如清空后重建或合并购物车。
 * 创建成功后自动更新缓存和 store 中的购物车 ID。
 *
 * @returns React Query Mutation 对象，可通过 mutate 或 mutateAsync 调用
 */
export function useCreateCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input?: CartInput) => adapter.createCart(input),
    onSuccess: (cart) => {
      setCartId(cart.id)
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

/**
 * 添加商品到购物车 Mutation
 *
 * 处理添加商品逻辑，自动处理无购物车的情况：
 * 1. 如果没有购物车，先创建购物车再添加商品
 * 2. 如果已有购物车，直接添加商品
 *
 * 成功后自动执行：
 * - 更新 React Query 缓存
 * - 打开购物车抽屉
 * - 显示成功提示
 *
 * 失败时显示错误提示。
 *
 * @returns React Query Mutation 对象，调用时传入 CartLineInput 数组
 */
export function useAddCartLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('cart')

  return useMutation({
    mutationFn: async (lines: CartLineInput[]) => {
      const currentCartId = getCartId()
      if (!currentCartId) {
        const newCart = await adapter.createCart({ lines })
        setCartId(newCart.id)
        return newCart
      }
      return adapter.addCartLines(currentCartId, lines)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      useCartStore.getState().openDrawer()
      useToastStore.getState().addToast(t('addSuccess'), 'success')
    },
    onError: () => {
      useToastStore.getState().addToast(t('addError'), 'error')
    },
  })
}

/**
 * 更新购物车商品数量 Mutation
 *
 * 用于修改购物车中已有商品的数量。
 *
 * 边界处理：
 * - 如果购物车不存在，抛出错误
 * - 成功后更新缓存并显示成功提示
 * - 失败时显示错误提示
 *
 * 注意：数量为 0 时应调用 useRemoveCartLines，此接口不处理数量为 0 的情况。
 *
 * @returns React Query Mutation 对象，调用时传入 CartLineUpdateInput 数组
 * @throws {Error} 当购物车不存在时抛出错误
 */
export function useUpdateCartLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('cart')

  return useMutation({
    mutationFn: (lines: CartLineUpdateInput[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartLines(cartId, lines)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      useToastStore.getState().addToast(t('updateSuccess'), 'success')
    },
    onError: () => {
      useToastStore.getState().addToast(t('updateError'), 'error')
    },
  })
}

/**
 * 删除购物车商品 Mutation
 *
 * 从购物车中移除指定的商品行项。
 *
 * 边界处理：
 * - 如果购物车不存在，抛出错误
 * - 成功后更新缓存并显示成功提示
 * - 失败时显示错误提示
 *
 * @returns React Query Mutation 对象，调用时传入要删除的行项 ID 数组
 * @throws {Error} 当购物车不存在时抛出错误
 */
export function useRemoveCartLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('cart')

  return useMutation({
    mutationFn: (lineIds: string[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.removeCartLines(cartId, lineIds)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      useToastStore.getState().addToast(t('removeSuccess'), 'success')
    },
    onError: () => {
      useToastStore.getState().addToast(t('removeError'), 'error')
    },
  })
}

/**
 * 更新购物车购买者身份信息 Mutation
 *
 * 在结账流程中使用，关联购物车与用户身份信息。
 * 常用于：
 * - 用户登录后关联购物车
 * - 填写邮箱用于订单通知
 * - 设置国家/地区以计算税费和运费
 *
 * @returns React Query Mutation 对象，调用时传入购买者身份信息
 * @throws {Error} 当购物车不存在时抛出错误
 */
export function useUpdateCartBuyerIdentity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (buyerIdentity: {
      email?: string
      customerAccessToken?: string
      countryCode?: string
    }) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartBuyerIdentity(cartId, buyerIdentity)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

/**
 * 更新购物车折扣码 Mutation
 *
 * 应用或移除购物车折扣码。
 * 传入空数组表示清除所有折扣码。
 *
 * 注意事项：
 * - 折扣码验证由后端适配器处理
 * - 无效折扣码会在 adapter 层抛出错误
 * - 成功后自动更新缓存中的购物车数据
 *
 * @returns React Query Mutation 对象，调用时传入折扣码字符串数组
 * @throws {Error} 当购物车不存在时抛出错误
 */
export function useUpdateCartDiscountCodes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (discountCodes: string[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartDiscountCodes(cartId, discountCodes)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

/**
 * 清空购物车 Hook
 *
 * 返回一个函数，调用后执行：
 * 1. 清除 store 中的购物车 ID 和乐观更新数据
 * 2. 移除所有购物车相关的 React Query 缓存
 *
 * 使用场景：
 * - 用户登出时
 * - 订单完成后
 * - 主动清空购物车
 *
 * 注意：这是客户端操作，不会调用后端 API。
 * 如果需要在后端清空购物车，应使用 useRemoveCartLines 删除所有商品。
 *
 * @returns 清空购物车的函数
 */
export function useClearCart() {
  const queryClient = useQueryClient()

  return () => {
    clearCartId()
    queryClient.removeQueries({ queryKey: cartKeys.all })
  }
}

export { adapter }
