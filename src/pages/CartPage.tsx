import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'
import { useCartActions } from '@/hooks/useCartActions'
import { useLocale } from '@/hooks/useLocale'
import { Empty } from '@/components/Empty'
import { cn, formatMoney } from '@/lib/utils'
import type { CartLine } from '@/types'

type CartLineWithMeta = CartLine & {
  productTitle: string
  productImageUrl: string
}

function CartLineItem({
  line,
  onUpdateQuantity,
  onRemove,
  isUpdating,
  index,
}: {
  line: CartLineWithMeta
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<void>
  onRemove: (lineId: string) => Promise<void>
  isUpdating: boolean
  index: number
}) {
  const { t } = useTranslation('cart')
  const [localQuantity, setLocalQuantity] = useState(line.quantity)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, localQuantity + delta)
    setLocalQuantity(newQuantity)
    onUpdateQuantity(line.id, newQuantity)
  }

  const handleRemove = () => {
    onRemove(line.id)
  }

  const price = parseFloat(line.cost.amountPerQuantity.amount)
  const subtotal = price * localQuantity
  const variantOptions = line.merchandise.selectedOptions
    .map((opt) => opt.value)
    .join(' / ')

  return (
    <div
      className={cn(
        'bg-white shadow-subtle border-cream/50 animate-fade-in-up flex flex-col gap-4 rounded-2xl border p-5 transition-all duration-300 hover:shadow-card sm:flex-row sm:items-center',
        `stagger-${index + 1}`,
      )}
    >
      <div className="aspect-square w-full flex-shrink-0 overflow-hidden rounded-xl sm:w-32">
        <img
          src={line.productImageUrl}
          alt={line.productTitle}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-charcoal text-xl font-semibold">
              {line.productTitle}
            </h3>
            <p className="font-body text-muted-foreground mt-1 text-sm">
              {variantOptions}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUpdating}
            className="text-muted-foreground hover:text-wine hover:bg-wine/5 group flex flex-shrink-0 items-center gap-1 rounded-lg p-2 text-sm transition-all"
            aria-label={t('removeItem')}
          >
            <Trash2 size={18} className="transition-transform group-hover:scale-110" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-body text-muted-foreground text-sm">{t('quantity')}:</span>
            <div className="flex items-center rounded-xl border border-cream bg-cream/30">
              <button
                type="button"
                onClick={() => handleQuantityChange(-1)}
                disabled={isUpdating || localQuantity <= 1}
                className="text-charcoal hover:bg-white disabled:opacity-50 flex h-10 w-10 items-center justify-center rounded-l-xl transition-all"
                aria-label="Decrease quantity"
              >
                <Minus size={16} />
              </button>
              <span className="font-display text-charcoal flex h-10 w-12 items-center justify-center text-center font-semibold">
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  localQuantity
                )}
              </span>
              <button
                type="button"
                onClick={() => handleQuantityChange(1)}
                disabled={isUpdating}
                className="text-charcoal hover:bg-white disabled:opacity-50 flex h-10 w-10 items-center justify-center rounded-r-xl transition-all"
                aria-label="Increase quantity"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="font-display text-primary text-xl font-bold">
              {formatMoney(subtotal, line.cost.amountPerQuantity.currencyCode)}
            </p>
            <p className="font-body text-muted-foreground text-sm">
              {formatMoney(price, line.cost.amountPerQuantity.currencyCode)} {t('item')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderSummary({
  subtotal,
  tax,
  total,
  checkoutUrl,
  isLoading,
}: {
  subtotal?: { amount: string; currencyCode: string }
  tax?: { amount: string; currencyCode: string }
  total?: { amount: string; currencyCode: string }
  checkoutUrl: string
  isLoading: boolean
}) {
  const { t } = useTranslation('cart')
  const { localizePath } = useLocale()

  const subtotalAmount = subtotal ? parseFloat(subtotal.amount) : 0
  const taxAmount = tax ? parseFloat(tax.amount) : 0
  const totalAmount = total ? parseFloat(total.amount) : 0
  const currencyCode = subtotal?.currencyCode || 'USD'

  return (
    <div className="bg-white shadow-luxury border-cream/50 sticky top-24 h-fit rounded-3xl border p-8">
      <h2 className="font-display text-charcoal mb-6 text-2xl font-bold">
        {t('summary')}
      </h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-charcoal/80 text-base">{t('subtotal')}</span>
          <span className="font-display text-charcoal text-lg font-semibold">
            {formatMoney(subtotalAmount, currencyCode)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-body text-charcoal/80 text-base">{t('shipping')}</span>
          <span className="font-body text-emerald-600 text-base font-medium">
            {t('freeShipping')}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-body text-charcoal/80 text-base">{t('tax')}</span>
          <span className="font-display text-charcoal text-lg font-semibold">
            {formatMoney(taxAmount, currencyCode)}
          </span>
        </div>

        <div className="border-cream/50 my-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-charcoal text-xl font-bold">{t('total')}</span>
            <span className="bg-gradient-gold bg-clip-text text-2xl font-bold text-transparent">
              {formatMoney(totalAmount, currencyCode)}
            </span>
          </div>
          <p className="font-body text-muted-foreground mt-1 text-xs text-right">
            {t('taxCalculatedAtCheckout')}
          </p>
        </div>
      </div>

      <Link
        to={checkoutUrl}
        className={cn(
          'bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:-translate-y-0.5',
          isLoading && 'pointer-events-none opacity-50',
        )}
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <>
            {t('proceedToCheckout')}
            <ArrowRight size={20} />
          </>
        )}
      </Link>

      <Link
        to={localizePath('/products')}
        className="font-body text-charcoal hover:text-primary mt-4 flex w-full items-center justify-center gap-2 text-base font-medium transition-colors"
      >
        <ShoppingBag size={18} />
        {t('continueShopping')}
      </Link>
    </div>
  )
}

export default function CartPage() {
  const { t } = useTranslation('cart')
  const { localizePath } = useLocale()
  const {
    cartLines,
    isLoading,
    totalQuantity,
    subtotal,
    total,
    tax,
    checkoutUrl,
    updateQuantity,
    removeLine,
    clearCart,
  } = useCartActions()

  const [updatingLineId, setUpdatingLineId] = useState<string | null>(null)

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    setUpdatingLineId(lineId)
    try {
      await updateQuantity(lineId, quantity)
    } finally {
      setUpdatingLineId(null)
    }
  }

  const handleRemoveLine = async (lineId: string) => {
    setUpdatingLineId(lineId)
    try {
      await removeLine(lineId)
    } finally {
      setUpdatingLineId(null)
    }
  }

  const handleClearCart = () => {
    if (confirm(t('clearCartConfirm') || 'Are you sure you want to clear your cart?')) {
      clearCart()
    }
  }

  if (isLoading && cartLines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (cartLines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <Empty
          icon={<ShoppingCart size={64} />}
          title={t('empty')}
          description={t('emptyDescription')}
          actionLabel={t('continueShopping')}
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
            {t('title')}
          </h1>
          <p className="font-body text-muted-foreground mt-3 text-lg">
            {t('itemsCount', { count: totalQuantity })}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          className="group border-wine/30 text-wine hover:bg-wine/10 shadow-subtle flex items-center gap-2 rounded-xl border-2 bg-white px-6 py-3.5 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
        >
          <Trash2 size={20} className="transition-transform duration-300 group-hover:scale-110" />
          {t('filter.clearAll', { ns: 'product' })}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartLines.map((line, index) => (
            <CartLineItem
              key={line.id}
              line={line}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveLine}
              isUpdating={updatingLineId === line.id}
              index={index}
            />
          ))}
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            total={total}
            checkoutUrl={checkoutUrl}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
