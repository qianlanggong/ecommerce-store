export const SHOPIFY_CONFIG = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',
  storefrontApiToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN || '',
  apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION || '2024-07',
  isConfigured: Boolean(
    import.meta.env.VITE_SHOPIFY_STORE_DOMAIN && import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN,
  ),
} as const

export function validateShopifyConfig(): boolean {
  if (!SHOPIFY_CONFIG.isConfigured) {
    console.warn(
      'Shopify configuration is incomplete. Please set VITE_SHOPIFY_STORE_DOMAIN and VITE_SHOPIFY_STOREFRONT_API_TOKEN in .env.local',
    )
    return false
  }
  return true
}

export const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`

export const CURRENCY_CODE = 'USD'

export const DEFAULT_COUNTRY_CODE = 'US'
