import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Sparkles, Zap, Gift } from 'lucide-react'
import { useProducts, useCollections } from '@/services/productService'
import { ProductCard } from '@/components/product/ProductCard'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

export default function Home() {
  const { t } = useTranslation('home')
  const { localizePath } = useLocale()

  const { data: productsData, isLoading: productsLoading } = useProducts({
    first: 8,
    sortKey: 'BEST_SELLING',
  })
  const { data: collectionsData, isLoading: collectionsLoading } = useCollections()

  const featuredProducts = productsData?.edges.map((edge) => edge.node).slice(0, 8) || []
  const collections = collectionsData?.edges.map((edge) => edge.node) || []

  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: t('qualityProducts'),
      description: t('qualityProductsDescription'),
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: t('freeShipping'),
      description: t('freeShippingDescription'),
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: t('fastDelivery'),
      description: t('fastDeliveryDescription'),
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: t('easyReturns'),
      description: t('easyReturnsDescription'),
    },
  ]

  return (
    <div className="pb-20">
      <section className="bg-gradient-luxury relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(35_60%_85%/0.3),transparent_50%)]" />
        <div className="from-gold/20 to-primary/20 animate-float absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br blur-3xl" />
        <div
          className="from-wine/10 to-forest/10 animate-float absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br blur-3xl"
          style={{ animationDelay: '2s' }}
        />

        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div className="animate-fade-in-up">
              <span className="bg-primary/10 font-body text-primary animate-shimmer mb-6 inline-block rounded-full px-5 py-2 text-sm font-medium">
                {t('newCollection')}
              </span>
              <h1 className="font-display text-charcoal mb-6 text-5xl leading-tight text-balance lg:text-6xl xl:text-7xl">
                {t('heroTitle')}
              </h1>
              <p className="font-body text-muted-foreground mb-10 text-xl leading-relaxed text-pretty lg:text-2xl">
                {t('heroDescription')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to={localizePath('/products')}
                  className="group bg-gradient-gold font-body shadow-luxury hover:shadow-luxury-hover flex items-center justify-center gap-3 rounded-lg px-10 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {t('shopNow')}
                  <ArrowRight
                    size={20}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
                <Link
                  to={localizePath('/collections')}
                  className="group border-primary font-body text-primary shadow-luxury hover:bg-primary hover:shadow-luxury-hover flex items-center justify-center gap-3 rounded-lg border-2 bg-white px-10 py-4 text-base font-semibold transition-all duration-300 hover:text-white"
                >
                  {t('viewCollections')}
                </Link>
              </div>
            </div>

            <div className="animate-fade-in-up stagger-2 relative">
              <div className="from-primary/20 via-gold/10 to-wine/10 shadow-luxury relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br p-6">
                <img
                  src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20ecommerce%20hero%20image%20with%20elegant%20fashion%20products%20and%20accessories%20on%20marble%20background%20with%20gold%20accents&image_size=square_hd"
                  alt="Featured Collection"
                  className="h-full w-full rounded-2xl object-cover shadow-2xl transition-transform duration-700 hover:scale-105"
                />
                <div className="border-luxury pointer-events-none absolute inset-0 rounded-3xl" />
              </div>
              <div className="shadow-luxury animate-float absolute -bottom-8 -left-8 hidden rounded-2xl bg-white p-5 lg:block">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-gold shadow-luxury flex h-14 w-14 items-center justify-center rounded-full text-white">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="font-display text-charcoal text-base font-semibold">
                      {t('satisfactionGuarantee')}
                    </div>
                    <div className="font-body text-muted-foreground text-xs">
                      {t('satisfactionGuaranteeDescription')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={cn(
                'group hover:border-luxury hover:shadow-luxury-hover animate-fade-in-up flex items-start gap-5 rounded-2xl border border-transparent bg-white p-6 transition-all duration-500',
                `stagger-${index + 1}`,
              )}
            >
              <div className="from-primary/10 to-gold/10 text-primary group-hover:from-primary group-hover:to-gold flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300 group-hover:scale-110 group-hover:text-white">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-display text-charcoal mb-1 text-xl">{feature.title}</h3>
                <p className="font-body text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div className="animate-fade-in-up">
            <h2 className="font-display text-charcoal text-4xl text-balance lg:text-5xl">
              {t('shopByCollection')}
            </h2>
            <p className="font-body text-muted-foreground mt-3 text-lg">
              {t('shopByCollectionDescription')}
            </p>
          </div>
          <Link
            to={localizePath('/collections')}
            className="group font-body text-primary hover:text-primary/80 hidden items-center gap-2 text-base font-medium transition-all lg:flex"
          >
            {t('viewAll')}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {collectionsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-cream aspect-[4/3] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => (
              <Link
                key={collection.id}
                to={localizePath(`/collections/${collection.handle}`)}
                className={cn(
                  'group animate-fade-in-up relative overflow-hidden rounded-2xl',
                  `stagger-${index + 1}`,
                )}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={
                      collection.image?.url ||
                      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=minimal%20luxury%20product%20collection%20background%20with%20marble%20and%20gold&image_size=landscape_4_3'
                    }
                    alt={collection.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute right-0 bottom-0 left-0 p-8">
                  <h3 className="font-display mb-2 text-2xl text-white">{collection.title}</h3>
                  <p className="font-body text-sm text-gray-200">
                    {t('productCount', { count: collection.products.edges.length })}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {t('viewAll')}
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div className="animate-fade-in-up">
            <h2 className="font-display text-charcoal text-4xl text-balance lg:text-5xl">
              {t('bestSellers')}
            </h2>
            <p className="font-body text-muted-foreground mt-3 text-lg">
              {t('bestSellersDescription')}
            </p>
          </div>
          <Link
            to={localizePath('/products')}
            className="group font-body text-primary hover:text-primary/80 hidden items-center gap-2 text-base font-medium transition-all lg:flex"
          >
            {t('viewAll')}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-cream h-96 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        <div className="animate-fade-in-up mt-12 text-center lg:hidden">
          <Link
            to={localizePath('/products')}
            className="font-body text-primary hover:text-primary/80 inline-flex items-center gap-2 text-base font-medium transition-all"
          >
            {t('viewAllProducts')}
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="from-primary via-gold to-primary shadow-luxury overflow-hidden rounded-3xl bg-gradient-to-br p-12 text-center text-white lg:p-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display animate-fade-in-up mb-4 text-4xl text-balance text-white lg:text-5xl">
              {t('newsletterTitle')}
            </h2>
            <p className="font-body animate-fade-in-up stagger-1 mb-8 text-lg text-white/90">
              {t('newsletterDescription')}
            </p>
            <div className="animate-fade-in-up stagger-2 mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder={t('emailPlaceholder')}
                className="font-body text-charcoal placeholder:text-muted-foreground shadow-luxury flex-1 rounded-lg border-0 bg-white/95 px-5 py-3.5 text-base focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <button
                type="button"
                className="bg-charcoal font-body hover:shadow-luxury-hover shadow-luxury rounded-lg px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-black active:scale-95"
              >
                {t('subscribe')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
