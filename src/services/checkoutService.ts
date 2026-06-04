import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { adapter } from './adapters/factory'
import { useToastStore } from '@/stores/toastStore'
import { useNavigate } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'
import type {
  Checkout,
  CheckoutCreateInput,
  CheckoutUpdateInput,
  CheckoutLineItemInput,
  CheckoutLineItemUpdateInput,
  CheckoutResult,
  CheckoutUserError,
  MailingAddressInput,
  Order,
} from '@/types'

/**
 * Checkout Query Keys 配置
 *
 * 遵循 React Query 最佳实践，使用分层结构组织缓存键。
 * 这样可以精确控制缓存失效范围，例如：
 * - checkoutKeys.all 可用于使所有 Checkout 相关缓存失效
 * - checkoutKeys.detail(checkoutId) 用于特定 Checkout 的缓存
 *
 * 注意：使用 as const 确保类型安全，避免运行时键名错误。
 */
export const checkoutKeys = {
  all: ['checkout'] as const,
  detail: (checkoutId: string) => [...checkoutKeys.all, checkoutId] as const,
  shippingRates: (checkoutId: string) => [...checkoutKeys.all, 'shippingRates', checkoutId] as const,
}

/**
 * 获取 Checkout Query
 *
 * 根据 Checkout ID 获取 Checkout 详情。
 *
 * @param checkoutId - Checkout ID
 * @returns React Query 结果对象，包含 Checkout 数据和加载状态
 */
export function useCheckout(checkoutId: string | null) {
  return useQuery({
    queryKey: checkoutKeys.detail(checkoutId || 'empty'),
    queryFn: async () => {
      if (!checkoutId) return null
      return adapter.getCheckout(checkoutId)
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!checkoutId,
  })
}

/**
 * 创建 Checkout Mutation
 *
 * 创建一个新的 Checkout 对象，通常从购物车数据转换而来。
 * 创建成功后自动更新缓存。
 *
 * @returns React Query Mutation 对象
 */
export function useCreateCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input?: CheckoutCreateInput) => adapter.createCheckout(input),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
      }
    },
  })
}

/**
 * 更新 Checkout 信息 Mutation
 *
 * 更新 Checkout 的基本信息，如邮箱、备注等。
 *
 * @returns React Query Mutation 对象
 */
export function useUpdateCheckout() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({ checkoutId, input }: { checkoutId: string; input: CheckoutUpdateInput }) =>
      adapter.updateCheckout(checkoutId, input),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('updateSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('updateError'), 'error')
    },
  })
}

/**
 * 向 Checkout 添加商品 Mutation
 *
 * 向现有的 Checkout 中添加商品行。
 *
 * @returns React Query Mutation 对象
 */
export function useAddCheckoutLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({ checkoutId, lineItems }: { checkoutId: string; lineItems: CheckoutLineItemInput[] }) =>
      adapter.addCheckoutLines(checkoutId, lineItems),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('addItemSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('addItemError'), 'error')
    },
  })
}

/**
 * 更新 Checkout 商品行 Mutation
 *
 * 更新 Checkout 中已有商品行的数量。
 *
 * @returns React Query Mutation 对象
 */
export function useUpdateCheckoutLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({
      checkoutId,
      lineItems,
    }: {
      checkoutId: string
      lineItems: CheckoutLineItemUpdateInput[]
    }) => adapter.updateCheckoutLines(checkoutId, lineItems),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('updateItemSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('updateItemError'), 'error')
    },
  })
}

/**
 * 移除 Checkout 商品行 Mutation
 *
 * 从 Checkout 中移除指定的商品行。
 *
 * @returns React Query Mutation 对象
 */
export function useRemoveCheckoutLines() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({ checkoutId, lineItemIds }: { checkoutId: string; lineItemIds: string[] }) =>
      adapter.removeCheckoutLines(checkoutId, lineItemIds),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('removeItemSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('removeItemError'), 'error')
    },
  })
}

/**
 * 更新 Checkout 买家身份 Mutation
 *
 * 更新 Checkout 的买家身份信息，包括邮箱、用户访问令牌等。
 *
 * @returns React Query Mutation 对象
 */
export function useUpdateCheckoutBuyerIdentity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      checkoutId,
      buyerIdentity,
    }: {
      checkoutId: string
      buyerIdentity: { email?: string; customerAccessToken?: string; countryCode?: string }
    }) => adapter.updateCheckoutBuyerIdentity(checkoutId, buyerIdentity),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
      }
    },
  })
}

/**
 * 更新 Checkout 配送地址 Mutation
 *
 * 更新 Checkout 的配送地址，这会触发可用配送方式的重新计算。
 *
 * @returns React Query Mutation 对象
 */
export function useUpdateCheckoutShippingAddress() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({
      checkoutId,
      shippingAddress,
    }: {
      checkoutId: string
      shippingAddress: MailingAddressInput
    }) => adapter.updateCheckoutShippingAddress(checkoutId, shippingAddress),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        queryClient.invalidateQueries({ queryKey: checkoutKeys.shippingRates(result.checkout.id) })
        useToastStore.getState().addToast(t('addressUpdateSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('addressUpdateError'), 'error')
    },
  })
}

/**
 * 获取 Checkout 可用配送方式 Query
 *
 * 根据当前的配送地址和商品，获取可用的配送方式列表。
 *
 * @param checkoutId - Checkout ID
 * @returns React Query 结果对象，包含可用配送方式列表
 */
export function useAvailableShippingRates(checkoutId: string | null) {
  return useQuery({
    queryKey: checkoutKeys.shippingRates(checkoutId || 'empty'),
    queryFn: async () => {
      if (!checkoutId) return []
      return adapter.getAvailableShippingRates(checkoutId)
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!checkoutId,
  })
}

/**
 * 选择 Checkout 配送方式 Mutation
 *
 * 为 Checkout 选择指定的配送方式。
 *
 * @returns React Query Mutation 对象
 */
export function useUpdateCheckoutShippingLine() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({
      checkoutId,
      shippingRateHandle,
    }: {
      checkoutId: string
      shippingRateHandle: string
    }) => adapter.updateCheckoutShippingLine(checkoutId, shippingRateHandle),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('shippingUpdateSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('shippingUpdateError'), 'error')
    },
  })
}

/**
 * 应用折扣码到 Checkout Mutation
 *
 * 为 Checkout 应用折扣码。
 *
 * @returns React Query Mutation 对象
 */
export function useApplyDiscountCode() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: ({ checkoutId, discountCode }: { checkoutId: string; discountCode: string }) =>
      adapter.applyDiscountCode(checkoutId, discountCode),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout && result.checkoutUserErrors.length === 0) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('discountApplySuccess'), 'success')
      } else if (result.checkoutUserErrors.length > 0) {
        const error = result.checkoutUserErrors[0]
        useToastStore.getState().addToast(error.message, 'error')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('discountApplyError'), 'error')
    },
  })
}

/**
 * 移除 Checkout 折扣码 Mutation
 *
 * 移除 Checkout 已应用的折扣码。
 *
 * @returns React Query Mutation 对象
 */
export function useRemoveDiscountCode() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: (checkoutId: string) => adapter.removeDiscountCode(checkoutId),
    onSuccess: (result: CheckoutResult) => {
      if (result.checkout) {
        queryClient.setQueryData(checkoutKeys.detail(result.checkout.id), result.checkout)
        useToastStore.getState().addToast(t('discountRemoveSuccess'), 'success')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('discountRemoveError'), 'error')
    },
  })
}

/**
 * 完成 Checkout 并跳转到支付页面 Mutation
 *
 * 这是最常用的支付流程：创建 Checkout 后，跳转到 Shopify 官方支付页面。
 * 在 Shopify 无头模式下，不建议在前端直接处理信用卡信息。
 *
 * 使用流程：
 * 1. 用户在结算页面填写信息
 * 2. 调用此 mutation 创建/更新 Checkout
 * 3. 跳转到 Shopify 官方支付页面
 * 4. 用户在 Shopify 页面完成支付
 * 5. Shopify 自动跳回我们的订单成功页面
 *
 * @returns React Query Mutation 对象，调用时传入 Checkout 数据
 */
export function useGoToPayment() {
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: async (checkout: Checkout) => {
      if (!checkout.webUrl) {
        throw new Error('Checkout URL not available')
      }
      return checkout
    },
    onSuccess: (checkout) => {
      window.location.href = checkout.webUrl
    },
    onError: () => {
      useToastStore.getState().addToast(t('paymentRedirectError'), 'error')
    },
  })
}

/**
 * 完成 Checkout Mutation（模拟）
 *
 * 仅用于 Mock 环境或开发测试。
 * 在生产环境中，应该通过跳转到 webUrl 让用户在 Shopify 官方页面完成支付。
 *
 * @returns React Query Mutation 对象
 */
export function useCompleteCheckout() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { localizePath } = useLocale()
  const { t } = useTranslation('checkout')

  return useMutation({
    mutationFn: (checkoutId: string) => adapter.completeCheckout(checkoutId),
    onSuccess: (result: { order?: Order; userErrors: CheckoutUserError[] }) => {
      if (result.order && result.userErrors.length === 0) {
        queryClient.removeQueries({ queryKey: checkoutKeys.all })
        const encodedOrderId = encodeURIComponent(result.order.id)
        navigate(localizePath(`/checkout/success?orderId=${encodedOrderId}`))
      } else if (result.userErrors.length > 0) {
        const error = result.userErrors[0]
        useToastStore.getState().addToast(error.message, 'error')
      }
    },
    onError: () => {
      useToastStore.getState().addToast(t('checkoutCompleteError'), 'error')
    },
  })
}
