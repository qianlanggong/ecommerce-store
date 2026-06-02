import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adapter } from './adapters/factory'
import { useCartStore } from '@/stores/cartStore'
import type { CartInput, CartLineInput, CartLineUpdateInput } from '@/types'

export const cartKeys = {
  all: ['cart'] as const,
  detail: (cartId: string) => [...cartKeys.all, cartId] as const,
}

function getCartId(): string | null {
  return useCartStore.getState().cartId
}

function setCartId(cartId: string): void {
  useCartStore.getState().setCartId(cartId)
}

function clearCartId(): void {
  useCartStore.getState().clearCart()
}

export function useCart() {
  const cartId = useCartStore((state) => state.cartId)

  return useQuery({
    queryKey: cartKeys.detail(cartId || 'empty'),
    queryFn: async () => {
      if (!cartId) {
        const newCart = await adapter.createCart()
        setCartId(newCart.id)
        return newCart
      }
      const cart = await adapter.getCart(cartId)
      if (!cart) {
        clearCartId()
        const newCart = await adapter.createCart()
        setCartId(newCart.id)
        return newCart
      }
      return cart
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    enabled: true,
  })
}

export function useCreateCart() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input?: CartInput) => adapter.createCart(input),
    onSuccess: (cart) => {
      setCartId(cart.id)
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

export function useAddCartLines() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (lines: CartLineInput[]) => {
      const currentCartId = getCartId()
      if (!currentCartId) {
        const newCart = await adapter.createCart({ lines })
        setCartId(newCart.id)
        return newCart
      }
      return adapter.addCartLines(currentCartId, lines)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useUpdateCartLines() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lines: CartLineUpdateInput[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartLines(cartId, lines)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useRemoveCartLines() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lineIds: string[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.removeCartLines(cartId, lineIds)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    },
  })
}

export function useUpdateCartBuyerIdentity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (buyerIdentity: {
      email?: string
      customerAccessToken?: string
      countryCode?: string
    }) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartBuyerIdentity(cartId, buyerIdentity)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

export function useUpdateCartDiscountCodes() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (discountCodes: string[]) => {
      const cartId = getCartId()
      if (!cartId) throw new Error('No cart found')
      return adapter.updateCartDiscountCodes(cartId, discountCodes)
    },
    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.detail(cart.id), cart)
    },
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()

  return () => {
    clearCartId()
    queryClient.removeQueries({ queryKey: cartKeys.all })
  }
}

export { adapter }
