import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X, ShoppingCart, Plus, Minus, Trash2, ArrowRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useCartActions } from '@/hooks/useCartActions'
import { useLocale } from '@/hooks/useLocale'
import { cn, formatMoney } from '@/lib/utils'

function CartDrawerLineItem({
  line,
  onUpdateQuantity,
  onRemove,
  isUpdating,
}: {
  line: {
    id: string
    quantity: number
    merchandise: {
      id: string
      title: string
      price: { amount: string; currencyCode: string }
      selectedOptions: Array<{ name: string; value: string }>
      image?: { url: string; altText?: string } | null
    }
    cost: {
      amountPerQuantity: { amount: string; currencyCode: string }
      totalAmount: { amount: string; currencyCode: string }
    }
    productTitle: string
    productImageUrl: string
  }
  onUpdateQuantity: (lineId: string, quantity: number) => Promise<void>
  onRemove: (lineId: string) => Promise<void>
  isUpdating: boolean
}) {
  const { t } = useTranslation('cart')
  const { localizePath } = useLocale()
  const closeDrawer = useCartStore((state) => state.closeDrawer)

  const variantOptions = line.merchandise.selectedOptions
    .map((opt) => opt.value)
    .join(' / ')

  return (
    <div className="border-cream/50 flex gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="aspect-square w-20 flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={line.productImageUrl}
          alt={line.productTitle}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={localizePath(`/products/${line.merchandise.id}`)}
              onClick={closeDrawer}
              className="font-display text-charcoal hover:text-primary truncate text-base font-semibold transition-colors"
            >
              {line.productTitle}
            </Link>
            <p className="font-body text-muted-foreground text-xs">{variantOptions}</p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(line.id)}
            disabled={isUpdating}
            className="text-muted-foreground hover:text-wine flex-shrink-0 p-1 transition-colors"
            aria-label={t('removeItem')}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQuantity(line.id, line.quantity - 1)}
              disabled={isUpdating || line.quantity <= 1}
              className="text-charcoal hover:bg-cream disabled:opacity-50 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="font-display text-charcoal w-8 text-center text-sm font-semibold">
              {isUpdating ? <Loader2 size={14} className="mx-auto animate-spin" /> : line.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(line.id, line.quantity + 1)}
              disabled={isUpdating}
              className="text-charcoal hover:bg-cream disabled:opacity-50 flex h-7 w-7 items-center justify-center rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <p className="font-display text-primary text-sm font-bold">
            {formatMoney(
              parseFloat(line.cost.totalAmount.amount),
              line.cost.totalAmount.currencyCode,
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { t } = useTranslation('cart')
  const { localizePath } = useLocale()
  const { isDrawerOpen, closeDrawer } = useCartStore()
  const { cartLines, isLoading, totalQuantity, total, updateQuantity, removeLine, checkoutUrl } =
    useCartActions()

  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer()
      }
    }

    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen, closeDrawer])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeDrawer()
    }
  }

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    await updateQuantity(lineId, quantity)
  }

  const handleRemoveLine = async (lineId: string) => {
    await removeLine(lineId)
  }

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isDrawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={handleBackdropClick}
      />

      <div
        ref={drawerRef}
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-cream/50 p-4">
          <h2 className="font-display text-charcoal flex items-center gap-2 text-xl font-bold">
            <ShoppingCart size={22} />
            {t('title')}
            {totalQuantity > 0 && (
              <span className="bg-gradient-gold text-cream flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold">
                {totalQuantity}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="text-charcoal hover:bg-cream rounded-full p-2 transition-colors"
            aria-label={t('actions.close', { ns: 'common' })}
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && cartLines.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : cartLines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="bg-cream text-muted-foreground flex h-20 w-20 items-center justify-center rounded-full">
                <ShoppingCart size={36} />
              </div>
              <div>
                <p className="font-display text-charcoal text-lg font-semibold">{t('empty')}</p>
                <p className="font-body text-muted-foreground mt-1 text-sm">
                  {t('emptyDescription')}
                </p>
              </div>
              <Link
                to={localizePath('/products')}
                onClick={closeDrawer}
                className="bg-gradient-gold text-cream mt-4 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                {t('continueShopping')}
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {cartLines.map((line) => (
                <CartDrawerLineItem
                  key={line.id}
                  line={line}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveLine}
                  isUpdating={false}
                />
              ))}
            </div>
          )}
        </div>

        {cartLines.length > 0 && (
          <div className="border-t border-cream/50 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-body text-charcoal/80 text-base">{t('total')}</span>
              <span className="bg-gradient-gold bg-clip-text text-xl font-bold text-transparent">
                {total
                  ? formatMoney(parseFloat(total.amount), total.currencyCode)
                  : '$0.00'}
              </span>
            </div>
            <div className="flex gap-3">
              <Link
                to={localizePath('/cart')}
                onClick={closeDrawer}
                className="border-cream text-charcoal hover:bg-cream flex-1 rounded-xl border px-4 py-3 text-center text-sm font-semibold transition-colors"
              >
                {t('title')}
              </Link>
              <Link
                to={checkoutUrl}
                onClick={closeDrawer}
                className="bg-gradient-gold text-cream flex flex-1 items-center justify-center gap-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                {t('proceedToCheckout')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
