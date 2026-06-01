import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { IEcommerceAdapter } from './adapters/interface'
import { createShopifyAdapter } from './adapters/shopify'
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
  MailingAddressInput,
  AuthState,
} from '@/types'

const adapter: IEcommerceAdapter = createShopifyAdapter()

const ACCESS_TOKEN_STORAGE_KEY = 'customer_access_token'
const ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY = 'customer_access_token_expires_at'

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  orders: () => [...userKeys.all, 'orders'] as const,
  addresses: () => [...userKeys.all, 'addresses'] as const,
}

function getAccessToken(): string | null {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  const expiresAt = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY)

  if (token && expiresAt) {
    const now = new Date()
    const expiry = new Date(expiresAt)
    if (now >= expiry) {
      clearAccessToken()
      return null
    }
  }

  return token
}

function setAccessToken(token: string, expiresAt: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY, expiresAt)
}

function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_STORAGE_KEY)
}

export function useIsAuthenticated(): boolean {
  return !!getAccessToken()
}

export function useCustomer() {
  const accessToken = getAccessToken()

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      if (!accessToken) return null
      return adapter.getCustomer(accessToken)
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
  })
}

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

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await adapter.login(email, password)
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

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  const accessToken = getAccessToken()

  return useMutation({
    mutationFn: (input: CustomerUpdateInput) => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateCustomer(accessToken, input)
    },
    onSuccess: (result) => {
      if (result.customer) {
        queryClient.setQueryData(userKeys.profile(), result.customer)
      }
    },
  })
}

export function useRecoverPassword() {
  return useMutation({
    mutationFn: (email: string) => adapter.recoverCustomer(email),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({ password, resetToken }: { password: string; resetToken: string }) =>
      adapter.resetPassword(password, resetToken),
  })
}

export function useCreateAddress() {
  const queryClient = useQueryClient()
  const accessToken = getAccessToken()

  return useMutation({
    mutationFn: (address: MailingAddressInput) => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.createCustomerAddress(accessToken, address)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export function useUpdateAddress() {
  const queryClient = useQueryClient()
  const accessToken = getAccessToken()

  return useMutation({
    mutationFn: ({ addressId, address }: { addressId: string; address: MailingAddressInput }) => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateCustomerAddress(accessToken, addressId, address)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export function useDeleteAddress() {
  const queryClient = useQueryClient()
  const accessToken = getAccessToken()

  return useMutation({
    mutationFn: (addressId: string) => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.deleteCustomerAddress(accessToken, addressId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile() })
    },
  })
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient()
  const accessToken = getAccessToken()

  return useMutation({
    mutationFn: (addressId: string) => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateDefaultCustomerAddress(accessToken, addressId)
    },
    onSuccess: (result) => {
      if (result.customer) {
        queryClient.setQueryData(userKeys.profile(), result.customer)
      }
    },
  })
}

export function useOrders(first: number = 10) {
  const accessToken = getAccessToken()

  return useQuery({
    queryKey: userKeys.orders(),
    queryFn: () => {
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.getOrders(accessToken, first)
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
  })
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: [...userKeys.orders(), orderId],
    queryFn: () => adapter.getOrder(orderId),
    enabled: !!orderId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAuthState(): AuthState {
  const { data: customer, isLoading, error } = useCustomer()
  const accessToken = getAccessToken()

  return {
    customer: customer || null,
    accessToken,
    isAuthenticated: !!accessToken && !isLoading && !!customer,
    isLoading,
    error: error?.message || null,
  }
}

export { adapter }
