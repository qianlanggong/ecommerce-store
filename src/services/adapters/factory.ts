import type { IEcommerceAdapter, AdapterConfig, AdapterType } from './interface'
import { createShopifyAdapter } from './shopify'
import { createMockAdapter } from './mock'

const DEFAULT_ADAPTER_TYPE: AdapterType = 'mock'

function getAdapterConfig(): AdapterConfig {
  const type = (import.meta.env.VITE_ECOMMERCE_ADAPTER as AdapterType) || DEFAULT_ADAPTER_TYPE

  return {
    type,
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    storefrontApiToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN,
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  }
}

export function createAdapter(config?: Partial<AdapterConfig>): IEcommerceAdapter {
  const finalConfig = { ...getAdapterConfig(), ...config }

  switch (finalConfig.type) {
    case 'shopify':
      return createShopifyAdapter(finalConfig)
    case 'mock':
      return createMockAdapter()
    case 'custom':
      return createMockAdapter()
    default:
      return createMockAdapter()
  }
}

export const adapter: IEcommerceAdapter = createAdapter()

export default adapter
