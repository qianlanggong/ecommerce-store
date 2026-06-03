import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DOMPurify from 'dompurify'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
} from 'lucide-react'
import {
  useProduct,
  useProductRecommendations,
  usePrefetchProduct,
} from '@/services/productService'
import { useAddCartLines } from '@/services/cartService'
import { ProductCard } from '@/components/product/ProductCard'
import { useLocale } from '@/hooks/useLocale'
import { useFavoritesStore, useCartStore } from '@/stores'
import { MAX_CART_QUANTITY, MIN_CART_QUANTITY } from '@/lib/constants'
import {
  cn,
  getProductDisplayPrice,
  getVariantPrice,
  getVariantCompareAtPrice,
  getDiscountPercent,
  isOnSale,
} from '@/lib/utils'

export default function ProductDetailPage() {
  const { handle } = useParams<{ handle: string }>()
  const { t } = useTranslation(['product', 'common'])
  const { locale, localizePath } = useLocale()
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const addCartLines = useAddCartLines()
  const openDrawer = useCartStore((state) => state.openDrawer)
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: product, isLoading, error } = useProduct(handle || '')
  const prefetchProduct = usePrefetchProduct()

  const isFavorite = useFavoritesStore((state) =>
    product ? state.isFavorite(product.id) : false
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const images = useMemo(() => {
    return product?.images.edges.map((edge) => edge.node) || []
  }, [product])

  const currentImage = images[selectedImageIndex]

  const variants = useMemo(() => {
    return product?.variants.edges.map((edge) => edge.node) || []
  }, [product])

  const selectedVariant = useMemo(() => {
    if (variants.length === 0) return null
    if (variants.length === 1) return variants[0]

    return (
      variants.find((variant) =>
        variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
      ) || null
    )
  }, [variants, selectedOptions])

  const displayPrice = useMemo(() => {
    if (!product) return ''
    if (selectedVariant) {
      return getVariantPrice(selectedVariant, locale === 'zh' ? 'zh-CN' : 'en-US')
    }
    return getProductDisplayPrice(product, locale === 'zh' ? 'zh-CN' : 'en-US')
  }, [product, selectedVariant, locale])

  const compareAtPrice = useMemo(() => {
    if (!selectedVariant) return null
    return getVariantCompareAtPrice(selectedVariant, locale === 'zh' ? 'zh-CN' : 'en-US')
  }, [selectedVariant, locale])

  const discountPercent = useMemo(() => {
    if (!selectedVariant) return null
    return getDiscountPercent(selectedVariant)
  }, [selectedVariant])

  const onSale = useMemo(() => {
    return selectedVariant ? isOnSale(selectedVariant) : false
  }, [selectedVariant])

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }))
    setQuantity(1)
  }

  const handleAddToCart = useCallback(() => {
    if (!product || !selectedVariant) return

    addCartLines.mutate(
      [{ merchandiseId: selectedVariant.id, quantity }],
      {
        onSuccess: () => {
          setShowAddedMessage(true)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          timeoutRef.current = setTimeout(() => setShowAddedMessage(false), 2000)
          openDrawer()
        },
      },
    )
  }, [product, selectedVariant, quantity, addCartLines, openDrawer])

  const handleBuyNow = useCallback(() => {
    if (!product || !selectedVariant) return

    addCartLines.mutate(
      [{ merchandiseId: selectedVariant.id, quantity }],
      {
        onSuccess: (cart) => {
          if (cart.checkoutUrl) {
            window.location.href = cart.checkoutUrl
          }
        },
      },
    )
  }, [product, selectedVariant, quantity, addCartLines])

  const handleToggleFavorite = useCallback(() => {
    if (!product) return
    toggleFavorite(product.id)
  }, [product, toggleFavorite])

  const isOptionAvailable = (optionName: string, value: string): boolean => {
    const testOptions = { ...selectedOptions, [optionName]: value }
    return variants.some((variant) =>
      variant.selectedOptions.every(
        (opt) => testOptions[opt.name] === undefined || testOptions[opt.name] === opt.value,
      ),
    )
  }

  const { data: recommendations } = useProductRecommendations(product?.id || '')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="animate-pulse">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="bg-cream shadow-luxury aspect-square rounded-3xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-cream shadow-luxury aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-cream h-10 w-3/4 rounded" />
              <div className="bg-cream h-8 w-1/4 rounded" />
              <div className="bg-cream h-32 rounded" />
              <div className="bg-cream h-14 w-1/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="animate-fade-in-up container mx-auto px-4 py-20 text-center">
        <div className="bg-wine/10 shadow-luxury mx-auto max-w-md rounded-2xl p-12">
          <h2 className="font-display text-wine text-2xl">{t('productNotFound')}</h2>
          <p className="font-body text-muted-foreground mt-3 text-base">
            {t('productNotFoundDescription')}
          </p>
          <Link
            to={localizePath('/products')}
            className="bg-gradient-gold font-body shadow-luxury hover:shadow-luxury-hover mt-6 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5"
          >
            {t('backToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="font-body animate-fade-in-up mb-10 text-sm">
        <ol className="text-muted-foreground flex items-center gap-3">
          <li>
            <Link to={localizePath('/')} className="hover:text-primary transition-colors">
              {t('navigation.home', { ns: 'common' })}
            </Link>
          </li>
          <li className="text-gold">✦</li>
          <li>
            <Link to={localizePath('/products')} className="hover:text-primary transition-colors">
              {t('allProducts')}
            </Link>
          </li>
          <li className="text-gold">✦</li>
          <li className="text-charcoal font-medium">{product.title}</li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="animate-fade-in-up stagger-1 space-y-6">
          <div className="bg-cream shadow-luxury border-luxury relative overflow-hidden rounded-3xl">
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                  }
                  className="shadow-luxury absolute top-1/2 left-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 transition-all hover:scale-110 hover:bg-white"
                  aria-label={t('previousImage')}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                  }
                  className="shadow-luxury absolute top-1/2 right-4 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 transition-all hover:scale-110 hover:bg-white"
                  aria-label={t('nextImage')}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <img
              src={currentImage?.url}
              alt={currentImage?.altText || product.title}
              className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  onMouseEnter={() => prefetchProduct(product.handle)}
                  className={cn(
                    'shadow-luxury overflow-hidden rounded-2xl border-2 transition-all duration-300',
                    selectedImageIndex === index
                      ? 'border-primary shadow-luxury-hover scale-105'
                      : 'hover:border-primary/50 border-transparent hover:scale-102',
                  )}
                >
                  <img
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="animate-fade-in-up stagger-2 space-y-8">
          <div className="bg-gold/10 inline-flex items-center gap-2 rounded-full px-4 py-1.5">
            <span className="text-gold">✦</span>
            <span className="font-body text-gold text-sm font-medium">{product.productType}</span>
          </div>

          <h1 className="font-display text-charcoal text-4xl leading-tight font-bold sm:text-5xl">
            {product.title}
          </h1>

          <div className="flex items-baseline gap-4">
            <span className="font-display text-primary text-4xl font-bold">{displayPrice}</span>
            {compareAtPrice && (
              <span className="font-body text-muted-foreground text-xl line-through">
                {compareAtPrice}
              </span>
            )}
            {onSale && discountPercent && (
              <span className="bg-wine font-body text-cream shadow-luxury rounded-full px-3 py-1 text-sm font-semibold">
                -{discountPercent}%
              </span>
            )}
          </div>

          <div className="relative">
            <div className="bg-gradient-gold absolute top-0 -left-4 h-full w-1 rounded-full" />
            <div
              className="font-body text-charcoal/80 pl-6 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.descriptionHtml) }}
            />
          </div>

          {product.options.map((option) => (
            <div key={option.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-charcoal text-lg font-semibold">{option.name}</h3>
                <span className="font-body text-gold text-sm">
                  {selectedOptions[option.name] || t('selectOption')}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {option.values.map((value) => {
                  const available = isOptionAvailable(option.name, value)
                  const selected = selectedOptions[option.name] === value

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleOptionChange(option.name, value)}
                      disabled={!available}
                      className={cn(
                        'font-body shadow-subtle min-w-[80px] rounded-xl border-2 px-5 py-3 text-sm font-semibold transition-all duration-300',
                        selected
                          ? 'border-primary bg-gradient-gold text-cream shadow-luxury scale-105'
                          : available
                            ? 'border-gold/30 bg-cream text-charcoal hover:border-gold hover:shadow-luxury hover:scale-102'
                            : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400 line-through opacity-50',
                      )}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="font-display text-charcoal text-lg font-semibold">{t('quantity')}</h3>
            <div className="flex items-center gap-6">
              <div className="border-gold/30 bg-cream shadow-subtle flex items-center overflow-hidden rounded-2xl border-2">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(MIN_CART_QUANTITY, prev - 1))}
                  className="text-charcoal hover:bg-gold/10 hover:text-primary flex h-14 w-14 items-center justify-center transition-all duration-300"
                  aria-label={t('decreaseQuantity')}
                >
                  <Minus size={20} />
                </button>
                <span className="font-display text-charcoal w-16 text-center text-2xl font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(MAX_CART_QUANTITY, prev + 1))}
                  className="text-charcoal hover:bg-gold/10 hover:text-primary flex h-14 w-14 items-center justify-center transition-all duration-300"
                  aria-label={t('increaseQuantity')}
                >
                  <Plus size={20} />
                </button>
              </div>

              {selectedVariant && (
                <div
                  className={cn(
                    'font-body shadow-subtle flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold',
                    selectedVariant.availableForSale
                      ? selectedVariant.quantityAvailable <= 5
                        ? 'bg-amber/10 text-amber'
                        : 'bg-emerald/10 text-emerald'
                      : 'bg-wine/10 text-wine',
                  )}
                >
                  <Check size={16} />
                  {selectedVariant.availableForSale
                    ? selectedVariant.quantityAvailable <= 5
                      ? t('onlyXLeft', { count: selectedVariant.quantityAvailable })
                      : t('inStock')
                    : t('outOfStock')}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale || addCartLines.isPending}
              className="group bg-gradient-gold font-display text-cream shadow-luxury hover:shadow-luxury-hover flex flex-1 items-center justify-center gap-3 rounded-2xl px-8 py-4.5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showAddedMessage ? (
                <>
                  <Check size={22} />
                  {t('addSuccess')}
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={22}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                  {t('addToCart')}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!selectedVariant?.availableForSale || addCartLines.isPending}
              className="group border-primary bg-cream font-display text-primary shadow-subtle hover:bg-primary/5 hover:shadow-luxury flex flex-1 items-center justify-center gap-3 rounded-2xl border-2 px-8 py-4.5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t('buyNow')}
            </button>
            <div className="flex gap-3 sm:flex-col">
              <button
                type="button"
                onClick={handleToggleFavorite}
                className={cn(
                  'group border-gold/30 bg-cream shadow-subtle hover:border-wine/50 hover:bg-wine/10 hover:shadow-luxury flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300',
                  isFavorite ? 'text-wine' : 'text-charcoal/60',
                )}
                aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
              >
                <Heart
                  size={24}
                  fill={isFavorite ? 'currentColor' : 'none'}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </button>
              <button
                type="button"
                className="group border-gold/30 bg-cream text-charcoal/60 shadow-subtle hover:border-gold hover:bg-gold/10 hover:text-gold hover:shadow-luxury flex h-14 w-14 items-center justify-center rounded-2xl border-2 transition-all duration-300"
                aria-label={t('share')}
              >
                <Share2
                  size={24}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </button>
            </div>
          </div>

          <div className="border-luxury bg-cream/50 shadow-subtle grid gap-4 rounded-3xl p-6 sm:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-gold text-cream shadow-luxury flex h-12 w-12 items-center justify-center rounded-full">
                <Truck size={22} />
              </div>
              <div>
                <div className="font-display text-charcoal text-sm font-semibold">
                  {t('freeShipping')}
                </div>
                <div className="font-body text-muted-foreground text-xs">
                  {t('freeShippingDescription')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-gold text-cream shadow-luxury flex h-12 w-12 items-center justify-center rounded-full">
                <Shield size={22} />
              </div>
              <div>
                <div className="font-display text-charcoal text-sm font-semibold">
                  {t('securePayment')}
                </div>
                <div className="font-body text-muted-foreground text-xs">
                  {t('securePaymentDescription')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gradient-gold text-cream shadow-luxury flex h-12 w-12 items-center justify-center rounded-full">
                <RotateCcw size={22} />
              </div>
              <div>
                <div className="font-display text-charcoal text-sm font-semibold">
                  {t('easyReturns')}
                </div>
                <div className="font-body text-muted-foreground text-xs">
                  {t('easyReturnsDescription')}
                </div>
              </div>
            </div>
          </div>

          {product.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-display text-charcoal text-lg font-semibold">{t('tags')}</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-gold/30 bg-gold/5 font-body text-gold hover:border-gold hover:bg-gold/10 rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300"
                  >
                    # {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {recommendations && recommendations.length > 0 && (
        <section className="animate-fade-in-up stagger-3 mt-24">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-3">
              <div className="bg-gradient-gold h-px w-12 rounded-full" />
              <span className="font-body text-gold text-sm font-medium tracking-widest uppercase">
                {t('curatedForYou')}
              </span>
              <div className="bg-gradient-gold h-px w-12 rounded-full" />
            </div>
            <h2 className="font-display text-charcoal text-3xl font-bold sm:text-4xl">
              {t('youMayAlsoLike')}
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((recProduct) => (
              <ProductCard key={recProduct.id} product={recProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
