import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'

interface CartState {
  cartId: string | null
  setCartId: (id: string | null) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      setCartId: (id) => set({ cartId: id }),
      clearCart: () => set({ cartId: null }),
    }),
    {
      name: STORAGE_KEYS.CART_ID,
    },
  ),
)
