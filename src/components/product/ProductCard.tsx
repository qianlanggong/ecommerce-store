import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Eye, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Product } from '@/types'
import { useLocale } from '@/hooks/useLocale'
import { useFavoritesStore, useCartStore } from '@/stores'
import { useToast } from '@/stores/toastStore'
import { useAddCartLines } from '@/services/cartService'
import { cn, getProductDisplayPrice, getDiscountPercent, isOnSale } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  index?: number
}

export function ProductCard({ product, className, index = 0 }: ProductCardProps) {
  const { t } = useTranslation('product')
  const { locale, localizePath } = useLocale()
  const [isHovered, setIsHovered] = useState(false)
  const [showAddedMessage, setShowAddedMessage] = useState(false)
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id))
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite)
  const toast = useToast()
  const addCartLines = useAddCartLines()
  const openDrawer = useCartStore((state) => state.openDrawer)

  const displayPrice = getProductDisplayPrice(product, locale === 'zh' ? 'zh-CN' : 'en-US')
  const firstVariant = product.variants.edges[0]?.node
  const discountPercent = firstVariant ? getDiscountPercent(firstVariant) : null
  const onSale = firstVariant ? isOnSale(firstVariant) : false

  const imageUrl = product.featuredImage?.url || product.images.edges[0]?.node.url
  const imageAlt = product.featuredImage?.altText || product.title

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!firstVariant || !product.availableForSale) return

      addCartLines.mutate(
        [{ merchandiseId: firstVariant.id, quantity: 1 }],
        {
          onSuccess: () => {
            setShowAddedMessage(true)
            setTimeout(() => setShowAddedMessage(false), 2000)
            openDrawer()
          },
        },
      )
    },
    [firstVariant, product.availableForSale, addCartLines, openDrawer],
  )

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFavorite(product.id)
      if (isFavorite) {
        toast.info(t('favoriteRemoved'))
      } else {
        toast.success(t('favoriteAdded'))
      }
    },
    [product.id, toggleFavorite, isFavorite, toast, t],
  )

  const productUrl = localizePath(`/products/${product.handle}`)
  const staggerClass = `stagger-${(index % 8) + 1}`

  return (
    <div
      className={cn(
        'group shadow-luxury hover:shadow-luxury-hover animate-fade-in-up relative flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-500 ease-out hover:-translate-y-2',
        staggerClass,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-cream relative aspect-square overflow-hidden">
        <Link to={productUrl} className="block h-full w-full">
          <img
            src={imageUrl}
            alt={imageAlt}
            className={cn(
              'h-full w-full object-cover transition-transform duration-700 ease-out',
              isHovered && 'scale-110',
            )}
            loading="lazy"
          />
        </Link>

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {onSale && discountPercent && (
          <span className="bg-wine font-body shadow-luxury animate-float absolute top-4 left-4 z-10 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}

        {!product.availableForSale && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="font-body text-charcoal shadow-luxury rounded-full bg-white px-6 py-3 text-sm font-medium">
              {t('outOfStock')}
            </span>
          </div>
        )}

        <div
          className={cn(
            'absolute top-4 right-4 z-10 flex flex-col gap-3 transition-all duration-500',
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0',
          )}
        >
          <button
            type="button"
            onClick={handleToggleFavorite}
            className={cn(
              'shadow-luxury border-luxury flex h-11 w-11 items-center justify-center rounded-full bg-white/95 transition-all duration-300 hover:scale-110',
              isFavorite ? 'text-wine' : 'text-muted-foreground hover:text-wine',
            )}
            aria-label={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div
          className={cn(
            'absolute right-0 bottom-0 left-0 z-10 flex translate-y-full items-center justify-center gap-2 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 transition-transform duration-500 ease-out',
            isHovered && 'translate-y-0',
          )}
        >
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!product.availableForSale || addCartLines.isPending}
            className="font-body text-charcoal hover:bg-primary shadow-luxury flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium transition-all duration-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {showAddedMessage ? (
              <>
                <Check size={16} />
                {t('addSuccess')}
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                {t('addToCart')}
              </>
            )}
          </button>
          <Link
            to={productUrl}
            className="text-muted-foreground hover:bg-primary shadow-luxury flex h-11 w-11 items-center justify-center rounded-lg bg-white/95 transition-all duration-300 hover:text-white"
            aria-label={t('viewDetails')}
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="font-body tracking-luxury text-primary mb-2 text-xs uppercase">
          {product.productType}
        </div>

        <Link to={productUrl} className="group/title">
          <h3 className="font-display text-charcoal group-hover/title:text-primary mb-3 line-clamp-2 text-lg transition-colors duration-300">
            {product.title}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-charcoal text-xl font-semibold">{displayPrice}</span>
            {onSale && firstVariant?.compareAtPrice && (
              <span className="font-body text-muted-foreground text-sm line-through">
                {locale === 'zh'
                  ? new Intl.NumberFormat('zh-CN', {
                      style: 'currency',
                      currency: firstVariant.compareAtPrice.currencyCode,
                    }).format(parseFloat(firstVariant.compareAtPrice.amount))
                  : new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: firstVariant.compareAtPrice.currencyCode,
                    }).format(parseFloat(firstVariant.compareAtPrice.amount))}
              </span>
            )}
          </div>

          {product.totalInventory > 0 && product.totalInventory <= 5 && (
            <span className="font-body text-gold animate-pulse text-xs font-medium">
              {t('lowStock')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
