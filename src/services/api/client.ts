import { createStorefrontApiClient } from '@shopify/storefront-api-client'

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || ''
const SHOPIFY_API_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || ''
const SHOPIFY_API_VERSION = import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-07'

export const shopifyClient = createStorefrontApiClient({
  storeDomain: SHOPIFY_DOMAIN,
  apiVersion: SHOPIFY_API_VERSION,
  publicAccessToken: SHOPIFY_API_TOKEN,
})

export interface ShopifyResponse<T> {
  data: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
  }>
}

export async function shopifyRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const result = await shopifyClient.request(query, variables)
  const data = result.data as T
  const errors = result.errors as unknown as Array<{ message: string }> | undefined

  if (errors && Array.isArray(errors) && errors.length > 0) {
    console.error('Shopify API errors:', errors)
    throw new Error(errors[0].message)
  }

  return data
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      data,
      success: true,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false,
    }
  }
}

export function formatGraphQLError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (Array.isArray(error) && error.length > 0) {
    return error[0]?.message || 'Unknown error'
  }
  return 'An unexpected error occurred'
}
