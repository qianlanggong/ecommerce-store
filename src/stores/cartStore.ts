import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Cart } from '@/types'

/**
 * 购物车状态接口
 *
 * 管理购物车的 UI 状态和乐观更新数据：
 * - cartId: 购物车 ID，持久化到 localStorage
 * - isDrawerOpen: 购物车抽屉展开状态
 * - optimisticCart: 乐观更新的购物车数据，用于立即响应用户操作
 *
 * 设计考虑：
 * 1. 购物车核心数据由 React Query 管理，此 store 仅管理 UI 状态和乐观更新
 * 2. cartId 持久化，刷新页面后保持购物车关联
 * 3. 乐观更新使用本地计算，减少 API 等待时间，提升用户体验
 */
interface CartState {
  cartId: string | null
  isDrawerOpen: boolean
  optimisticCart: Cart | null
  setCartId: (id: string | null) => void
  clearCart: () => void
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  setOptimisticCart: (cart: Cart | null) => void
  updateOptimisticLine: (lineId: string, quantity: number) => void
  removeOptimisticLine: (lineId: string) => void
}

/**
 * 购物车状态 Store
 *
 * 管理购物车 UI 状态和乐观更新。
 *
 * 持久化策略：
 * - 仅持久化 cartId，确保刷新页面后购物车不丢失
 * - isDrawerOpen 和 optimisticCart 不持久化，避免 UI 状态异常
 *
 * 乐观更新机制：
 * - 用户操作后立即更新本地状态
 * - API 请求失败时回滚到服务器状态
 * - 成本计算在本地完成，税率固定 8%（模拟实现）
 *
 * 注意事项：
 * - 税率 8% 是硬编码的模拟值，生产环境应从后端获取
 * - 乐观更新仅用于 UI 展示，最终数据以 API 返回为准
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      isDrawerOpen: false,
      optimisticCart: null,

      /**
       * 设置购物车 ID
       *
       * 创建购物车后调用，将购物车 ID 持久化到 localStorage。
       *
       * @param id - 购物车 ID，传 null 清除
       */
      setCartId: (id) => set({ cartId: id }),

      /**
       * 清空购物车状态
       *
       * 清除购物车 ID 和乐观更新数据。
       * 注意：这是客户端操作，如需删除服务器端购物车商品，
       * 应调用 cartService 的相关 API。
       */
      clearCart: () => set({ cartId: null, optimisticCart: null }),

      /**
       * 打开购物车抽屉
       *
       * 添加商品成功后自动调用，展示购物车内容。
       */
      openDrawer: () => set({ isDrawerOpen: true }),

      /**
       * 关闭购物车抽屉
       */
      closeDrawer: () => set({ isDrawerOpen: false }),

      /**
       * 切换购物车抽屉状态
       *
       * 点击购物车图标时调用，在打开/关闭之间切换。
       */
      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      /**
       * 设置乐观更新购物车数据
       *
       * API 请求成功后调用，将服务器返回的最新数据
       * 设置为乐观更新状态。
       *
       * @param cart - 最新购物车数据，传 null 清除乐观更新
       */
      setOptimisticCart: (cart) => set({ optimisticCart: cart }),

      /**
       * 乐观更新商品数量
       *
       * 用户修改商品数量时立即调用，在本地计算新的价格和合计，
       * 同时发起 API 请求。API 返回后再更新为服务器数据。
       *
       * 计算逻辑：
       * 1. 找到对应商品行，更新数量
       * 2. 重新计算该行的总金额（单价 × 数量）
       * 3. 重新计算购物车总数量
       * 4. 重新计算小计、税费（8%）和总计
       *
       * 边界处理：
       * - 如果没有乐观更新数据，直接返回不处理
       * - 金额保留 2 位小数
       * - 缺少 subtotalAmount 的货币代码时默认使用 USD
       *
       * 注意事项：
       * - 税率 8% 为模拟值，生产环境应从后端获取
       * - 不处理折扣、运费等复杂计算
       *
       * @param lineId - 要更新的商品行 ID
       * @param quantity - 新的商品数量
       */
      updateOptimisticLine: (lineId, quantity) => {
        const { optimisticCart } = get()
        if (!optimisticCart) return

        const updatedLines = optimisticCart.lines.edges.map((edge) => {
          if (edge.node.id === lineId) {
            const price = parseFloat(edge.node.cost.amountPerQuantity.amount)
            return {
              node: {
                ...edge.node,
                quantity,
                cost: {
                  ...edge.node.cost,
                  totalAmount: {
                    amount: (price * quantity).toFixed(2),
                    currencyCode: edge.node.cost.totalAmount.currencyCode,
                  },
                  subtotalAmount: {
                    amount: (price * quantity).toFixed(2),
                    currencyCode: edge.node.cost.subtotalAmount?.currencyCode || 'USD',
                  },
                },
              },
            }
          }
          return edge
        })

        const lines = updatedLines.map((e) => e.node)
        const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0)
        let subtotal = 0
        for (const line of lines) {
          subtotal += parseFloat(line.cost.totalAmount.amount)
        }
        const tax = subtotal * 0.08
        const total = subtotal + tax

        set({
          optimisticCart: {
            ...optimisticCart,
            lines: { edges: updatedLines },
            totalQuantity,
            estimatedCost: {
              ...optimisticCart.estimatedCost,
              subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
              totalAmount: { amount: total.toFixed(2), currencyCode: 'USD' },
              taxAmount: { amount: tax.toFixed(2), currencyCode: 'USD' },
            },
          },
        })
      },

      /**
       * 乐观删除商品行
       *
       * 用户删除商品时立即调用，在本地移除该行并重新计算合计，
       * 同时发起 API 请求。API 返回后再更新为服务器数据。
       *
       * 计算逻辑：
       * 1. 过滤掉要删除的商品行
       * 2. 重新计算购物车总数量
       * 3. 重新计算小计、税费（8%）和总计
       *
       * 边界处理：
       * - 如果没有乐观更新数据，直接返回不处理
       * - 删除最后一件商品后，购物车仍保留但为空
       *
       * 注意事项：
       * - 税率 8% 为模拟值，生产环境应从后端获取
       *
       * @param lineId - 要删除的商品行 ID
       */
      removeOptimisticLine: (lineId) => {
        const { optimisticCart } = get()
        if (!optimisticCart) return

        const updatedEdges = optimisticCart.lines.edges.filter(
          (edge) => edge.node.id !== lineId,
        )

        const lines = updatedEdges.map((e) => e.node)
        const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0)
        let subtotal = 0
        for (const line of lines) {
          subtotal += parseFloat(line.cost.totalAmount.amount)
        }
        const tax = subtotal * 0.08
        const total = subtotal + tax

        set({
          optimisticCart: {
            ...optimisticCart,
            lines: { edges: updatedEdges },
            totalQuantity,
            estimatedCost: {
              ...optimisticCart.estimatedCost,
              subtotalAmount: { amount: subtotal.toFixed(2), currencyCode: 'USD' },
              totalAmount: { amount: total.toFixed(2), currencyCode: 'USD' },
              taxAmount: { amount: tax.toFixed(2), currencyCode: 'USD' },
            },
          },
        })
      },
    }),
    {
      name: STORAGE_KEYS.CART_ID,
      /**
       * 持久化字段选择器
       *
       * 仅持久化 cartId，UI 状态和乐观更新不持久化，
       * 避免刷新页面后出现意外的 UI 状态。
       */
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
)
