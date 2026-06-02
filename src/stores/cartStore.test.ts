import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, beforeEach } from 'vitest'
import { useCartStore } from './cartStore'

describe('cartStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useCartStore.setState({
      cartId: null,
      isDrawerOpen: false,
      optimisticCart: null,
    })
  })

  afterEach(() => {
    useCartStore.setState({
      cartId: null,
      isDrawerOpen: false,
      optimisticCart: null,
    })
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCartStore())
      expect(result.current.cartId).toBeNull()
      expect(result.current.isDrawerOpen).toBe(false)
      expect(result.current.optimisticCart).toBeNull()
    })
  })

  describe('cartId management', () => {
    it('should set cartId', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setCartId('test-cart-id')
      })

      expect(result.current.cartId).toBe('test-cart-id')
    })

    it('should clear cartId', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setCartId('test-cart-id')
      })

      expect(result.current.cartId).toBe('test-cart-id')

      act(() => {
        result.current.clearCart()
      })

      expect(result.current.cartId).toBeNull()
      expect(result.current.optimisticCart).toBeNull()
    })
  })

  describe('drawer management', () => {
    it('should open drawer', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.openDrawer()
      })

      expect(result.current.isDrawerOpen).toBe(true)
    })

    it('should close drawer', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.openDrawer()
      })

      expect(result.current.isDrawerOpen).toBe(true)

      act(() => {
        result.current.closeDrawer()
      })

      expect(result.current.isDrawerOpen).toBe(false)
    })

    it('should toggle drawer', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.isDrawerOpen).toBe(false)

      act(() => {
        result.current.toggleDrawer()
      })

      expect(result.current.isDrawerOpen).toBe(true)

      act(() => {
        result.current.toggleDrawer()
      })

      expect(result.current.isDrawerOpen).toBe(false)
    })
  })

  describe('optimistic cart management', () => {
    const mockCart = {
      id: 'test-cart-id',
      checkoutUrl: '/checkout',
      createdAt: '2026-06-01T00:00:00Z',
      updatedAt: '2026-06-01T00:00:00Z',
      lines: {
        edges: [
          {
            node: {
              id: 'line-1',
              quantity: 2,
              merchandise: {
                id: 'v1',
                title: 'Test Variant',
                price: { amount: '29.99', currencyCode: 'USD' },
                availableForSale: true,
                quantityAvailable: 10,
                selectedOptions: [],
              },
              cost: {
                amountPerQuantity: { amount: '29.99', currencyCode: 'USD' },
                totalAmount: { amount: '59.98', currencyCode: 'USD' },
              },
              attributes: [],
            },
          },
        ],
      },
      estimatedCost: {
        subtotalAmount: { amount: '59.98', currencyCode: 'USD' },
        totalAmount: { amount: '64.78', currencyCode: 'USD' },
        taxAmount: { amount: '4.80', currencyCode: 'USD' },
        dutyAmount: { amount: '0.00', currencyCode: 'USD' },
        shippingAmount: { amount: '0.00', currencyCode: 'USD' },
        subtotalAmountEstimated: false,
        totalAmountEstimated: false,
        taxAmountEstimated: true,
        dutyAmountEstimated: false,
        shippingAmountEstimated: true,
      },
      totalQuantity: 2,
      buyerIdentity: { countryCode: 'US' },
      discountCodes: [],
      attributes: [],
    }

    it('should set optimistic cart', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setOptimisticCart(mockCart)
      })

      expect(result.current.optimisticCart).toEqual(mockCart)
    })

    it('should update optimistic line quantity', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setOptimisticCart(mockCart)
      })

      act(() => {
        result.current.updateOptimisticLine('line-1', 5)
      })

      expect(result.current.optimisticCart?.lines.edges[0].node.quantity).toBe(5)
      expect(result.current.optimisticCart?.totalQuantity).toBe(5)
      expect(result.current.optimisticCart?.estimatedCost.subtotalAmount.amount).toBe('149.95')
      expect(result.current.optimisticCart?.estimatedCost.totalAmount.amount).toBe('161.95')
    })

    it('should remove optimistic line', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setOptimisticCart(mockCart)
      })

      expect(result.current.optimisticCart?.lines.edges.length).toBe(1)

      act(() => {
        result.current.removeOptimisticLine('line-1')
      })

      expect(result.current.optimisticCart?.lines.edges.length).toBe(0)
      expect(result.current.optimisticCart?.totalQuantity).toBe(0)
      expect(result.current.optimisticCart?.estimatedCost.subtotalAmount.amount).toBe('0.00')
      expect(result.current.optimisticCart?.estimatedCost.totalAmount.amount).toBe('0.00')
    })

    it('should not update if optimistic cart is null', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.optimisticCart).toBeNull()

      act(() => {
        result.current.updateOptimisticLine('line-1', 5)
      })

      expect(result.current.optimisticCart).toBeNull()

      act(() => {
        result.current.removeOptimisticLine('line-1')
      })

      expect(result.current.optimisticCart).toBeNull()
    })

    it('should recalculate prices correctly when updating quantity', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setOptimisticCart(mockCart)
      })

      act(() => {
        result.current.updateOptimisticLine('line-1', 3)
      })

      const cart = result.current.optimisticCart
      expect(cart?.estimatedCost.subtotalAmount.amount).toBe('89.97')
      expect(cart?.estimatedCost.taxAmount?.amount).toBe('7.20')
      expect(cart?.estimatedCost.totalAmount.amount).toBe('97.17')
    })
  })

  describe('persistence', () => {
    it('should persist cartId to localStorage', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setCartId('persisted-cart-id')
      })

      const stored = JSON.parse(localStorage.getItem('cart_id') || '{}')
      expect(stored.state.cartId).toBe('persisted-cart-id')
    })

    it('should not persist isDrawerOpen and optimisticCart', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.setCartId('test-id')
        result.current.openDrawer()
        result.current.setOptimisticCart(null)
      })

      const stored = JSON.parse(localStorage.getItem('cart_id') || '{}')
      expect(stored.state.cartId).toBe('test-id')
      expect(stored.state.isDrawerOpen).toBeUndefined()
      expect(stored.state.optimisticCart).toBeUndefined()
    })
  })
})
