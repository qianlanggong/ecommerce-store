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
}

export interface ProductOption {
  id: string
  name: string
  values: string[]
}

export interface SelectedOption {
  name: string
  value: string
}

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

export interface Image {
  id: string
  url: string
  altText?: string
  width: number
  height: number
}

export interface Money {
  amount: string
  currencyCode: string
}

export interface ImageConnection {
  edges: Array<{ node: Image }>
}

export interface ProductConnection {
  edges: Array<{ node: Product }>
  pageInfo: PageInfo
}

export interface ProductVariantConnection {
  edges: Array<{ node: ProductVariant }>
}

export interface CollectionConnection {
  edges: Array<{ node: Collection }>
  pageInfo: PageInfo
}

export interface MetafieldConnection {
  edges: Array<{ node: Metafield }>
}

export interface Metafield {
  id: string
  key: string
  value: string
  type: string
  namespace: string
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

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
