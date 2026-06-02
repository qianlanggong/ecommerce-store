import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useFavoritesStore, validateFavoriteIds } from './favoritesStore'
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

  describe('input validation', () => {
    it('should ignore empty string productId', () => {
      useFavoritesStore.getState().addFavorite('')
      expect(getCount()).toBe(0)

      useFavoritesStore.getState().toggleFavorite('')
      expect(getCount()).toBe(0)

      useFavoritesStore.getState().removeFavorite('')
      expect(getCount()).toBe(0)

      expect(useFavoritesStore.getState().isFavorite('')).toBe(false)
    })

    it('should ignore non-string productId', () => {
      useFavoritesStore.getState().addFavorite(null as unknown as string)
      expect(getCount()).toBe(0)

      useFavoritesStore.getState().addFavorite(undefined as unknown as string)
      expect(getCount()).toBe(0)

      useFavoritesStore.getState().addFavorite(123 as unknown as string)
      expect(getCount()).toBe(0)
    })

    it('should ignore whitespace-only productId', () => {
      useFavoritesStore.getState().addFavorite('   ')
      expect(getCount()).toBe(0)
    })
  })

  describe('validateFavoriteIds function', () => {
    it('should return empty array for non-array input', () => {
      expect(validateFavoriteIds(null)).toEqual([])
      expect(validateFavoriteIds(undefined)).toEqual([])
      expect(validateFavoriteIds('not-an-array')).toEqual([])
      expect(validateFavoriteIds(123)).toEqual([])
      expect(validateFavoriteIds({})).toEqual([])
    })

    it('should filter out non-string values', () => {
      const input = ['valid-id', 123, null, undefined, true, {}, [], 'another-valid']
      const result = validateFavoriteIds(input)
      expect(result).toContain('valid-id')
      expect(result).toContain('another-valid')
      expect(result).toHaveLength(2)
    })

    it('should filter out empty and whitespace-only strings', () => {
      const input = ['valid-id', '', '   ', '\t', '\n', 'another-valid']
      const result = validateFavoriteIds(input)
      expect(result).toContain('valid-id')
      expect(result).toContain('another-valid')
      expect(result).toHaveLength(2)
    })

    it('should return valid string array as-is', () => {
      const input = ['id-1', 'id-2', 'id-3']
      const result = validateFavoriteIds(input)
      expect(result).toEqual(input)
      expect(result).toHaveLength(3)
    })

    it('should return empty array for empty input', () => {
      expect(validateFavoriteIds([])).toEqual([])
    })
  })

  describe('race condition handling', () => {
    it('should handle rapid consecutive toggle calls correctly', () => {
      const store = useFavoritesStore.getState()
      
      for (let i = 0; i < 10; i++) {
        store.toggleFavorite('product-1')
      }
      
      expect(getCount()).toBe(0)
      expect(isFav('product-1')).toBe(false)
    })

    it('should handle rapid consecutive add calls correctly', () => {
      const store = useFavoritesStore.getState()
      
      for (let i = 0; i < 10; i++) {
        store.addFavorite('product-1')
      }
      
      expect(getCount()).toBe(1)
      expect(isFav('product-1')).toBe(true)
    })

    it('should handle mixed rapid add/remove calls correctly', () => {
      const store = useFavoritesStore.getState()
      
      store.addFavorite('product-1')
      store.addFavorite('product-2')
      store.removeFavorite('product-1')
      store.addFavorite('product-3')
      store.removeFavorite('product-2')
      
      expect(getCount()).toBe(1)
      expect(isFav('product-1')).toBe(false)
      expect(isFav('product-2')).toBe(false)
      expect(isFav('product-3')).toBe(true)
    })
  })
})
