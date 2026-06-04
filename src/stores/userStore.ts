import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/lib/constants'
import type { Customer } from '@/types'

/**
 * 用户状态接口
 *
 * 管理用户认证状态和用户信息，包括：
 * - 用户基本信息
 * - 访问令牌及其过期时间
 * - 认证相关的操作方法
 *
 * 设计考虑：
 * 1. 使用 Zustand 进行状态管理，简单轻量
 * 2. 通过 persist 中间件持久化令牌到 localStorage
 * 3. 仅持久化必要字段（令牌和过期时间），不持久化用户信息
 *    避免敏感信息本地存储，用户信息每次从后端获取
 */
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

/**
 * 用户状态 Store
 *
 * 使用 Zustand 创建的用户状态管理 store，集成 persist 中间件
 * 实现令牌的本地持久化。
 *
 * 持久化策略：
 * - 仅持久化 accessToken 和 accessTokenExpiresAt
 * - customer 信息不持久化，每次进入应用重新获取
 * - 存储键由 STORAGE_KEYS 统一管理
 *
 * 安全考虑：
 * - 令牌过期后自动清除
 * - 不存储密码等敏感信息
 * - 登出时清除所有状态
 */
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      customer: null,
      accessToken: null,
      accessTokenExpiresAt: null,

      /**
       * 设置用户信息
       *
       * 在登录成功或获取用户信息后调用，更新 store 中的用户数据。
       * 传入 null 表示清除用户信息。
       *
       * @param customer - 用户信息对象，或 null 清除
       */
      setCustomer: (customer) => set({ customer }),

      /**
       * 设置访问令牌
       *
       * 登录成功后保存令牌及其过期时间。
       * 此状态会被持久化到 localStorage。
       *
       * @param token - 访问令牌字符串，或 null 清除
       * @param expiresAt - 令牌过期时间（ISO 格式字符串），可选
       */
      setAccessToken: (token, expiresAt = null) =>
        set({
          accessToken: token,
          accessTokenExpiresAt: expiresAt,
        }),

      /**
       * 清除所有用户状态
       *
       * 登出时调用，清除：
       * - 用户信息
       * - 访问令牌
       * - 令牌过期时间
       *
       * 注意：persist 中间件会自动同步清除 localStorage 中的数据。
       */
      clearUser: () =>
        set({
          customer: null,
          accessToken: null,
          accessTokenExpiresAt: null,
        }),

      /**
       * 获取访问令牌
       *
       * 直接返回存储的令牌，不验证有效性。
       * 大多数场景应使用 getValidAccessToken 确保令牌有效。
       *
       * @returns 访问令牌字符串，不存在则返回 null
       */
      getAccessToken: () => get().accessToken,

      /**
       * 获取令牌过期时间
       *
       * @returns 过期时间 ISO 字符串，不存在则返回 null
       */
      getAccessTokenExpiresAt: () => get().accessTokenExpiresAt,

      /**
       * 获取有效的访问令牌
       *
       * 核心认证方法，验证令牌是否存在且未过期。
       * 如果令牌已过期，自动清除所有用户状态。
       *
       * 验证逻辑：
       * 1. 检查令牌和过期时间是否都存在
       * 2. 比较当前时间与过期时间
       * 3. 已过期则清除状态并返回 null
       * 4. 未过期则返回令牌
       *
       * 注意：在 queryFn 等非 React 环境中可通过
       * useUserStore.getState().getValidAccessToken() 调用。
       *
       * @returns 有效的访问令牌，无效或过期返回 null
       */
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
      /**
       * 持久化字段选择器
       *
       * 仅持久化令牌相关字段，不持久化用户信息，
       * 避免用户信息在本地长期存储。
       */
      partialize: (state) => ({
        accessToken: state.accessToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
      }),
    },
  ),
)
