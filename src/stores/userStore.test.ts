import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserStore } from './userStore'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Customer } from '@/types'

const mockCustomer: Customer = {
  id: 'gid://shopify/Customer/123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  displayName: 'John Doe',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-06-01T00:00:00Z',
  addresses: {
    edges: [],
  },
  defaultAddress: null,
  orders: {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
    },
  },
  numberOfOrders: 0,
  acceptsMarketing: false,
  tags: [],
}

describe('userStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
    })
  })

  const getState = () => useUserStore.getState()

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(getState().customer).toBeNull()
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()
    })
  })

  describe('setCustomer', () => {
    it('should set customer', () => {
      getState().setCustomer(mockCustomer)
      expect(getState().customer).toEqual(mockCustomer)
    })

    it('should set customer to null', () => {
      getState().setCustomer(mockCustomer)
      expect(getState().customer).toEqual(mockCustomer)

      getState().setCustomer(null)
      expect(getState().customer).toBeNull()
    })
  })

  describe('setAccessToken', () => {
    it('should set access token without expiry', () => {
      getState().setAccessToken('test-token')
      expect(getState().accessToken).toBe('test-token')
      expect(getState().accessTokenExpiresAt).toBeNull()
    })

    it('should set access token with expiry', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('test-token', expiry)
      expect(getState().accessToken).toBe('test-token')
      expect(getState().accessTokenExpiresAt).toBe(expiry)
    })

    it('should set access token to null', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('test-token', expiry)

      getState().setAccessToken(null)
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()
    })

    it('should override existing token and expiry', () => {
      const oldExpiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('old-token', oldExpiry)

      const newExpiry = new Date(Date.now() + 7200000).toISOString()
      getState().setAccessToken('new-token', newExpiry)

      expect(getState().accessToken).toBe('new-token')
      expect(getState().accessTokenExpiresAt).toBe(newExpiry)
    })
  })

  describe('clearUser', () => {
    it('should clear all user data', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setCustomer(mockCustomer)
      getState().setAccessToken('test-token', expiry)

      expect(getState().customer).toEqual(mockCustomer)
      expect(getState().accessToken).toBe('test-token')
      expect(getState().accessTokenExpiresAt).toBe(expiry)

      getState().clearUser()

      expect(getState().customer).toBeNull()
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()
    })

    it('should handle clear on already cleared state', () => {
      getState().clearUser()
      expect(getState().customer).toBeNull()
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()
    })
  })

  describe('getAccessToken', () => {
    it('should return access token when set', () => {
      getState().setAccessToken('test-token')
      expect(getState().getAccessToken()).toBe('test-token')
    })

    it('should return null when no token set', () => {
      expect(getState().getAccessToken()).toBeNull()
    })
  })

  describe('getAccessTokenExpiresAt', () => {
    it('should return expiry when set', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('test-token', expiry)
      expect(getState().getAccessTokenExpiresAt()).toBe(expiry)
    })

    it('should return null when no expiry set', () => {
      getState().setAccessToken('test-token')
      expect(getState().getAccessTokenExpiresAt()).toBeNull()
    })
  })

  describe('getValidAccessToken', () => {
    it('should return access token when valid', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('valid-token', expiry)
      expect(getState().getValidAccessToken()).toBe('valid-token')
    })

    it('should return null when token is missing', () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken(null, expiry)
      expect(getState().getValidAccessToken()).toBeNull()
    })

    it('should return null when expiry is missing', () => {
      getState().setAccessToken('test-token', null)
      expect(getState().getValidAccessToken()).toBeNull()
    })

    it('should return null and clear user when token is expired', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-01T00:00:00Z'))

      const expiredExpiry = new Date('2026-05-31T00:00:00Z').toISOString()
      getState().setCustomer(mockCustomer)
      getState().setAccessToken('expired-token', expiredExpiry)

      const result = getState().getValidAccessToken()
      expect(result).toBeNull()
      expect(getState().customer).toBeNull()
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()

      vi.useRealTimers()
    })

    it('should return null and clear user when token is exactly at expiry', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))

      const exactExpiry = new Date('2026-06-01T12:00:00Z').toISOString()
      getState().setCustomer(mockCustomer)
      getState().setAccessToken('expiring-token', exactExpiry)

      const result = getState().getValidAccessToken()
      expect(result).toBeNull()
      expect(getState().customer).toBeNull()
      expect(getState().accessToken).toBeNull()
      expect(getState().accessTokenExpiresAt).toBeNull()

      vi.useRealTimers()
    })

    it('should return token when expiry is in the future', () => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))

      const futureExpiry = new Date('2026-06-02T12:00:00Z').toISOString()
      getState().setCustomer(mockCustomer)
      getState().setAccessToken('valid-token', futureExpiry)

      const result = getState().getValidAccessToken()
      expect(result).toBe('valid-token')
      expect(getState().customer).toEqual(mockCustomer)
      expect(getState().accessToken).toBe('valid-token')
      expect(getState().accessTokenExpiresAt).toBe(futureExpiry)

      vi.useRealTimers()
    })

    it('should return null when both token and expiry are missing', () => {
      expect(getState().getValidAccessToken()).toBeNull()
    })
  })

  describe('persistence', () => {
    it('should persist access token and expiry to localStorage', async () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setAccessToken('persisted-token', expiry)

      await vi.waitFor(
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN)
          expect(stored).toBeTruthy()
          const parsed = JSON.parse(stored!)
          expect(parsed.state.accessToken).toBe('persisted-token')
          expect(parsed.state.accessTokenExpiresAt).toBe(expiry)
        },
        { timeout: 2000 },
      )
    })

    it('should NOT persist customer to localStorage', async () => {
      const expiry = new Date(Date.now() + 3600000).toISOString()
      getState().setCustomer(mockCustomer)
      getState().setAccessToken('test-token', expiry)

      await vi.waitFor(
        () => {
          const stored = localStorage.getItem(STORAGE_KEYS.CUSTOMER_ACCESS_TOKEN)
          expect(stored).toBeTruthy()
          const parsed = JSON.parse(stored!)
          expect(parsed.state.accessToken).toBe('test-token')
          expect(parsed.state.accessTokenExpiresAt).toBe(expiry)
          expect(parsed.state.customer).toBeUndefined()
        },
        { timeout: 2000 },
      )
    })
  })
})
