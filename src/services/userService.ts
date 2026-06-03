import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import { useUserStore } from '@/stores/userStore'
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
  MailingAddressInput,
  AuthState,
} from '@/types'

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  orders: () => [...userKeys.all, 'orders'] as const,
  addresses: () => [...userKeys.all, 'addresses'] as const,
}

function getAccessToken(): string | null {
  return useUserStore.getState().getValidAccessToken()
}

function setAccessToken(token: string, expiresAt: string): void {
  useUserStore.getState().setAccessToken(token, expiresAt)
}

function clearAccessToken(): void {
  useUserStore.getState().clearUser()
}

export function useIsAuthenticated(): boolean {
  return useUserStore((state) => {
    if (!state.accessToken || !state.accessTokenExpiresAt) return false
    const now = new Date()
    const expiry = new Date(state.accessTokenExpiresAt)
    return now < expiry
  })
}

export function useCustomer() {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      if (!currentAccessToken) return null
      return adapter.getCustomer(currentAccessToken)
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
      if (result.userErrors && result.userErrors.length > 0) {
        throw new Error(result.userErrors[0].message || 'Login failed')
      }
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

  return useMutation({
    mutationFn: (input: CustomerUpdateInput) => {
      const accessToken = useUserStore.getState().getValidAccessToken()
      if (!accessToken) throw new Error('Not authenticated')
      return adapter.updateCustomer(accessToken, input)
    },
    onSuccess: (result) => {
      if (result.customer) {
        queryClient.setQueryData(userKeys.profile(), result.customer)
        useUserStore.getState().setCustomer(result.customer)
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

export function useOrders(first: number = 10) {
  const accessToken = useUserStore((state) => state.getValidAccessToken())

  return useQuery({
    queryKey: userKeys.orders(),
    queryFn: () => {
      const currentAccessToken = useUserStore.getState().getValidAccessToken()
      if (!currentAccessToken) throw new Error('Not authenticated')
      return adapter.getOrders(currentAccessToken, first)
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
  const isAuthenticated = useIsAuthenticated()
  const accessToken = useUserStore((state) => state.accessToken)

  return {
    customer: customer || null,
    accessToken,
    isAuthenticated: isAuthenticated && !isLoading && !!customer,
    isLoading,
    error: error?.message || null,
  }
}

export { adapter }
