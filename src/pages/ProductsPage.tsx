import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Filter, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { useProducts, useCollections } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import { cn } from '@/lib/utils'
import type { ProductFilter } from '@/types'

type ViewMode = 'grid' | 'list'

export default function ProductsPage() {
  const { t } = useTranslation('product')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState<ProductFilter>({
    first: 12,
    sortKey: 'RELEVANCE',
    reverse: false,
  })
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)

  const { data: productsData, isLoading, error } = useProducts(filter)
  const { data: collectionsData } = useCollections()

  const products = useMemo(() => {
    return productsData?.edges.map((edge) => edge.node) || []
  }, [productsData])

  const collections = useMemo(() => {
    return collectionsData?.edges.map((edge) => edge.node) || []
  }, [collectionsData])

  const handleSortChange = (sortKey: NonNullable<ProductFilter['sortKey']>) => {
    setFilter((prev) => ({ ...prev, sortKey }))
  }

  const handlePriceRangeChange = (minPrice?: string, maxPrice?: string) => {
    setFilter((prev) => ({ ...prev, minPrice, maxPrice }))
  }

  if (error) {
    return (
      <div className="animate-fade-in-up container mx-auto px-4 py-20 text-center">
        <div className="bg-wine/10 shadow-luxury mx-auto max-w-md rounded-2xl p-12">
          <h2 className="font-display text-wine text-2xl">{t('errorLoading')}</h2>
          <p className="font-body text-muted-foreground mt-3 text-base">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-fade-in-up mb-10">
        <h1 className="font-display text-charcoal text-4xl text-balance lg:text-5xl">
          {t('allProducts')}
        </h1>
        <p className="font-body text-muted-foreground mt-3 text-lg">
          {t('productsFound', { count: products.length })}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside
          className={cn('lg:w-72 lg:flex-shrink-0', showFilters ? 'block' : 'hidden lg:block')}
        >
          <div className="shadow-luxury border-luxury animate-fade-in-up stagger-1 sticky top-28 space-y-8 rounded-2xl bg-white p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-charcoal text-2xl">{t('filters')}</h2>
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="text-muted-foreground hover:text-charcoal hover:bg-cream rounded-full p-2 transition-colors lg:hidden"
              >
                ✕
              </button>
            </div>

            {collections.length > 0 && (
              <div>
                <h3 className="font-display text-charcoal mb-4 text-lg">{t('collections')}</h3>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCollection(null)}
                    className={cn(
                      'font-body w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300',
                      selectedCollection === null
                        ? 'bg-gradient-gold shadow-luxury text-white'
                        : 'text-charcoal hover:bg-cream',
                    )}
                  >
                    {t('allProducts')}
                  </button>
                  {collections.map((collection) => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => setSelectedCollection(collection.handle)}
                      className={cn(
                        'font-body w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300',
                        selectedCollection === collection.handle
                          ? 'bg-gradient-gold shadow-luxury text-white'
                          : 'text-charcoal hover:bg-cream',
                      )}
                    >
                      {collection.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-display text-charcoal mb-4 text-lg">{t('priceRange')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="font-body text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-xl border px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
                    onChange={(e) =>
                      handlePriceRangeChange(e.target.value || undefined, filter.maxPrice)
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-body text-muted-foreground text-sm">$</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 flex-1 rounded-xl border px-4 py-3 text-sm transition-all focus:ring-2 focus:outline-none"
                    onChange={(e) =>
                      handlePriceRangeChange(filter.minPrice, e.target.value || undefined)
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-charcoal mb-4 text-lg">{t('sortBy')}</h3>
              <div className="space-y-2">
                {[
                  { value: 'RELEVANCE', label: t('relevance') },
                  { value: 'TITLE', label: t('nameAZ') },
                  { value: 'PRICE', label: t('priceLowToHigh') },
                  { value: 'CREATED', label: t('newest') },
                  { value: 'BEST_SELLING', label: t('bestSelling') },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      handleSortChange(option.value as NonNullable<ProductFilter['sortKey']>)
                    }
                    className={cn(
                      'font-body w-full rounded-xl px-4 py-3 text-left text-sm transition-all duration-300',
                      filter.sortKey === option.value
                        ? 'bg-gradient-gold shadow-luxury text-white'
                        : 'text-charcoal hover:bg-cream',
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="animate-fade-in-up stagger-2 mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="border-border font-body text-charcoal shadow-luxury hover:shadow-luxury-hover flex items-center gap-3 rounded-xl border bg-white px-6 py-3.5 text-base font-medium transition-all hover:-translate-y-0.5 lg:hidden"
            >
              <Filter size={20} />
              {t('filters')}
            </button>

            <div className="flex items-center gap-3">
              <span className="font-body text-muted-foreground text-sm">{t('view')}:</span>
              <div className="border-border shadow-luxury flex overflow-hidden rounded-xl border">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center transition-all duration-300',
                    viewMode === 'grid'
                      ? 'bg-gradient-gold text-white'
                      : 'text-muted-foreground hover:bg-cream bg-white',
                  )}
                  aria-label={t('gridView')}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'flex h-11 w-11 items-center justify-center transition-all duration-300',
                    viewMode === 'list'
                      ? 'bg-gradient-gold text-white'
                      : 'text-muted-foreground hover:bg-cream bg-white',
                  )}
                  aria-label={t('listView')}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-cream shadow-luxury h-96 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="border-luxury shadow-luxury animate-fade-in-up rounded-2xl bg-white p-16 text-center">
              <SlidersHorizontal className="text-primary mx-auto mb-6 h-16 w-16" />
              <h3 className="font-display text-charcoal text-2xl">{t('noProductsFound')}</h3>
              <p className="font-body text-muted-foreground mt-3 text-base">
                {t('tryAdjustingFilters')}
              </p>
            </div>
          ) : (
            <div
              className={cn(
                'gap-6',
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                  : 'flex flex-col',
              )}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>
          )}

          {productsData?.pageInfo.hasNextPage && (
            <div className="animate-fade-in-up mt-12 text-center">
              <button
                type="button"
                onClick={() => setFilter((prev) => ({ ...prev, first: (prev.first || 12) + 12 }))}
                className="group border-primary font-body text-primary shadow-luxury hover:bg-primary hover:shadow-luxury-hover rounded-xl border-2 bg-white px-10 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-1 hover:text-white"
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
