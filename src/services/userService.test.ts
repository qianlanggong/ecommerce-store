import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { userKeys, useIsAuthenticated } from './userService'
import { useUserStore } from '@/stores/userStore'

describe('userKeys', () => {
  it('should generate correct all key', () => {
    expect(userKeys.all).toEqual(['user'])
  })

  it('should generate correct profile key', () => {
    expect(userKeys.profile()).toEqual(['user', 'profile'])
  })

  it('should generate correct orders key', () => {
    expect(userKeys.orders()).toEqual(['user', 'orders'])
  })

  it('should generate correct addresses key', () => {
    expect(userKeys.addresses()).toEqual(['user', 'addresses'])
  })
})

describe('useIsAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    useUserStore.setState({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
    })
    localStorage.clear()
  })

  it('should return false when no access token', () => {
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)
  })

  it('should return false when access token exists but no expiry', () => {
    useUserStore.setState({
      accessToken: 'test-token',
      accessTokenExpiresAt: null,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)
  })

  it('should return false when expiry exists but no access token', () => {
    const expiry = new Date(Date.now() + 3600000).toISOString()
    useUserStore.setState({
      accessToken: null,
      accessTokenExpiresAt: expiry,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)
  })

  it('should return true when token is valid and not expired', () => {
    const expiry = new Date(Date.now() + 3600000).toISOString()
    useUserStore.setState({
      accessToken: 'valid-token',
      accessTokenExpiresAt: expiry,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(true)
  })

  it('should return false when token is expired', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))

    const expiredExpiry = new Date('2026-06-01T11:00:00Z').toISOString()
    useUserStore.setState({
      accessToken: 'expired-token',
      accessTokenExpiresAt: expiredExpiry,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)
  })

  it('should return false when token is exactly at expiry time', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))

    const exactExpiry = new Date('2026-06-01T12:00:00Z').toISOString()
    useUserStore.setState({
      accessToken: 'expiring-token',
      accessTokenExpiresAt: exactExpiry,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(false)
  })

  it('should return true when expiry is in the future', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))

    const futureExpiry = new Date('2026-06-01T13:00:00Z').toISOString()
    useUserStore.setState({
      accessToken: 'valid-token',
      accessTokenExpiresAt: futureExpiry,
    })
    const { result } = renderHook(() => useIsAuthenticated())
    expect(result.current).toBe(true)
  })
})

describe('token retrieval pattern', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    useUserStore.setState({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,
    })
    localStorage.clear()
  })

  it('should use getState() for token retrieval to avoid closure issues', () => {
    const expiry = new Date(Date.now() + 3600000).toISOString()
    useUserStore.getState().setAccessToken('initial-token', expiry)

    const getValidAccessTokenSpy = vi.spyOn(useUserStore.getState(), 'getValidAccessToken')

    // 模拟 mutationFn 的模式 - 在函数内部调用 getState()
    const mutationFn = () => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      return accessToken
    }

    // 第一次调用
    const result1 = mutationFn()
    expect(result1).toBe('initial-token')
    expect(getValidAccessTokenSpy).toHaveBeenCalled()

    // 更新 token
    getValidAccessTokenSpy.mockClear()
    useUserStore.getState().setAccessToken('new-token', expiry)

    // 第二次调用应该获取到新的 token，说明没有被闭包捕获
    const result2 = mutationFn()
    expect(result2).toBe('new-token')
    expect(getValidAccessTokenSpy).toHaveBeenCalled()
  })
})
