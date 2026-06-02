import { useCallback, useMemo } from 'react'
import {
  useCart,
  useAddCartLines,
  useUpdateCartLines,
  useRemoveCartLines,
  useCreateCart,
} from '@/services/cartService'
import { useCartStore } from '@/stores/cartStore'
import { getAllMockProducts } from '@/mocks/products'
import type { CartLineInput, Product, ProductVariant } from '@/types'

function findProductByVariantId(variantId: string): Product | null {
  const products = getAllMockProducts()
  for (const product of products) {
    for (const edge of product.variants.edges) {
      if (edge.node.id === variantId) {
        return product
      }
    }
  }
  return null
}

function getProductImageUrl(variant: ProductVariant): string {
  if (variant.image?.url) {
    return variant.image.url
  }
  const product = findProductByVariantId(variant.id)
  if (product?.featuredImage?.url) {
    return product.featuredImage.url
  }
  if (product?.images.edges.length > 0) {
    return product.images.edges[0].node.url
  }
  return ''
}

function getProductTitle(variant: ProductVariant): string {
  const product = findProductByVariantId(variant.id)
  return product?.title || variant.title
}

export function useCartActions() {
  const { data: cart, isLoading } = useCart()
  const addCartLines = useAddCartLines()
  const updateCartLines = useUpdateCartLines()
  const removeCartLines = useRemoveCartLines()
  const createCart = useCreateCart()
  const { optimisticCart, setOptimisticCart, updateOptimisticLine, removeOptimisticLine } =
    useCartStore()

  const displayCart = optimisticCart || cart

  const addToCart = useCallback(
    async (lines: CartLineInput[]) => {
      const result = await addCartLines.mutateAsync(lines)
      setOptimisticCart(result)
      return result
    },
    [addCartLines, setOptimisticCart],
  )

  const removeLine = useCallback(
    async (lineId: string) => {
      removeOptimisticLine(lineId)
      try {
        const result = await removeCartLines.mutateAsync([lineId])
        setOptimisticCart(result)
        return result
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    },
    [removeCartLines, removeOptimisticLine, setOptimisticCart, cart],
  )

  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        return removeLine(lineId)
      }
      updateOptimisticLine(lineId, quantity)
      try {
        const result = await updateCartLines.mutateAsync([{ id: lineId, quantity }])
        setOptimisticCart(result)
        return result
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    },
    [updateCartLines, updateOptimisticLine, setOptimisticCart, cart, removeLine],
  )

  const clearCart = useCallback(async () => {
    if (!displayCart) return
    const lineIds = displayCart.lines.edges.map((e) => e.node.id)
    if (lineIds.length > 0) {
      setOptimisticCart(null)
      try {
        await removeCartLines.mutateAsync(lineIds)
      } catch (error) {
        setOptimisticCart(cart || null)
        throw error
      }
    }
  }, [displayCart, removeCartLines, setOptimisticCart, cart])

  const createNewCart = useCallback(
    async (lines?: CartLineInput[]) => {
      const result = await createCart.mutateAsync(lines ? { lines } : undefined)
      setOptimisticCart(result)
      return result
    },
    [createCart, setOptimisticCart],
  )

  const cartLines = useMemo(() => {
    return (displayCart?.lines.edges.map((e) => e.node) || []).map((line) => ({
      ...line,
      productTitle: getProductTitle(line.merchandise),
      productImageUrl: getProductImageUrl(line.merchandise),
    }))
  }, [displayCart])

  const totalQuantity = displayCart?.totalQuantity || 0
  const subtotal = displayCart?.estimatedCost.subtotalAmount
  const total = displayCart?.estimatedCost.totalAmount
  const tax = displayCart?.estimatedCost.taxAmount
  const checkoutUrl = displayCart?.checkoutUrl || '/checkout'

  return {
    cart: displayCart,
    cartLines,
    isLoading,
    totalQuantity,
    subtotal,
    total,
    tax,
    checkoutUrl,
    addToCart,
    updateQuantity,
    removeLine,
    clearCart,
    createNewCart,
  }
}
