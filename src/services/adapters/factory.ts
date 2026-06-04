import type { IEcommerceAdapter, AdapterConfig, AdapterType } from './interface'
import { createShopifyAdapter } from './shopify'
import { createMockAdapter } from './mock'

/**
 * 默认适配器类型
 *
 * 当环境变量未配置时使用 Mock 适配器，
 * 确保在没有后端连接时也能正常开发和测试。
 */
const DEFAULT_ADAPTER_TYPE: AdapterType = 'mock'

/**
 * 获取适配器配置
 *
 * 从环境变量中读取适配器配置，包括：
 * - 适配器类型（shopify/mock/custom）
 * - Shopify 店铺域名
 * - Storefront API Token
 * - API 版本
 *
 * 设计考虑：
 * - 使用 import.meta.env 读取 Vite 环境变量
 * - 类型断言确保环境变量值符合 AdapterType 类型
 * - 未配置时使用默认值，保证代码健壮性
 *
 * @returns 完整的适配器配置对象
 */
function getAdapterConfig(): AdapterConfig {
  const type = (import.meta.env.VITE_ECOMMERCE_ADAPTER as AdapterType) || DEFAULT_ADAPTER_TYPE

  return {
    type,
    storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN,
    storefrontApiToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_API_TOKEN,
    apiVersion: import.meta.env.VITE_SHOPIFY_API_VERSION,
  }
}

/**
 * 创建电商后端适配器
 *
 * 工厂函数，根据配置创建相应的适配器实例。
 * 这是适配器模式的核心，允许在运行时切换不同的后端实现。
 *
 * 支持的适配器类型：
 * - 'shopify': Shopify 官方 Storefront API 适配器
 * - 'mock': 模拟数据适配器，用于开发测试
 * - 'custom': 自定义后端适配器（当前 fallback 到 mock）
 *
 * 设计特点：
 * 1. 支持传入部分配置覆盖默认配置（主要用于测试）
 * 2. 未知类型默认降级到 mock 适配器，确保系统可用
 * 3. 所有适配器实现 IEcommerceAdapter 接口，保证类型一致性
 *
 * @param config - 可选的部分配置，用于覆盖环境变量配置
 * @returns 实现了 IEcommerceAdapter 接口的适配器实例
 *
 * @example
 * ```typescript
 * // 使用默认配置
 * const adapter = createAdapter();
 *
 * // 测试时覆盖配置
 * const testAdapter = createAdapter({ type: 'mock' });
 * ```
 */
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

/**
 * 默认适配器单例
 *
 * 应用全局使用的适配器实例，在模块加载时创建一次。
 * 所有业务代码通过导入此单例与后端交互。
 *
 * 注意事项：
 * - 这是模块级单例，确保整个应用使用同一个适配器实例
 * - 如果需要动态切换适配器，应使用 createAdapter 重新创建
 * - 类型为 IEcommerceAdapter，上层代码不依赖具体实现
 */
export const adapter: IEcommerceAdapter = createAdapter()

export default adapter
