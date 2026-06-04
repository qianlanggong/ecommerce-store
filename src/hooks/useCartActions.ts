import { useCallback, useMemo } from 'react'
import {
  useCart,
  useAddCartLines,
  useUpdateCartLines,
  useRemoveCartLines,
  useCreateCart,
} from '@/services/cartService'
import { useCartStore } from '@/stores/cartStore'
import { getAllMockProducts } from '@/mocks/products'
import type { CartLineInput, Product, ProductVariant } from '@/types'

/**
 * 根据变体 ID 查找商品
 *
 * 在 mock 数据中遍历所有商品的变体，找到匹配的变体所属的商品。
 * 这是一个辅助函数，用于获取购物车商品的完整信息。
 *
 * 注意：这是 mock 环境的实现，生产环境应直接从购物车数据中获取。
 *
 * @param variantId - 商品变体 ID
 * @returns 找到的商品对象，未找到返回 null
 */
function findProductByVariantId(variantId: string): Product | null {
  const products = getAllMockProducts()
  for (const product of products) {
    for (const edge of product.variants.edges) {
      if (edge.node.id === variantId) {
        return product
      }
    }
  }
  return null
}

/**
 * 获取商品图片 URL
 *
 * 获取商品变体的图片 URL，优先级：
 * 1. 变体自身的图片
 * 2. 商品的特色图片（featuredImage）
 * 3. 商品的第一张图片
 * 4. 空字符串（无图片）
 *
 * @param variant - 商品变体
 * @returns 图片 URL，无图片时返回空字符串
 */
function getProductImageUrl(variant: ProductVariant): string {
  if (variant.image?.url) {
    return variant.image.url
  }
  const product = findProductByVariantId(variant.id)
  if (product?.featuredImage?.url) {
    return product.featuredImage.url
  }
  if (product?.images.edges.length > 0) {
    return product.images.edges[0].node.url
  }
  return ''
}

/**
 * 获取商品标题
 *
 * 优先返回商品的标题，如果找不到商品则返回变体标题。
 *
 * @param variant - 商品变体
 * @returns 商品标题
 */
function getProductTitle(variant: ProductVariant): string {
  const product = findProductByVariantId(variant.id)
  return product?.title || variant.title
}

/**
 * 购物车操作 Hook
 *
 * 这是购物车功能的核心 Hook，封装了所有购物车操作：
 * - 添加商品
 * - 更新数量
 * - 删除商品
 * - 清空购物车
 * - 创建新购物车
 *
 * 设计特点：
 * 1. 整合乐观更新机制，操作后立即更新 UI
 * 2. API 失败时自动回滚到服务器状态
 * 3. 自动处理购物车不存在的边界情况
 * 4. 封装 cartLines 计算，返回增强的购物车商品列表
 *
 * 数据优先级：
 * - 优先显示 optimisticCart（乐观更新数据）
 * - optimisticCart 为 null 时显示 cart（服务器数据）
 *
 * @returns 购物车数据和操作方法
 */
export function useCartActions() {
  const { data: cart, isLoading } = useCart()
  const addCartLines = useAddCartLines()
  const updateCartLines = useUpdateCartLines()
  const removeCartLines = useRemoveCartLines()
  const createCart = useCreateCart()
  const { optimisticCart, setOptimisticCart, updateOptimisticLine, removeOptimisticLine } =
    useCartStore()

  const displayCart = optimisticCart || cart

  /**
   * 添加商品到购物车
   *
   * 调用 cartService 的 addCartLines mutation，
   * 成功后更新乐观更新数据。
   *
   * @param lines - 要添加的商品行数组
   * @returns 更新后的购物车对象
   */
  const addToCart = useCallback(
    async (lines: CartLineInput[]) => {
      const result = await addCartLines.mutateAsync(lines)
      setOptimisticCart(result)
      return result
    },
    [addCartLines, setOptimisticCart],
  )

  /**
   * 删除购物车商品行
   *
   * 乐观更新机制：
   * 1. 立即更新本地状态（removeOptimisticLine）
   * 2. 发起 API 请求
   * 3. 成功：用服务器数据更新乐观状态
   * 4. 失败：回滚到服务器数据
   *
   * @param lineId - 要删除的商品行 ID
   * @returns 更新后的购物车对象
   * @throws API 请求失败时抛出错误
   */
  const removeLine = useCallback(
    async (lineId: string) => {
      removeOptimisticLine(lineId)
      try {
        const result = await removeCartLines.mutateAsync([lineId])
        setOptimisticCart(result)
        return result
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    },
    [removeCartLines, removeOptimisticLine, setOptimisticCart, cart],
  )

  /**
   * 更新商品数量
   *
   * 处理逻辑：
   * 1. 数量 <= 0 时调用 removeLine 删除商品
   * 2. 否则执行乐观更新并调用 API
   * 3. API 失败时回滚
   *
   * @param lineId - 要更新的商品行 ID
   * @param quantity - 新的数量
   * @returns 更新后的购物车对象
   * @throws API 请求失败时抛出错误
   */
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeLine(lineId)
      }
      updateOptimisticLine(lineId, quantity)
      try {
        const result = await updateCartLines.mutateAsync([{ id: lineId, quantity }])
        setOptimisticCart(result)
        return result
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    },
    [updateCartLines, updateOptimisticLine, setOptimisticCart, cart, removeLine],
  )

  /**
   * 清空购物车
   *
   * 删除购物车中的所有商品。
   * 乐观更新机制：
   * 1. 立即清空乐观更新数据
   * 2. 批量删除所有商品行
   * 3. 失败时回滚
   *
   * 注意：空购物车不执行操作。
   *
   * @throws API 请求失败时抛出错误
   */
  const clearCart = useCallback(async () => {
    if (!displayCart) return
    const lineIds = displayCart.lines.edges.map((e) => e.node.id)
    if (lineIds.length > 0) {
      setOptimisticCart(null)
      try {
        await removeCartLines.mutateAsync(lineIds)
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    }
  }, [displayCart, removeCartLines, setOptimisticCart, cart])

  /**
   * 创建新购物车
   *
   * 创建新购物车，可选择添加初始商品。
   * 用于需要重置购物车的场景。
   *
   * @param lines - 可选的初始商品行
   * @returns 新创建的购物车对象
   */
  const createNewCart = useCallback(
    async (lines?: CartLineInput[]) => {
      const result = await createCart.mutateAsync(lines ? { lines } : undefined)
      setOptimisticCart(result)
      return result
    },
    [createCart, setOptimisticCart],
  )

  /**
   * 增强的购物车商品列表
   *
   * 使用 useMemo 缓存计算结果，为每个商品行添加：
   * - productTitle: 商品标题（从 mock 数据获取）
   * - productImageUrl: 商品图片 URL（从 mock 数据获取）
   *
   * 这些字段是 UI 展示所需的补充数据。
   */
  const cartLines = useMemo(() => {
    return (displayCart?.lines.edges.map((e) => e.node) || []).map((line) => ({
      ...line,
      productTitle: getProductTitle(line.merchandise),
      productImageUrl: getProductImageUrl(line.merchandise),
    }))
  }, [displayCart])

  const totalQuantity = displayCart?.totalQuantity || 0
  const subtotal = displayCart?.estimatedCost.subtotalAmount
  const total = displayCart?.estimatedCost.totalAmount
  const tax = displayCart?.estimatedCost.taxAmount
  const checkoutUrl = displayCart?.checkoutUrl || '/checkout'

  return {
    cart: displayCart,
    cartLines,
    isLoading,
    totalQuantity,
    subtotal,
    total,
    tax,
    checkoutUrl,
    addToCart,
    updateQuantity,
    removeLine,
    clearCart,
    createNewCart,
  }
}
