import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { useProducts } from '@/services/productService'
import { useFavoritesStore } from '@/stores'
import { useLocale } from '@/hooks/useLocale'
import { ProductCard } from '@/components/product/ProductCard'
import { Empty } from '@/components/Empty'

export default function FavoritesPage() {
  const { t } = useTranslation('product')
  const { localizePath } = useLocale()
  const { data: productsData } = useProducts({ first: 100 })
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites)

  const favoriteProducts = useMemo(() => {
    const allProducts = productsData?.edges.map((edge) => edge.node) || []
    return allProducts.filter((product) => favoriteIds.includes(product.id))
  }, [productsData, favoriteIds])

  const handleClearAll = () => {
    if (confirm(t('clearFavoritesConfirm'))) {
      clearFavorites()
    }
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Empty
          icon={<Heart size={64} />}
          title={t('noFavorites')}
          description={t('noFavoritesDescription')}
          actionLabel={t('browseProducts')}
          actionLink={localizePath('/products')}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-fade-in-up mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-charcoal text-4xl font-bold lg:text-5xl">
            {t('myFavorites')}
          </h1>
          <p className="font-body text-muted-foreground mt-3 text-lg">
            {t('favoritesCount', { count: favoriteProducts.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className="group border-wine/30 text-wine hover:bg-wine/10 shadow-subtle flex items-center gap-2 rounded-xl border-2 bg-white px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
        >
          <Trash2 size={20} className="transition-transform duration-300 group-hover:scale-110" />
          {t('filter.clearAll')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {favoriteProducts.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      <div className="animate-fade-in-up stagger-3 mt-16">
        <div className="bg-cream/50 shadow-luxury border-luxury overflow-hidden rounded-3xl p-10 text-center">
          <div className="bg-gradient-gold text-cream shadow-luxury mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
            <ShoppingBag size={36} />
          </div>
          <h2 className="font-display text-charcoal mb-4 text-3xl font-bold">
            {t('readyToShop')}
          </h2>
          <p className="font-body text-muted-foreground mx-auto mb-8 max-w-xl text-lg">
            {t('readyToShopDescription')}
          </p>
          <Link
            to={localizePath('/products')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-2xl px-10 py-4.5 text-lg font-semibold transition-all duration-300 hover:-translate-y-1"
          >
            {t('continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  )
}
