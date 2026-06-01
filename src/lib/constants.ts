import type { SortOption } from '@/types'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Ecommerce Store'

export const DEFAULT_PAGE_SIZE = 24

export const PRODUCT_SORT_OPTIONS: SortOption[] = [
  { value: 'BEST_SELLING', label: 'Best Selling' },
  { value: 'TITLE', label: 'Title: A-Z' },
  { value: 'TITLE_REVERSE', label: 'Title: Z-A' },
  { value: 'PRICE', label: 'Price: Low to High' },
  { value: 'PRICE_REVERSE', label: 'Price: High to Low' },
  { value: 'CREATED', label: 'Newest' },
  { value: 'CREATED_REVERSE', label: 'Oldest' },
]

export const PRICE_RANGES = [
  { label: 'Under $50', min: '0', max: '50' },
  { label: '$50 - $100', min: '50', max: '100' },
  { label: '$100 - $250', min: '100', max: '250' },
  { label: '$250 - $500', min: '250', max: '500' },
  { label: 'Over $500', min: '500', max: '' },
]

export const STORAGE_KEYS = {
  CART_ID: 'cart_id',
  CUSTOMER_ACCESS_TOKEN: 'customer_access_token',
  CUSTOMER_ACCESS_TOKEN_EXPIRES_AT: 'customer_access_token_expires_at',
  FAVORITES: 'favorites',
  VIEWED_PRODUCTS: 'viewed_products',
  SEARCH_HISTORY: 'search_history',
  LOCALE: 'i18nextLng',
} as const

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT: '/products/:handle',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/account/login',
  REGISTER: '/account/register',
  RESET_PASSWORD: '/account/reset-password',
  ACCOUNT: '/account',
  ACCOUNT_ORDERS: '/account/orders',
  ACCOUNT_ORDER: '/account/orders/:id',
  ACCOUNT_ADDRESSES: '/account/addresses',
  ACCOUNT_FAVORITES: '/account/favorites',
  ACCOUNT_SETTINGS: '/account/settings',
} as const

export const NAVIGATION_ITEMS = [
  { label: 'navigation.home', href: ROUTES.HOME },
  { label: 'navigation.products', href: ROUTES.PRODUCTS },
  { label: 'navigation.cart', href: ROUTES.CART },
  { label: 'navigation.account', href: ROUTES.ACCOUNT },
] as const

export const FOOTER_LINKS = {
  shop: [
    { label: 'navigation.products', href: ROUTES.PRODUCTS },
    { label: 'navigation.cart', href: ROUTES.CART },
  ],
  account: [
    { label: 'navigation.account', href: ROUTES.ACCOUNT },
    { label: 'navigation.orders', href: ROUTES.ACCOUNT_ORDERS },
    { label: 'navigation.favorites', href: ROUTES.ACCOUNT_FAVORITES },
  ],
  support: [
    { label: 'support.contactUs', href: '/contact' },
    { label: 'support.shippingPolicy', href: '/shipping' },
    { label: 'support.returnPolicy', href: '/returns' },
    { label: 'support.privacyPolicy', href: '/privacy' },
    { label: 'support.termsOfService', href: '/terms' },
  ],
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 12,
  MAX_PER_PAGE: 50,
} as const

export const ANIMATION = {
  DEFAULT_DURATION: 300,
  FAST_DURATION: 150,
  SLOW_DURATION: 500,
} as const

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const

export const MAX_CART_QUANTITY = 100

export const MIN_CART_QUANTITY = 1

export const PASSWORD_MIN_LENGTH = 8

export const SEARCH_HISTORY_LIMIT = 10

export const VIEWED_PRODUCTS_LIMIT = 20

export const FAVORITES_LIMIT = 100
