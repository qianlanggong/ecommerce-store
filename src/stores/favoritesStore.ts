import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS, FAVORITES_LIMIT } from '@/lib/constants'

interface FavoritesState {
  favoriteIds: string[]
  addFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  clearFavorites: () => void
  getFavoritesCount: () => number
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (productId: string) => {
        set((state) => {
          if (state.favoriteIds.includes(productId)) return state
          if (state.favoriteIds.length >= FAVORITES_LIMIT) return state
          return {
            favoriteIds: [...state.favoriteIds, productId],
          }
        })
      },

      removeFavorite: (productId: string) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        }))
      },

      toggleFavorite: (productId: string) => {
        const { isFavorite, addFavorite, removeFavorite } = get()
        if (isFavorite(productId)) {
          removeFavorite(productId)
        } else {
          addFavorite(productId)
        }
      },

      isFavorite: (productId: string) => {
        return get().favoriteIds.includes(productId)
      },

      clearFavorites: () => {
        set({ favoriteIds: [] })
      },

      getFavoritesCount: () => {
        return get().favoriteIds.length
      },
    }),
    {
      name: STORAGE_KEYS.FAVORITES,
    },
  ),
)
