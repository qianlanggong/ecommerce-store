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

export const validateFavoriteIds = (ids: unknown): string[] => {
  if (!Array.isArray(ids)) return []
  return ids.filter((id): id is string => typeof id === 'string' && id.trim() !== '')
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      addFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => {
          if (state.favoriteIds.includes(productId)) return state
          if (state.favoriteIds.length >= FAVORITES_LIMIT) return state
          return { favoriteIds: [...state.favoriteIds, productId] }
        })
      },

      removeFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        }))
      },

      toggleFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return
        set((state) => {
          if (state.favoriteIds.includes(productId)) {
            return {
              favoriteIds: state.favoriteIds.filter((id) => id !== productId),
            }
          }
          if (state.favoriteIds.length < FAVORITES_LIMIT) {
            return {
              favoriteIds: [...state.favoriteIds, productId],
            }
          }
          return state
        })
      },

      isFavorite: (productId: string) => {
        if (!productId || typeof productId !== 'string' || productId.trim() === '') return false
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
      onRehydrateStorage: () => (state) => {
        if (state && state.favoriteIds) {
          state.favoriteIds = validateFavoriteIds(state.favoriteIds)
        }
      },
    },
  ),
)
