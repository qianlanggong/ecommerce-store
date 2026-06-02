import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Cart } from '@/types'

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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      isDrawerOpen: false,
      optimisticCart: null,

      setCartId: (id) => set({ cartId: id }),

      clearCart: () => set({ cartId: null, optimisticCart: null }),

      openDrawer: () => set({ isDrawerOpen: true }),

      closeDrawer: () => set({ isDrawerOpen: false }),

      toggleDrawer: () => set({ isDrawerOpen: !get().isDrawerOpen }),

      setOptimisticCart: (cart) => set({ optimisticCart: cart }),

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
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
)
