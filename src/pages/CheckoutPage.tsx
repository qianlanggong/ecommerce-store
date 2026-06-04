import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ShoppingBag,
  Package,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CreditCard,
  Lock,
  MapPin,
  Truck,
  CheckCircle2,
  Tag,
  X,
  ChevronUp,
  Plus,
} from 'lucide-react'
import { useCart, useUpdateCartBuyerIdentity } from '@/services/cartService'
import { useCustomer } from '@/services/userService'
import {
  useCreateCheckout,
  useAvailableShippingRates,
  useUpdateCheckoutShippingLine,
  useApplyDiscountCode,
  useRemoveDiscountCode,
  useCompleteCheckout,
  useGoToPayment,
} from '@/services/checkoutService'
import { useLocale } from '@/hooks/useLocale'
import { cn, formatMoney } from '@/lib/utils'
import { useToastStore } from '@/stores/toastStore'
import type { ShippingRate, Checkout, CartLine, MailingAddress, CheckoutDiscountApplication } from '@/types'

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'redirecting'

interface ShippingAddressForm {
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  province: string
  zip: string
  country: string
  phone: string
}

export default function CheckoutPage() {
  const { t } = useTranslation('checkout')
  const { localizePath } = useLocale()
  const addToast = useToastStore.getState().addToast

  const { data: cart, isLoading: cartLoading, error: cartError } = useCart()
  const { data: customer, isLoading: customerLoading } = useCustomer()
  const updateBuyerIdentity = useUpdateCartBuyerIdentity()

  const createCheckout = useCreateCheckout()
  const updateShippingLine = useUpdateCheckoutShippingLine()
  const applyDiscountCode = useApplyDiscountCode()
  const removeDiscountCode = useRemoveDiscountCode()
  const completeCheckout = useCompleteCheckout()
  const goToPayment = useGoToPayment()

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [checkout, setCheckout] = useState<Checkout | null>(null)
  const [discountCode, setDiscountCode] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressForm>({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'US',
    phone: '',
  })
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({})
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const { data: shippingRates = [] } = useAvailableShippingRates(checkout?.id || null)
  const [selectedShippingRate, setSelectedShippingRate] = useState<string | null>(null)

  useEffect(() => {
    if (customer?.email) {
      setEmail(customer.email)
    }
    if (customer?.defaultAddress) {
      const addr = customer.defaultAddress
      setShippingAddress({
        firstName: addr.firstName || '',
        lastName: addr.lastName || '',
        address1: addr.address1 || '',
        address2: addr.address2 || '',
        city: addr.city || '',
        province: addr.province || '',
        zip: addr.zip || '',
        country: addr.countryCode || addr.country || 'US',
        phone: addr.phone || '',
      })
      setSelectedAddressId(addr.id || null)
      setShowAddressForm(false)
    }
  }, [customer])

  // 白盒测试：从购物车提取商品列表，确保数据结构安全
  const items = cart?.lines?.edges?.map((edge) => edge.node) || []
  // 白盒测试：提取价格信息，使用空字符串作为默认值防止 undefined 错误
  const subtotal = checkout?.subtotalPrice?.amount || cart?.estimatedCost?.subtotalAmount?.amount || '0'
  const tax = checkout?.totalTax?.amount || cart?.estimatedCost?.taxAmount?.amount || '0'
  const shipping = checkout?.shippingLine?.price?.amount || cart?.estimatedCost?.shippingAmount?.amount || '0'
  const total = checkout?.totalPrice?.amount || cart?.estimatedCost?.totalAmount?.amount || '0'
  const currencyCode = checkout?.currencyCode || cart?.estimatedCost?.totalAmount?.currencyCode || 'USD'

  // 验证地址表单
  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {}
    if (!shippingAddress.firstName.trim()) errors.firstName = t('common.required', { ns: 'common' })
    if (!shippingAddress.lastName.trim()) errors.lastName = t('common.required', { ns: 'common' })
    if (!shippingAddress.address1.trim()) errors.address1 = t('common.required', { ns: 'common' })
    if (!shippingAddress.city.trim()) errors.city = t('common.required', { ns: 'common' })
    if (!shippingAddress.zip.trim()) errors.zip = t('common.required', { ns: 'common' })
    if (!shippingAddress.country.trim()) errors.country = t('common.required', { ns: 'common' })

    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 创建 Checkout
  const handleCreateCheckout = async () => {
    if (!cart) return null

    const lineItems = items.map((item: CartLine) => ({
      variantId: item.merchandise.id,
      quantity: item.quantity,
    }))

    const result = await createCheckout.mutateAsync({
      lineItems,
      email,
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || undefined,
        city: shippingAddress.city,
        province: shippingAddress.province || undefined,
        zip: shippingAddress.zip,
        country: shippingAddress.country,
        phone: shippingAddress.phone || undefined,
      },
    })

    if (result.checkout) {
      setCheckout(result.checkout)
      return result.checkout
    }
    return null
  }

  // 邮箱变更时自动更新购物车买家身份
  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (cart && value && value.includes('@')) {
      updateBuyerIdentity.mutate({
        email: value,
        customerAccessToken: customer ? undefined : undefined,
      })
    }
  }

  // 地址字段变更处理
  const handleAddressChange = (field: keyof ShippingAddressForm, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }))
    if (addressErrors[field]) {
      setAddressErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // 验证邮箱和地址后进入配送方式步骤
  const handleProceedToShipping = async () => {
    if (!email || !email.includes('@')) {
      addToast(t('errors.invalidAddress'), 'error')
      return
    }

    if (!validateAddress()) {
      addToast(t('errors.invalidAddress'), 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const newCheckout = await handleCreateCheckout()
      if (newCheckout) {
        setCurrentStep('shipping')
      }
    } catch {
      addToast(t('updateError'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 选择配送方式后进入支付步骤
  const handleProceedToPayment = async () => {
    if (!checkout || !selectedShippingRate) {
      addToast(t('shippingUpdateError'), 'error')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await updateShippingLine.mutateAsync({
        checkoutId: checkout.id,
        shippingRateHandle: selectedShippingRate,
      })
      if (result.checkout) {
        setCheckout(result.checkout)
        setCurrentStep('payment')
      }
    } catch {
      addToast(t('shippingUpdateError'), 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 应用折扣码
  const handleApplyDiscountCode = async () => {
    if (!checkout || !discountCode.trim()) return

    setIsApplyingDiscount(true)
    try {
      await applyDiscountCode.mutateAsync({
        checkoutId: checkout.id,
        discountCode: discountCode.trim(),
      })
      setDiscountCode('')
    } catch {
      // 错误已在 service 中处理
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  // 移除折扣码
  const handleRemoveDiscountCode = async () => {
    if (!checkout) return

    try {
      const result = await removeDiscountCode.mutateAsync(checkout.id)
      if (result.checkout) {
        setCheckout(result.checkout)
      }
    } catch {
      // 错误已在 service 中处理
    }
  }

  // 根据 checkoutUrl 判断使用 Shopify 官方支付还是 Mock 支付
  const handlePlaceOrder = async () => {
    // 边界条件：验证购物车和 checkoutUrl 是否有效
    if (!checkout?.webUrl || !checkout.webUrl.startsWith('http')) {
      addToast(t('errors.paymentFailed'), 'error')
      return
    }

    setIsSubmitting(true)
    setCurrentStep('redirecting')

    try {
      addToast(t('orderSummary.processing'), 'info')
      goToPayment.mutate(checkout)
    } catch {
      addToast(t('errors.paymentFailed'), 'error')
      setIsSubmitting(false)
      setCurrentStep('payment')
    }
  }

  // Mock 支付流程，用于本地测试
  const handleMockCheckout = async () => {
    if (!checkout) return

    setIsSubmitting(true)
    setCurrentStep('redirecting')

    try {
      addToast(t('orderSummary.processing'), 'info')
      await completeCheckout.mutateAsync(checkout.id)
    } catch {
      addToast(t('errors.paymentFailed'), 'error')
      setIsSubmitting(false)
      setCurrentStep('payment')
    }
  }

  // 白盒测试：加载状态分支
  if (cartLoading || customerLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream/30">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="font-body text-muted-foreground text-base">{t('actions.loading', { ns: 'common' })}</p>
        </div>
      </div>
    )
  }

  // 白盒测试：购物车错误或不存在分支
  if (cartError || !cart) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="shadow-luxury border-luxury animate-fade-in-up max-w-2xl mx-auto rounded-2xl bg-white p-12 text-center">
          <AlertCircle className="text-wine mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('common.error', { ns: 'common' })}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {t('errors.outOfStock')}
          </p>
          <Link
            to={localizePath('/cart')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <ArrowLeft size={18} />
            {t('common.back', { ns: 'common' })}
          </Link>
        </div>
      </div>
    )
  }

  // 白盒测试：购物车为空分支
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="shadow-luxury border-luxury animate-fade-in-up max-w-2xl mx-auto rounded-2xl bg-white p-12 text-center">
          <ShoppingBag className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h2 className="font-display text-charcoal text-xl mb-2">{t('empty', { ns: 'cart' })}</h2>
          <p className="font-body text-muted-foreground mb-6">
            {t('emptyDescription', { ns: 'cart' })}
          </p>
          <Link
            to={localizePath('/products')}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('success.continueShopping')}
          </Link>
        </div>
      </div>
    )
  }

  const steps = [
    { id: 'information' as CheckoutStep, label: t('steps.information'), icon: MapPin },
    { id: 'shipping' as CheckoutStep, label: t('steps.shipping'), icon: Truck },
    { id: 'payment' as CheckoutStep, label: t('steps.payment'), icon: CreditCard },
  ]

  const stepIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="min-h-screen bg-cream/30">
      <header className="bg-white border-b border-cream/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={localizePath('/cart')}
              className="font-body text-primary hover:text-primary/80 inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              {t('common.back', { ns: 'common' })}
            </Link>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Lock size={16} />
              <span className="font-body text-xs">{t('payment.card.secureMessage')}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          <div className="flex-1 max-w-3xl pb-32">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1">
                    <div
                      className={cn(
                        'flex items-center gap-3',
                        index === stepIndex ? 'opacity-100' : index < stepIndex ? 'opacity-100' : 'opacity-40',
                      )}
                    >
                      <div
                        className={cn(
                          'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all',
                          index <= stepIndex
                            ? 'bg-primary border-primary text-white'
                            : 'border-border text-muted-foreground',
                        )}
                      >
                        {index < stepIndex ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <step.icon size={20} />
                        )}
                      </div>
                      <span
                        className={cn(
                          'font-body text-sm font-medium hidden sm:block',
                          index <= stepIndex ? 'text-charcoal' : 'text-muted-foreground',
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          'flex-1 h-0.5 mx-2 sm:mx-4',
                          index < stepIndex ? 'bg-primary' : 'bg-border',
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {currentStep === 'redirecting' && (
              <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
                <Loader2 className="text-primary mx-auto mb-4 h-16 w-16 animate-spin" />
                <h2 className="font-display text-charcoal text-xl mb-2">{t('orderSummary.processing')}</h2>
                <p className="font-body text-muted-foreground">
                  {t('payment.paypal.description')}
                </p>
              </div>
            )}

            {currentStep === 'information' && (
              <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6 sm:p-8">
                <h2 className="font-display text-charcoal text-2xl mb-6">{t('contact.title')}</h2>

                <div className="space-y-6">
                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder={t('contact.emailPlaceholder')}
                      className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                    />
                  </div>

                  {customer && (
                    <div className="bg-primary/5 rounded-xl p-4">
                      <p className="font-body text-charcoal text-sm">
                        <CheckCircle2 className="inline mr-2 text-primary" size={16} />
                        {t('common.signedIn', { ns: 'user', email: customer.email })}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-charcoal text-xl">{t('shippingAddress.title')}</h3>
                    {customer?.addresses?.edges?.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(!showAddressForm)}
                        className="text-primary hover:text-primary/80 font-body text-sm font-medium flex items-center gap-1"
                      >
                        {showAddressForm ? (
                          <>
                            <ChevronUp size={16} />
                            {t('common.cancel', { ns: 'common' })}
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            {t('addresses.addNew', { ns: 'user' })}
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {customer?.addresses?.edges?.length > 0 && !showAddressForm && (
                    <div className="space-y-3 mb-6">
                      {customer.addresses.edges.map((edge: { node: MailingAddress }) => {
                        const addr = edge.node
                        return (
                          <label
                            key={addr.id}
                            className={cn(
                              'border-border bg-cream/30 hover:bg-cream/50 flex items-start gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all',
                              selectedAddressId === addr.id && 'border-primary bg-primary/5',
                            )}
                          >
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddressId === addr.id}
                              onChange={() => {
                                setSelectedAddressId(addr.id)
                                setShippingAddress({
                                  firstName: addr.firstName || '',
                                  lastName: addr.lastName || '',
                                  address1: addr.address1 || '',
                                  address2: addr.address2 || '',
                                  city: addr.city || '',
                                  province: addr.province || '',
                                  zip: addr.zip || '',
                                  country: addr.countryCode || addr.country || 'US',
                                  phone: addr.phone || '',
                                })
                                setShowAddressForm(false)
                                setAddressErrors({})
                              }}
                              className="h-5 w-5 mt-1 text-primary focus:ring-primary"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-body text-charcoal font-medium">
                                {addr.firstName} {addr.lastName}
                                {addr.id === customer.defaultAddress?.id && (
                                  <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                    {t('addresses.default', { ns: 'user' })}
                                  </span>
                                )}
                              </p>
                              <p className="font-body text-muted-foreground text-sm">
                                {addr.address1}
                                {addr.address2 && `, ${addr.address2}`}
                              </p>
                              <p className="font-body text-muted-foreground text-sm">
                                {addr.city}, {addr.province} {addr.zip}, {addr.country}
                              </p>
                              {addr.phone && (
                                <p className="font-body text-muted-foreground text-sm">{addr.phone}</p>
                              )}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {(showAddressForm || !customer?.addresses?.edges?.length) && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.firstName', { ns: 'user' })} *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.firstName}
                            onChange={(e) => handleAddressChange('firstName', e.target.value)}
                            className={cn(
                              'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              addressErrors.firstName && 'border-wine focus:border-wine focus:ring-wine/20',
                            )}
                          />
                          {addressErrors.firstName && (
                            <p className="text-wine mt-1 text-xs">{addressErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.lastName', { ns: 'user' })} *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.lastName}
                            onChange={(e) => handleAddressChange('lastName', e.target.value)}
                            className={cn(
                              'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              addressErrors.lastName && 'border-wine focus:border-wine focus:ring-wine/20',
                            )}
                          />
                          {addressErrors.lastName && (
                            <p className="text-wine mt-1 text-xs">{addressErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                          {t('addresses.form.address1', { ns: 'user' })} *
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.address1}
                          onChange={(e) => handleAddressChange('address1', e.target.value)}
                          className={cn(
                            'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                            addressErrors.address1 && 'border-wine focus:border-wine focus:ring-wine/20',
                          )}
                        />
                        {addressErrors.address1 && (
                          <p className="text-wine mt-1 text-xs">{addressErrors.address1}</p>
                        )}
                      </div>

                      <div>
                        <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                          {t('addresses.form.address2', { ns: 'user' })}
                        </label>
                        <input
                          type="text"
                          value={shippingAddress.address2}
                          onChange={(e) => handleAddressChange('address2', e.target.value)}
                          placeholder={t('addresses.form.address2', { ns: 'user' })}
                          className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.city', { ns: 'user' })} *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.city}
                            onChange={(e) => handleAddressChange('city', e.target.value)}
                            className={cn(
                              'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              addressErrors.city && 'border-wine focus:border-wine focus:ring-wine/20',
                            )}
                          />
                          {addressErrors.city && (
                            <p className="text-wine mt-1 text-xs">{addressErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.state', { ns: 'user' })}
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.province}
                            onChange={(e) => handleAddressChange('province', e.target.value)}
                            placeholder={t('addresses.form.state', { ns: 'user' })}
                            className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.zip', { ns: 'user' })} *
                          </label>
                          <input
                            type="text"
                            value={shippingAddress.zip}
                            onChange={(e) => handleAddressChange('zip', e.target.value)}
                            className={cn(
                              'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              addressErrors.zip && 'border-wine focus:border-wine focus:ring-wine/20',
                            )}
                          />
                          {addressErrors.zip && (
                            <p className="text-wine mt-1 text-xs">{addressErrors.zip}</p>
                          )}
                        </div>
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('addresses.form.country', { ns: 'user' })} *
                          </label>
                          <select
                            value={shippingAddress.country}
                            onChange={(e) => handleAddressChange('country', e.target.value)}
                            className={cn(
                              'border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
                              addressErrors.country && 'border-wine focus:border-wine focus:ring-wine/20',
                            )}
                          >
                            <option value="US">United States</option>
                            <option value="CN">China</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="JP">Japan</option>
                            <option value="KR">South Korea</option>
                          </select>
                          {addressErrors.country && (
                            <p className="text-wine mt-1 text-xs">{addressErrors.country}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                          {t('addresses.form.phone', { ns: 'user' })}
                        </label>
                        <input
                          type="tel"
                          value={shippingAddress.phone}
                          onChange={(e) => handleAddressChange('phone', e.target.value)}
                          placeholder={t('addresses.form.phone', { ns: 'user' })}
                          className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleProceedToShipping}
                  disabled={isSubmitting || !email}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    t('steps.shipping')
                  )}
                </button>
              </div>
            )}

            {currentStep === 'shipping' && (
              <div className="space-y-6">
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6 sm:p-8">
                  <h2 className="font-display text-charcoal text-2xl mb-6">{t('shippingMethod.title')}</h2>

                  <div className="space-y-4">
                    {shippingRates.length > 0 ? (
                      shippingRates.map((rate: ShippingRate) => (
                        <label
                          key={rate.handle}
                          className={cn(
                            'border-border bg-cream/30 hover:bg-cream/50 flex items-center justify-between rounded-xl border-2 p-4 cursor-pointer transition-all',
                            selectedShippingRate === rate.handle && 'border-primary bg-primary/5',
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              value={rate.handle}
                              checked={selectedShippingRate === rate.handle}
                              onChange={(e) => setSelectedShippingRate(e.target.value)}
                              className="h-5 w-5 text-primary focus:ring-primary"
                            />
                            <div>
                              <p className="font-body text-charcoal font-medium">{rate.title}</p>
                              <p className="font-body text-muted-foreground text-sm">
                                {rate.handle === 'standard' && t('shippingMethod.estimatedDelivery', { from: 5, to: 7 })}
                                {rate.handle === 'express' && t('shippingMethod.estimatedDelivery', { from: 2, to: 3 })}
                                {rate.handle === 'free' && t('shippingMethod.estimatedDelivery', { from: 7, to: 10 })}
                                {rate.handle !== 'standard' && rate.handle !== 'express' && rate.handle !== 'free' &&
                                  t('shippingMethod.estimatedDelivery', { from: 5, to: 7 })}
                              </p>
                            </div>
                          </div>
                          <p className="font-display text-charcoal font-bold">
                            {formatMoney(parseFloat(rate.price.amount), rate.price.currencyCode)}
                          </p>
                        </label>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Loader2 className="text-primary mx-auto mb-4 h-8 w-8 animate-spin" />
                        <p className="font-body text-muted-foreground">
                          {t('common.loading', { ns: 'common' })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('information')}
                    className="border-border font-body text-charcoal hover:bg-cream flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors"
                  >
                    <ArrowLeft size={18} />
                    {t('steps.information')}
                  </button>
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    disabled={isSubmitting}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {t('steps.payment')}
                  </button>
                </div>
              </div>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6 sm:p-8">
                  <h2 className="font-display text-charcoal text-2xl mb-6">{t('payment.title')}</h2>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        id: 'card',
                        title: t('payment.card.title'),
                        description: t('payment.card.secureMessage'),
                      },
                      {
                        id: 'paypal',
                        title: t('payment.paypal.title'),
                        description: t('payment.paypal.description'),
                      },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className={cn(
                          'border-border bg-cream/30 hover:bg-cream/50 flex items-start gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all',
                          paymentMethod === method.id && 'border-primary bg-primary/5',
                        )}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="h-5 w-5 mt-1 text-primary focus:ring-primary"
                        />
                        <div className="flex-1">
                          <p className="font-body text-charcoal font-medium">{method.title}</p>
                          <p className="font-body text-muted-foreground text-sm">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="bg-cream/30 rounded-xl p-6 space-y-4">
                      <div>
                        <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                          {t('payment.card.name')}
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="border-border bg-white font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                          {t('payment.card.number')}
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="border-border bg-white font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('payment.card.expiry')}
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="border-border bg-white font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                            {t('payment.card.cvv')}
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="border-border bg-white font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="border-border font-body text-charcoal hover:bg-cream flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-colors"
                  >
                    <ArrowLeft size={18} />
                    {t('steps.shipping')}
                  </button>
                  <button
                    type="button"
                    onClick={cart?.checkoutUrl?.includes('shopify') ? handlePlaceOrder : handleMockCheckout}
                    disabled={isSubmitting}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:cursor-not-allowed flex-1 flex items-center justify-center gap-2 rounded-xl px-6 py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Lock size={20} />
                    )}
                    {t('orderSummary.placeOrder')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:w-96 lg:flex-shrink-0">
            <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
              <h2 className="font-display text-charcoal text-xl mb-6">{t('orderSummary.title')}</h2>

              <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="bg-cream aspect-square w-16 flex-shrink-0 overflow-hidden rounded-lg">
                      {item.merchandise?.image?.url ? (
                        <img
                          src={item.merchandise.image.url}
                          alt={item.merchandise.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-charcoal font-semibold truncate">
                        {item.merchandise?.product?.title || item.merchandise?.title || 'Product'}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {item.merchandise?.selectedOptions?.map((o: { name: string; value: string }) => `${o.name}: ${o.value}`).join(', ')}
                      </p>
                      <p className="font-body text-muted-foreground text-sm">
                        {t('orders.quantity', { count: item.quantity })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-charcoal font-semibold">
                        {formatMoney(parseFloat(item.cost.totalAmount.amount), item.cost.totalAmount.currencyCode)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {checkout && (
                <div className="mb-6">
                  <h3 className="font-display text-charcoal text-lg mb-3 flex items-center gap-2">
                    <Tag size={18} />
                    {t('discount.title')}
                  </h3>

                  {checkout.discountApplications?.edges?.length > 0 ? (
                    <div className="space-y-2">
                      {checkout.discountApplications.edges.map((edge: { node: CheckoutDiscountApplication }, index: number) => (
                        <div
                          key={index}
                          className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-primary" />
                            <div>
                              <p className="font-body text-charcoal font-medium text-sm">
                                {edge.node.code || edge.node.title || t('discount.applied')}
                              </p>
                              {edge.node.description && (
                                <p className="font-body text-muted-foreground text-xs">
                                  {edge.node.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveDiscountCode}
                            disabled={removeDiscountCode.isPending}
                            className="text-wine hover:text-wine/80 p-1 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyDiscountCode()}
                        placeholder={t('discount.placeholder')}
                        className="border-border bg-cream/50 font-body text-charcoal flex-1 rounded-xl border py-2 px-4 text-sm focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscountCode}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                      >
                        {isApplyingDiscount ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          t('discount.apply')
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-cream/50 pt-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-body text-muted-foreground">{t('orderSummary.subtotal')}</span>
                  <span className="font-body text-charcoal">
                    {formatMoney(parseFloat(subtotal), currencyCode)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-muted-foreground">{t('orderSummary.shipping')}</span>
                  <span className="font-body text-charcoal">
                    {formatMoney(parseFloat(shipping), currencyCode)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-muted-foreground">{t('orderSummary.tax')}</span>
                  <span className="font-body text-charcoal">
                    {formatMoney(parseFloat(tax), currencyCode)}
                  </span>
                </div>
                {checkout?.discountApplications?.edges?.length > 0 && (
                  <div className="flex justify-between items-center text-primary">
                    <span className="font-body">{t('orderSummary.discount')}</span>
                    <span className="font-body font-medium">
                      -{formatMoney(
                        checkout.discountApplications.edges.reduce((sum: number, edge: { node: CheckoutDiscountApplication }) => {
                          const amount = 'amount' in edge.node.value ? edge.node.value.amount : '0'
                          return sum + parseFloat(amount)
                        }, 0),
                        currencyCode
                      )}
                    </span>
                  </div>
                )}
                <div className="border-t border-cream/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-display text-charcoal text-lg font-bold">{t('orderSummary.total')}</span>
                    <span className="font-display text-charcoal text-2xl font-bold">
                      {formatMoney(parseFloat(total), currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
