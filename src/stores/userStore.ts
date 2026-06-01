import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Customer } from '@/types'

interface UserState {
  customer: Customer | null
  accessToken: string | null
  accessTokenExpiresAt: string | null
  setCustomer: (customer: Customer | null) => void
  setAccessToken: (token: string | null, expiresAt?: string | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
      setCustomer: (customer) => set({ customer }),
      setAccessToken: (token, expiresAt = null) =>
        set({
          accessToken: token,
          accessTokenExpiresAt: expiresAt,
        }),
      clearUser: () =>
        set({
          customer: null,
          accessToken: null,
          accessTokenExpiresAt: null,
        }),
    }),
    {
      name: STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN,
      partialize: (state) => ({
        accessToken: state.accessToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
      }),
    },
  ),
)
