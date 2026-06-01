import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavoritesStore } from './favoritesStore'
import { STORAGE_KEYS, FAVORITES_LIMIT } from '@/lib/constants'

describe('favoritesStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useFavoritesStore.setState({ favoriteIds: [] })
  })

  const getFavorites = () => useFavoritesStore.getState().favoriteIds
  const getCount = () => useFavoritesStore.getState().getFavoritesCount()
  const isFav = (id: string) => useFavoritesStore.getState().isFavorite(id)

  it('should initialize with empty favorites', () => {
    expect(getFavorites()).toEqual([])
    expect(getCount()).toBe(0)
  })

  it('should add a product to favorites', () => {
    useFavoritesStore.getState().addFavorite('product-1')

    expect(getFavorites()).toContain('product-1')
    expect(isFav('product-1')).toBe(true)
    expect(getCount()).toBe(1)
  })

  it('should not add duplicate products to favorites', () => {
    useFavoritesStore.getState().addFavorite('product-1')
    useFavoritesStore.getState().addFavorite('product-1')

    expect(getCount()).toBe(1)
  })

  it('should remove a product from favorites', () => {
    useFavoritesStore.getState().addFavorite('product-1')
    useFavoritesStore.getState().addFavorite('product-2')
    useFavoritesStore.getState().removeFavorite('product-1')

    expect(getFavorites()).toContain('product-2')
    expect(isFav('product-1')).toBe(false)
    expect(isFav('product-2')).toBe(true)
    expect(getCount()).toBe(1)
  })

  it('should toggle favorite status', () => {
    useFavoritesStore.getState().toggleFavorite('product-1')
    expect(isFav('product-1')).toBe(true)
    expect(getCount()).toBe(1)

    useFavoritesStore.getState().toggleFavorite('product-1')
    expect(isFav('product-1')).toBe(false)
    expect(getCount()).toBe(0)
  })

  it('should clear all favorites', () => {
    useFavoritesStore.getState().addFavorite('product-1')
    useFavoritesStore.getState().addFavorite('product-2')
    expect(getCount()).toBe(2)

    useFavoritesStore.getState().clearFavorites()
    expect(getFavorites()).toEqual([])
    expect(getCount()).toBe(0)
  })

  it('should check if product is favorite', () => {
    useFavoritesStore.getState().addFavorite('product-1')
    expect(isFav('product-1')).toBe(true)
    expect(isFav('product-2')).toBe(false)
  })

  it('should get correct favorites count', () => {
    expect(getCount()).toBe(0)
    useFavoritesStore.getState().addFavorite('product-1')
    expect(getCount()).toBe(1)
    useFavoritesStore.getState().addFavorite('product-2')
    expect(getCount()).toBe(2)
    useFavoritesStore.getState().removeFavorite('product-1')
    expect(getCount()).toBe(1)
  })

  it('should enforce favorites limit', () => {
    for (let i = 0; i < FAVORITES_LIMIT; i++) {
      useFavoritesStore.getState().addFavorite(`product-${i}`)
    }
    expect(getCount()).toBe(FAVORITES_LIMIT)

    useFavoritesStore.getState().addFavorite('product-over-limit')
    expect(getCount()).toBe(FAVORITES_LIMIT)
    expect(isFav('product-over-limit')).toBe(false)
  })

  it('should persist favorites to localStorage', async () => {
    useFavoritesStore.getState().addFavorite('product-1')
    useFavoritesStore.getState().addFavorite('product-2')

    await vi.waitFor(
      () => {
        const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES)
        expect(stored).toBeTruthy()
        const parsed = JSON.parse(stored!)
        expect(parsed.state.favoriteIds).toContain('product-1')
        expect(parsed.state.favoriteIds).toContain('product-2')
      },
      { timeout: 2000 },
    )
  })

  it('should remove non-existent product gracefully', () => {
    useFavoritesStore.getState().addFavorite('product-1')
    const countBefore = getCount()

    useFavoritesStore.getState().removeFavorite('non-existent')
    expect(getCount()).toBe(countBefore)
    expect(isFav('product-1')).toBe(true)
  })

  it('should handle edge case when removing from empty favorites', () => {
    useFavoritesStore.getState().removeFavorite('product-1')
    expect(getFavorites()).toEqual([])
    expect(getCount()).toBe(0)
  })
})
