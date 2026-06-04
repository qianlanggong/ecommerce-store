/**
 * 商品接口
 *
 * 定义商品的完整数据结构，包含基本信息、价格、
 * 图片、变体、选项等所有商品相关数据。
 *
 * 设计说明：
 * - 与 Shopify Storefront API 结构保持一致
 * - 使用 Connection 模式处理列表数据（Relay 风格）
 * - 支持多币种价格
 * - 支持自定义字段（metafields）
 *
 * @interface Product
 */
export interface Product {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  availableForSale: boolean
  totalInventory: number
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  compareAtPriceRange?: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  images: ImageConnection
  featuredImage?: Image
  options: ProductOption[]
  variants: ProductVariantConnection
  collections: CollectionConnection
  tags: string[]
  productType: string
  vendor: string
  createdAt: string
  updatedAt: string
  metafields?: MetafieldConnection
}

/**
 * 商品变体接口
 *
 * 商品的具体规格选项，如不同颜色、尺寸的组合。
 * 每个变体有独立的 SKU、价格、库存等信息。
 *
 * 注意：selectedOptions 必须与 product.options 一一对应，
 * 用于确定用户选择的具体规格。
 *
 * @interface ProductVariant
 */
export interface ProductVariant {
  id: string
  title: string
  sku?: string
  price: Money
  compareAtPrice?: Money
  availableForSale: boolean
  quantityAvailable: number
  selectedOptions: SelectedOption[]
  image?: Image
  weight?: number
  weightUnit?: 'KG' | 'LB' | 'OZ' | 'G'
  product?: Product
}

/**
 * 商品选项接口
 *
 * 定义商品的可选规格类型，如"颜色"、"尺寸"等。
 * 每个选项有多个可选值。
 *
 * @interface ProductOption
 */
export interface ProductOption {
  id: string
  name: string
  values: string[]
}

/**
 * 选中的选项接口
 *
 * 表示用户选择的具体选项值，用于确定商品变体。
 * 例如 { name: "颜色", value: "红色" }。
 *
 * @interface SelectedOption
 */
export interface SelectedOption {
  name: string
  value: string
}

/**
 * 商品集合接口
 *
 * Shopify 中的商品分类概念，用于组织特定主题的商品，
 * 如"夏季新品"、"热销榜"等。
 *
 * @interface Collection
 */
export interface Collection {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  image?: Image
  products: ProductConnection
  updatedAt: string
}

/**
 * 图片接口
 *
 * 统一的图片数据结构，包含 URL、尺寸和替代文本。
 *
 * @interface Image
 */
export interface Image {
  id: string
  url: string
  altText?: string
  width: number
  height: number
}

/**
 * 金额接口
 *
 * 包含币种的金额表示，支持多币种。
 * amount 使用字符串避免浮点数精度问题。
 *
 * @interface Money
 */
export interface Money {
  amount: string
  currencyCode: string
}

/**
 * 图片列表连接接口
 *
 * Relay 风格的连接类型，用于包装列表数据。
 * edges 包含节点数组，每个节点包含实际数据。
 *
 * @interface ImageConnection
 */
export interface ImageConnection {
  edges: Array<{ node: Image }>
}

/**
 * 商品列表连接接口
 *
 * 包含分页信息，支持游标分页。
 *
 * @interface ProductConnection
 */
export interface ProductConnection {
  edges: Array<{ node: Product }>
  pageInfo: PageInfo
}

/**
 * 商品变体列表连接接口
 *
 * @interface ProductVariantConnection
 */
export interface ProductVariantConnection {
  edges: Array<{ node: ProductVariant }>
}

/**
 * 商品集合列表连接接口
 *
 * @interface CollectionConnection
 */
export interface CollectionConnection {
  edges: Array<{ node: Collection }>
  pageInfo: PageInfo
}

/**
 * 元字段列表连接接口
 *
 * 元字段用于存储商品的自定义扩展数据。
 *
 * @interface MetafieldConnection
 */
export interface MetafieldConnection {
  edges: Array<{ node: Metafield }>
}

/**
 * 元字段接口
 *
 * Shopify 的自定义字段机制，用于存储额外的业务数据。
 * 通过 namespace 区分不同业务领域的数据。
 *
 * @interface Metafield
 */
export interface Metafield {
  id: string
  key: string
  value: string
  type: string
  namespace: string
}

/**
 * 分页信息接口
 *
 * Relay 风格的游标分页信息，用于支持无限滚动加载。
 *
 * @interface PageInfo
 */
export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

/**
 * 商品筛选条件接口
 *
 * 定义商品列表查询的所有可选筛选条件。
 *
 * 筛选条件说明：
 * - query: 搜索关键词
 * - sortKey: 排序字段
 * - reverse: 是否倒序
 * - first/last: 返回数量（前 N 条/后 N 条）
 * - after/before: 游标分页参数
 * - minPrice/maxPrice: 价格区间
 * - productType: 商品类型
 * - vendor: 供应商
 * - tag: 标签
 * - available: 是否有货
 *
 * @interface ProductFilter
 */
export interface ProductFilter {
  query?: string
  sortKey?: 'TITLE' | 'PRICE' | 'CREATED' | 'BEST_SELLING' | 'RELEVANCE'
  reverse?: boolean
  first?: number
  last?: number
  after?: string
  before?: string
  minPrice?: string
  maxPrice?: string
  productType?: string
  vendor?: string
  tag?: string
  available?: boolean
}
