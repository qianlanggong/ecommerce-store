import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { useLocale } from './useLocale'
import type { TrackingInfo, Product } from '@/types'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'product' | 'article' | 'order'
  canonicalUrl?: string
  noIndex?: boolean
  structuredData?: Record<string, unknown>
}

const DEFAULT_OG_IMAGE = '/og-image.png'
const SITE_NAME = 'Maison Artisan'

function updateMetaTag(property: string, content: string, isProperty: boolean = false): void {
  if (!content) return

  const attribute = isProperty ? 'property' : 'name'
  const selector = `meta[${attribute}="${property}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, property)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

function removeMetaTag(property: string, isProperty: boolean = false): void {
  const attribute = isProperty ? 'property' : 'name'
  const selector = `meta[${attribute}="${property}"]`
  const tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (tag) {
    document.head.removeChild(tag)
  }
}

function updateLinkTag(rel: string, href: string): void {
  if (!href) return

  const selector = `link[rel="${rel}"]`
  let tag = document.head.querySelector<HTMLLinkElement>(selector)

  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', rel)
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', href)
}

function updateStructuredData(data: Record<string, unknown> | null): void {
  const id = 'structured-data-ld'
  let script = document.getElementById(id) as HTMLScriptElement | null

  if (!data) {
    if (script) {
      document.head.removeChild(script)
    }
    return
  }

  if (!script) {
    script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

function generateAlternateLocales(currentPath: string, locales: string[]): void {
  locales.forEach((locale) => {
    const href = `${window.location.origin}/${locale}${currentPath}`
    updateLinkTag('alternate', href)
    const tag = document.head.querySelector<HTMLLinkElement>(
      `link[rel="alternate"][href="${href}"]`,
    )
    if (tag) {
      tag.setAttribute('hreflang', locale)
    }
  })
}

function applySEO(config: SEOConfig, defaultTitle: string, defaultDescription: string, defaultKeywords: string[]): void {
  const {
    title,
    description,
    keywords,
    ogImage,
    ogType,
    canonicalUrl,
    noIndex,
    structuredData,
  } = config

  const pageTitle = title || defaultTitle
  const pageDescription = description || defaultDescription
  const pageKeywords = [...(keywords || []), ...defaultKeywords]

  document.title = pageTitle

  updateMetaTag('description', pageDescription)
  updateMetaTag('keywords', pageKeywords.join(', '))

  updateMetaTag('og:title', pageTitle, true)
  updateMetaTag('og:description', pageDescription, true)
  updateMetaTag('og:image', ogImage || DEFAULT_OG_IMAGE, true)
  updateMetaTag('og:type', ogType || 'website', true)
  updateMetaTag('og:site_name', SITE_NAME, true)

  updateMetaTag('twitter:card', 'summary_large_image')
  updateMetaTag('twitter:title', pageTitle)
  updateMetaTag('twitter:description', pageDescription)
  updateMetaTag('twitter:image', ogImage || DEFAULT_OG_IMAGE)

  if (canonicalUrl) {
    updateLinkTag('canonical', canonicalUrl)
  }

  if (noIndex) {
    updateMetaTag('robots', 'noindex, nofollow')
  } else {
    removeMetaTag('robots')
  }

  updateStructuredData(structuredData || null)
}

export function useSEO(config: SEOConfig = {}): void {
  const { t } = useTranslation('common')
  const location = useLocation()
  const { supportedLocales } = useLocale()

  const buildSEO = useCallback(() => {
    const defaultTitle = t('meta.title', 'Maison Artisan - Luxury Ecommerce')
    const defaultDescription = t(
      'meta.description',
      'Discover our curated collection of premium artisanal products. Quality craftsmanship, timeless designs, and exceptional customer service.',
    )
    const defaultKeywords = [
      t('meta.keywords.luxury', 'luxury'),
      t('meta.keywords.handmade', 'handmade'),
      t('meta.keywords.artisan', 'artisan'),
      t('meta.keywords.premium', 'premium'),
      t('meta.keywords.ecommerce', 'ecommerce'),
    ]

    applySEO(config, defaultTitle, defaultDescription, defaultKeywords)
    generateAlternateLocales(location.pathname, supportedLocales)
  }, [config, location.pathname, supportedLocales, t])

  useEffect(() => {
    buildSEO()
  }, [buildSEO])

  useEffect(() => {
    return () => {
      updateStructuredData(null)
    }
  }, [])
}

export function useProductSEO(product: Product | undefined | null): void {
  const { t } = useTranslation('product')
  const { locale } = useLocale()
  const location = useLocation()

  useEffect(() => {
    if (!product) {
      const defaultTitle = t('meta.title', 'Products - Maison Artisan')
      const defaultDescription = t(
        'meta.description',
        'Browse our collection of premium artisanal products.',
      )
      const defaultKeywords = [
        t('meta.keywords.product', 'product'),
        t('meta.keywords.premium', 'premium'),
        t('meta.keywords.luxury', 'luxury'),
      ]

      applySEO({}, defaultTitle, defaultDescription, defaultKeywords)
      return
    }

    const productImage = product.images.edges[0]?.node.url
    const productDescription =
      product.description?.substring(0, 160) ||
      t('meta.description', 'Premium quality artisanal product.')

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: productDescription,
      image: productImage,
      brand: {
        '@type': 'Brand',
        name: SITE_NAME,
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: product.priceRange.minVariantPrice.currencyCode,
        price: product.priceRange.minVariantPrice.amount,
        availability: product.availableForSale
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        url: `${window.location.origin}/${locale}${location.pathname}`,
      },
      sku: product.variants.edges[0]?.node.sku || product.id,
      mpn: product.id,
    }

    const defaultTitle = t('meta.title', 'Products - Maison Artisan')
    const defaultDescription = t(
      'meta.description',
      'Browse our collection of premium artisanal products.',
    )
    const defaultKeywords = [
      t('meta.keywords.product', 'product'),
      t('meta.keywords.premium', 'premium'),
      t('meta.keywords.luxury', 'luxury'),
    ]

    applySEO(
      {
        title: product.title,
        description: productDescription,
        keywords: [
          product.title,
          t('meta.keywords.product', 'product'),
          ...(product.tags || []),
        ],
        ogImage: productImage,
        ogType: 'product',
        structuredData,
      },
      defaultTitle,
      defaultDescription,
      defaultKeywords,
    )
  }, [product, t, locale, location.pathname])
}

export function useOrderTrackingSEO(
  tracking: TrackingInfo | undefined | null,
  trackingNumber: string,
): void {
  const { t } = useTranslation('fulfillment')
  const { locale } = useLocale()
  const location = useLocation()

  useEffect(() => {
    if (!tracking) {
      const defaultTitle = t('orderTracking', 'Order Tracking')
      const defaultDescription = t(
        'orderTrackingDescription',
        'Track your order in real-time. Get updates on your package delivery status.',
      )
      const defaultKeywords = [
        t('orderTracking', 'Order Tracking'),
        t('meta.keywords.shipping', 'shipping'),
        t('meta.keywords.delivery', 'delivery'),
        t('meta.keywords.package', 'package'),
      ]

      applySEO(
        {
          title: defaultTitle,
          description: defaultDescription,
          keywords: defaultKeywords,
          ogType: 'website',
        },
        defaultTitle,
        defaultDescription,
        defaultKeywords,
      )
      return
    }

    const statusText = t(`status.${tracking.status}` as unknown as string)
    const estimatedDelivery = tracking.estimatedDeliveryAt
      ? new Date(tracking.estimatedDeliveryAt).toLocaleDateString(
          locale === 'zh' ? 'zh-CN' : 'en-US',
        )
      : ''

    const description = trackingNumber
      ? t('seo.trackingDescription', {
          trackingNumber,
          status: statusText,
          estimatedDelivery,
        })
      : t('orderTrackingDescription', 'Track your order in real-time.')

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'ParcelDelivery',
      deliveryStatus: tracking.status,
      trackingNumber: tracking.trackingNumber,
      trackingUrl: tracking.trackingUrl,
      carrier: tracking.carrier
        ? {
            '@type': 'Organization',
            name: tracking.carrier,
          }
        : undefined,
      originAddress: tracking.originAddress
        ? {
            '@type': 'PostalAddress',
            streetAddress: tracking.originAddress.address1,
            addressLocality: tracking.originAddress.city,
            addressRegion: tracking.originAddress.province,
            addressCountry: tracking.originAddress.countryCode,
            postalCode: tracking.originAddress.zip,
          }
        : undefined,
      deliveryAddress: tracking.destinationAddress
        ? {
            '@type': 'PostalAddress',
            streetAddress: tracking.destinationAddress.address1,
            addressLocality: tracking.destinationAddress.city,
            addressRegion: tracking.destinationAddress.province,
            addressCountry: tracking.destinationAddress.countryCode,
            postalCode: tracking.destinationAddress.zip,
          }
        : undefined,
      expectedDeliveryFrom: tracking.estimatedDeliveryFrom,
      expectedDeliveryUntil: tracking.estimatedDeliveryTo,
      actualDeliveryTime: tracking.actualDeliveryAt,
      itemShipped: {
        '@type': 'Order',
        orderNumber: tracking.orderName,
        orderStatus: tracking.status,
      },
    }

    const defaultTitle = t('orderTracking', 'Order Tracking')
    const defaultDescription = t(
      'orderTrackingDescription',
      'Track your order in real-time. Get updates on your package delivery status.',
    )
    const defaultKeywords = [
      t('orderTracking', 'Order Tracking'),
      t('meta.keywords.shipping', 'shipping'),
      t('meta.keywords.delivery', 'delivery'),
      t('meta.keywords.package', 'package'),
    ]

    applySEO(
      {
        title: `${t('orderTracking', 'Order Tracking')} - ${trackingNumber || tracking.orderName}`,
        description,
        keywords: [
          t('orderTracking', 'Order Tracking'),
          trackingNumber,
          tracking.carrier,
          statusText,
          t('meta.keywords.shipping', 'shipping'),
          t('meta.keywords.delivery', 'delivery'),
        ],
        ogType: 'website',
        structuredData,
        canonicalUrl: `${window.location.origin}/${locale}${location.pathname}`,
      },
      defaultTitle,
      defaultDescription,
      defaultKeywords,
    )
  }, [tracking, trackingNumber, t, locale, location.pathname])
}

export function useCollectionSEO(
  collection: Collection | undefined | null,
): void {
  const { t } = useTranslation('common')
  const { locale } = useLocale()
  const location = useLocation()

  useEffect(() => {
    if (!collection) {
      const defaultTitle = t('meta.title', 'Collections - Maison Artisan')
      const defaultDescription = t(
        'meta.description',
        'Browse our curated collections of premium products.',
      )
      const defaultKeywords = [
        t('meta.keywords.premium', 'premium'),
        t('meta.keywords.luxury', 'luxury'),
      ]

      applySEO({}, defaultTitle, defaultDescription, defaultKeywords)
      return
    }

    const collectionImage = collection.image?.transformedSrc || collection.image?.src

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: collection.title,
      description: collection.description?.substring(0, 160) || '',
      image: collectionImage,
      url: `${window.location.origin}/${locale}${location.pathname}`,
      hasPart: collection.products.edges.map((edge) => ({
        '@type': 'Product',
        name: edge.node.title,
        url: `${window.location.origin}/${locale}/products/${edge.node.handle}`,
      })),
    }

    const defaultTitle = t('meta.title', 'Collections - Maison Artisan')
    const defaultDescription = t(
      'meta.description',
      'Browse our curated collections of premium products.',
    )
    const defaultKeywords = [
      t('meta.keywords.premium', 'premium'),
      t('meta.keywords.luxury', 'luxury'),
    ]

    applySEO(
      {
        title: collection.title,
        description: collection.description?.substring(0, 160) || defaultDescription,
        keywords: [
          collection.title,
          t('meta.keywords.product', 'product'),
          t('meta.keywords.premium', 'premium'),
        ],
        ogImage: collectionImage,
        ogType: 'website',
        structuredData,
        canonicalUrl: `${window.location.origin}/${locale}${location.pathname}`,
      },
      defaultTitle,
      defaultDescription,
      defaultKeywords,
    )
  }, [collection, t, locale, location.pathname])
}

interface Collection {
  title: string
  description?: string
  handle: string
  image?: {
    src: string
    transformedSrc?: string
  }
  products: {
    edges: Array<{
      node: {
        title: string
        handle: string
      }
    }>
  }
}
