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
  getAccessToken: () => string | null
  getAccessTokenExpiresAt: () => string | null
  getValidAccessToken: () => string | null
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
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
      getAccessToken: () => get().accessToken,
      getAccessTokenExpiresAt: () => get().accessTokenExpiresAt,
      getValidAccessToken: () => {
        const { accessToken, accessTokenExpiresAt } = get()
        if (!accessToken || !accessTokenExpiresAt) return null
        const now = new Date()
        const expiry = new Date(accessTokenExpiresAt)
        if (now >= expiry) {
          get().clearUser()
          return null
        }
        return accessToken
      },
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
