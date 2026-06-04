// =========================================================================
// 用户服务层 - 基于 TanStack Query (React Query) 的封装
// =========================================================================
// 服务层职责：
// 1. 封装适配器层 + React Query Hooks
// 统一管理
// 2. 数据缓存策略
// 3. 组件直接调用适配器

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import { useUserStore } from '@/stores/userStore'
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
  MailingAddressInput,
  AuthState,
  Order,
} from '@/types'

// =========================================================================
// Query Keys - 用于 React Query 缓存键定义
// 规范：使用层级结构，便于批量失效和精确匹配
// =========================================================================

/**
 * React Query 缓存键定义
 * 
 * 采用层级结构设计：
 * - all: 顶级键，用于批量失效所有用户相关数据
 * - profile: 用户信息
 * - orders: 订单列表
 * - addresses: 地址列表
 * 
 * 使用 as const 确保类型安全
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  orders: () => [...userKeys.all, 'orders'] as const,
  addresses: () => [...userKeys.all, 'addresses'] as const,
}

// =========================================================================
// 本地辅助函数
// =========================================================================

/**
 * 获取当前有效的访问令牌
 * 
 * 直接从 store 的 getState() 获取最新状态，
 * 避免在组件渲染周期外获取状态（如 mutation 中）获取。
 * 
 * @returns 访问令牌，如果无效返回 null
 */
function getAccessToken(): string | null {
  return useUserStore.getState().getValidAccessToken()
}

/**
 * 保存访问令牌到 store
 * 
 * @param token - 访问令牌
 * @param expiresAt - 过期时间
 */
function setAccessToken(token: string, expiresAt: string): void {
  useUserStore.getState().setAccessToken(token, expiresAt)
}

/**
 * 清除用户认证信息
 * 
 * 登出时调用，清除 store 中的所有用户相关数据。
 */
function clearAccessToken(): void {
  useUserStore.getState().clearUser()
}

// =========================================================================
// 认证状态查询
// =========================================================================

/**
 * 检查用户是否已认证
 * 
 * 通过检查访问令牌是否存在且未过期。
 * 直接从 store 选择器，
 * 组件重渲染。
 * 
 * @returns true 表示已认证且令牌有效
 */
export function useIsAuthenticated(): boolean {
  return useUserStore((state) => {
    if (!state.accessToken || !state.accessTokenExpiresAt) return false
    const now = new Date()
    const expiry = new Date(state.accessTokenExpiresAt)
    return now < expiry
  })
}

/**
 * 获取当前登录用户信息
 * 
 * 使用 React Query 缓存用户信息，缓存 5 分钟。
 * 有有效令牌时才会执行查询。
 * 
 * @returns React Query 结果对象，包含 data、isLoading、error 等状态
 */
export function useCustomer() {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      // 在 queryFn 中再次获取令牌，确保使用最新状态
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      if (!currentAccessToken) return null
      return adapter.getCustomer(currentAccessToken)
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
  })
}

// =========================================================================
// 认证操作 Mutations
// =========================================================================

/**
 * 用户注册 Mutation
 * 
 * @returns Mutation 对象，可调用 mutate 触发注册
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CustomerCreateInput) => adapter.createCustomer(input),
    onSuccess: (result) => {
      if (result.customer) {
        queryClient.invalidateQueries({ queryKey: userKeys.all })
      }
    },
  })
}

/**
 * 用户登录 Mutation
 * 
 * 登录成功后：
 * 1. 保存访问令牌到 store
 * 2. 失效所有用户相关缓存
 * 
 * @returns Mutation 对象，可调用 mutate({ email, password }) 触发登录
 * @throws 如果登录失败，抛出包含错误信息的 Error 对象
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await adapter.login(email, password)
      // 处理适配器返回的用户错误
      if (result.userErrors && result.userErrors.length > 0) {
        throw new Error(result.userErrors[0].message || 'Login failed')
      }
      // 登录成功，保存令牌
      if (result.customerAccessToken) {
        setAccessToken(result.customerAccessToken.accessToken, result.customerAccessToken.expiresAt)
      }
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all })
    },
  })
}

/**
 * 用户登出 Mutation
 * 
 * 登出流程：
 * 1. 调用后端登出接口（如果有令牌）
 * 2. 清除本地认证信息
 * 3. 清除所有 React Query 缓存
 * 
 * @returns Mutation 对象
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const accessToken = getAccessToken()
      if (accessToken) {
        await adapter.logout(accessToken)
      }
      clearAccessToken()
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}

/**
 * 更新用户信息 Mutation
 * 
 * 成功后自动更新缓存和 store 中的用户信息。
 * 
 * @returns Mutation 对象
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CustomerUpdateInput) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateCustomer(accessToken, input)
    },
    onSuccess: (result) => {
      if (result.customer) {
        // 乐观更新：直接更新缓存，避免重新查询
        queryClient.setQueryData(userKeys.profile(), result.customer)
        useUserStore.getState().setCustomer(result.customer)
      }
    },
  })
}

// =========================================================================
// 密码相关 Mutations
// =========================================================================

/**
 * 发送密码重置邮件 Mutation
 * 
 * @returns Mutation 对象，调用 mutate(email) 发送重置邮件
 */
export function useRecoverPassword() {
  return useMutation({
    mutationFn: (email: string) => adapter.recoverCustomer(email),
  })
}

/**
 * 重置密码 Mutation
 * 
 * @returns Mutation 对象，调用 mutate({ password, resetToken }) 重置密码
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ password, resetToken }: { password: string; resetToken: string }) =>
      adapter.resetPassword(password, resetToken),
  })
}

// =========================================================================
// 地址管理 Mutations
// =========================================================================

/**
 * 创建用户地址 Mutation
 * 
 * 成功后失效用户信息缓存，触发重新获取。
 * 
 * @returns Mutation 对象
 */
export function useCreateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (address: MailingAddressInput) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.createCustomerAddress(accessToken, address)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

/**
 * 更新用户地址 Mutation
 * 
 * @returns Mutation 对象，调用 mutate({ addressId, address }) 更新地址
 */
export function useUpdateAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: MailingAddressInput }) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateCustomerAddress(accessToken, addressId, address)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

/**
 * 删除用户地址 Mutation
 * 
 * @returns Mutation 对象，调用 mutate(addressId) 删除地址
 */
export function useDeleteAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.deleteCustomerAddress(accessToken, addressId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

/**
 * 设置默认地址 Mutation
 * 
 * 成功后自动更新缓存和 store 中的用户信息。
 * 
 * @returns Mutation 对象，调用 mutate(addressId) 设置默认地址
 */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (addressId: string) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateDefaultCustomerAddress(accessToken, addressId)
    },
    onSuccess: (result) => {
      if (result.customer) {
        queryClient.setQueryData(userKeys.profile(), result.customer)
        useUserStore.getState().setCustomer(result.customer)
      }
    },
  })
}

// =========================================================================
// 订单相关 Queries
// =========================================================================

/**
 * 获取用户订单列表 Query
 * 
 * 使用 React Query 缓存订单列表，缓存 2 分钟。
 * 只有在用户已认证且有有效令牌时才会执行查询。
 * 
 * 注意：
 * - 在 queryFn 中再次获取令牌，确保使用最新状态（避免闭包捕获旧值）。
 * 
 * @param first - 返回的订单数量，默认 10 条
 * @returns React Query 结果对象
 */
export function useOrders(first: number = 10) {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: userKeys.orders(),
    queryFn: () => {
      // 在 queryFn 中再次获取令牌，确保使用最新状态
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      if (!currentAccessToken) throw new Error('Not authenticated')
      return adapter.getOrders(currentAccessToken, first)
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000, // 2 分钟缓存
  })
}

/**
 * 获取单个订单详情 Query
 * 
 * 使用 React Query 缓存订单详情，缓存 5 分钟。
 * 订单 ID 存在时才会执行查询。
 * 
 * @param orderId - 订单 ID
 * @returns React Query 结果对象
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [...userKeys.orders(), orderId],
    queryFn: (): Promise<Order | null> => adapter.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
  })
}

// =========================================================================
// 认证状态聚合
// =========================================================================

/**
 * 获取完整的认证状态
 * 
 * 聚合多个状态：
 * - 用户信息
 * - 认证状态
 * - 加载状态
 * - 错误信息
 * 
 * 用于需要完整认证状态的场景（如路由守卫）。
 * 
 * @returns AuthState 对象，包含完整的认证相关信息
 */
export function useAuthState(): AuthState {
  const { data: customer, isLoading, error } = useCustomer()
  const isAuthenticated = useIsAuthenticated()
  const accessToken = useUserStore((state) => state.accessToken)

  return {
    customer: customer || null,
    accessToken,
    // 必须同时满足：令牌有效 + 未加载中 + 用户信息存在
    isAuthenticated: isAuthenticated && !isLoading && !!customer,
    isLoading,
    error: error?.message || null,
  }
}

// 导出适配器实例，供特殊场景直接使用
export { adapter }
