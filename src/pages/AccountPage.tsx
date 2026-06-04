import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  Settings,
  LogOut,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Star,
} from 'lucide-react'
import {
  useCustomer,
  useOrders,
  useLogout,
  useUpdateCustomer,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn, formatDate, formatMoney } from '@/lib/utils'
import { useFavoritesStore } from '@/stores/favoritesStore'
import { useProducts } from '@/services/productService'
import AddressForm from '@/components/user/AddressForm'
import { ProductCard } from '@/components/product/ProductCard'
import type { Order, MailingAddress, CustomerUpdateInput } from '@/types'
import { OrderFinancialStatus, OrderFulfillmentStatus } from '@/types'

type TabType = 'dashboard' | 'orders' | 'addresses' | 'favorites' | 'settings'

export default function AccountPage() {
  const { t } = useTranslation('user')
  const { localizePath, locale } = useLocale()
  const navigate = useNavigate()
  const { data: customer, isLoading: customerLoading } = useCustomer()
  const { data: ordersData, isLoading: ordersLoading } = useOrders(5)
  const logout = useLogout()
  const updateCustomer = useUpdateCustomer()
  const deleteAddress = useDeleteAddress()
  const setDefaultAddress = useSetDefaultAddress()

  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<MailingAddress | null>(null)
  const [profileForm, setProfileForm] = useState<CustomerUpdateInput>({})
  const [showProfileSuccess, setShowProfileSuccess] = useState(false)

  const favoriteIds = useFavoritesStore((state) => state.favoriteIds)
  const { data: productsData } = useProducts()
  const allProducts = productsData?.edges.map((edge) => edge.node) || []
  const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id))

  const orders = ordersData?.edges.map((edge) => edge.node) || []

  useEffect(() => {
    if (customer) {
      setProfileForm({
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        email: customer.email,
        phone: customer.phone || '',
      })
    }
  }, [customer])

  const handleLogout = async () => {
    await logout.mutateAsync()
    navigate(localizePath('/'), { replace: true })
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setShowAddressForm(true)
  }

  const handleEditAddress = (address: MailingAddress) => {
    setEditingAddress(address)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (window.confirm(t('addresses.delete') + '?')) {
      await deleteAddress.mutateAsync(addressId)
    }
  }

  const handleSetDefaultAddress = async (addressId: string) => {
    await setDefaultAddress.mutateAsync(addressId)
  }

  const handleProfileChange = (field: keyof CustomerUpdateInput, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
    if (showProfileSuccess) {
      setShowProfileSuccess(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateCustomer.mutateAsync(profileForm)
      setShowProfileSuccess(true)
      setTimeout(() => setShowProfileSuccess(false), 3000)
    } catch {
      // 错误已在 service 层处理
    }
  }

  const getStatusColor = (status: OrderFinancialStatus | OrderFulfillmentStatus) => {
    switch (status) {
      case OrderFinancialStatus.PAID:
      case OrderFulfillmentStatus.FULFILLED:
        return 'bg-green-100 text-green-700'
      case OrderFinancialStatus.PENDING:
      case OrderFulfillmentStatus.OPEN:
      case OrderFulfillmentStatus.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700'
      case OrderFinancialStatus.REFUNDED:
      case OrderFinancialStatus.VOIDED:
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: OrderFulfillmentStatus) => {
    switch (status) {
      case OrderFulfillmentStatus.FULFILLED:
        return <CheckCircle size={16} />
      case OrderFulfillmentStatus.IN_PROGRESS:
      case OrderFulfillmentStatus.OPEN:
        return <Truck size={16} />
      default:
        return <Package size={16} />
    }
  }

  const menuItems = [
    { id: 'dashboard' as TabType, icon: User, label: t('account.dashboard') },
    { id: 'orders' as TabType, icon: ShoppingBag, label: t('account.orders') },
    { id: 'addresses' as TabType, icon: MapPin, label: t('account.addresses') },
    { id: 'favorites' as TabType, icon: Heart, label: t('account.favorites') },
    { id: 'settings' as TabType, icon: Settings, label: t('account.settings') },
  ]

  if (customerLoading || !customer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="font-body text-muted-foreground text-base">{t('account.loading')}</p>
        </div>
      </div>
    )
  }

  const memberSince = new Date(customer.createdAt)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-72 lg:flex-shrink-0">
          <div className="shadow-luxury border-luxury animate-fade-in-up sticky top-28 rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-gradient-gold shadow-luxury flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-2xl text-white">
                {customer.firstName?.charAt(0) || customer.displayName.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-charcoal truncate text-xl font-semibold">
                  {customer.displayName}
                </h2>
                <p className="font-body text-muted-foreground truncate text-sm">
                  {customer.email}
                </p>
              </div>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'font-body flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-300',
                    activeTab === item.id
                      ? 'bg-gradient-gold text-cream shadow-luxury'
                      : 'text-charcoal hover:bg-cream',
                  )}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="mt-6 pt-6 border-t border-cream/50">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className="font-body text-wine hover:bg-wine/10 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all duration-300"
              >
                <LogOut size={20} />
                {t('logout.title')}
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="animate-fade-in-up">
                <h1 className="font-display text-charcoal text-3xl mb-2">
                  {t('account.welcome', { name: customer.firstName || customer.displayName })}
                </h1>
                <p className="font-body text-muted-foreground">
                  {t('account.memberSince', { date: formatDate(memberSince, locale === 'zh' ? 'zh-CN' : 'en-US') })}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="shadow-luxury border-luxury animate-fade-in-up stagger-1 rounded-2xl bg-white p-6">
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <ShoppingBag size={24} />
                  </div>
                  <p className="font-body text-muted-foreground text-sm mb-1">
                    {t('account.totalOrders')}
                  </p>
                  <p className="font-display text-charcoal text-3xl font-bold">
                    {customer.numberOfOrders}
                  </p>
                </div>

                <div className="shadow-luxury border-luxury animate-fade-in-up stagger-2 rounded-2xl bg-white p-6">
                  <div className="bg-gold/10 text-gold mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <MapPin size={24} />
                  </div>
                  <p className="font-body text-muted-foreground text-sm mb-1">
                    {t('account.savedAddresses')}
                  </p>
                  <p className="font-display text-charcoal text-3xl font-bold">
                    {customer.addresses.edges.length}
                  </p>
                </div>

                <div className="shadow-luxury border-luxury animate-fade-in-up stagger-3 rounded-2xl bg-white p-6">
                  <div className="bg-wine/10 text-wine mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                    <Heart size={24} />
                  </div>
                  <p className="font-body text-muted-foreground text-sm mb-1">
                    {t('account.favoritesCount')}
                  </p>
                  <p className="font-display text-charcoal text-3xl font-bold">
                    0
                  </p>
                </div>
              </div>

              {orders.length > 0 && (
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-charcoal text-xl">{t('account.recentOrders')}</h2>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="font-body text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                    >
                      {t('account.viewAll')}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order, index) => (
                      <div
                        key={order.id}
                        className={cn(
                          'flex items-center justify-between rounded-xl p-4 transition-all hover:bg-cream/50',
                          `animate-fade-in-up stagger-${index + 1}`,
                        )}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={cn(
                            'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl',
                            getStatusColor(order.fulfillmentStatus),
                          )}>
                            {getStatusIcon(order.fulfillmentStatus)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-charcoal font-semibold truncate">
                              {t('orders.orderNumber', { number: order.orderNumber })}
                            </p>
                            <p className="font-body text-muted-foreground text-sm">
                              {t('orders.placedOn', { date: formatDate(new Date(order.processedAt), locale === 'zh' ? 'zh-CN' : 'en-US') })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-display text-charcoal font-semibold">
                            {formatMoney(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
                          </p>
                          <ChevronRight className="text-muted-foreground flex-shrink-0" size={20} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h1 className="font-display text-charcoal animate-fade-in-up text-3xl">
                {t('orders.title')}
              </h1>

              {ordersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="text-primary h-8 w-8 animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
                  <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h2 className="font-display text-charcoal text-xl mb-2">{t('orders.noOrders')}</h2>
                  <p className="font-body text-muted-foreground mb-6">
                    {t('orders.noOrdersDescription')}
                  </p>
                  <Link
                    to={localizePath('/products')}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {t('orders.startShopping')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={index}
                      locale={locale}
                      t={t}
                      localizePath={localizePath}
                      getStatusColor={getStatusColor}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="animate-fade-in-up flex items-center justify-between">
                <h1 className="font-display text-charcoal text-3xl">{t('addresses.title')}</h1>
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Plus size={18} />
                  {t('addresses.addNew')}
                </button>
              </div>

              {customer.addresses.edges.length === 0 ? (
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
                  <MapPin className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h2 className="font-display text-charcoal text-xl mb-2">
                    {t('addresses.noAddresses')}
                  </h2>
                  <p className="font-body text-muted-foreground mb-6">
                    {t('addresses.noAddressesDescription')}
                  </p>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Plus size={18} />
                    {t('addresses.addNew')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {customer.addresses.edges.map((edge, index) => {
                    const address = edge.node
                    const isDefault = customer.defaultAddress?.id === address.id
                    return (
                      <div
                        key={address.id}
                        className={cn(
                          'shadow-luxury border-luxury animate-fade-in-up relative rounded-2xl bg-white p-6',
                          `stagger-${(index % 4) + 1}`,
                        )}
                      >
                        {isDefault && (
                          <span className="bg-gradient-gold text-cream absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold">
                            {t('addresses.default')}
                          </span>
                        )}
                        <h3 className="font-display text-charcoal mb-2 text-lg font-semibold">
                          {address.firstName} {address.lastName}
                        </h3>
                        <div className="font-body text-muted-foreground space-y-1 text-sm">
                          <p>{address.address1}</p>
                          {address.address2 && <p>{address.address2}</p>}
                          <p>
                            {address.city}, {address.province || address.provinceCode} {address.zip}
                          </p>
                          <p>{address.country}</p>
                          {address.phone && <p className="text-charcoal">{address.phone}</p>}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditAddress(address)}
                            className="font-body text-primary hover:bg-primary/10 flex items-center gap-1.5 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                          >
                            <Edit3 size={16} />
                            {t('addresses.edit')}
                          </button>
                          {!isDefault && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                disabled={setDefaultAddress.isPending}
                                className="font-body text-secondary hover:bg-secondary/10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                              >
                                <Star size={16} />
                                {t('addresses.setDefault')}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={deleteAddress.isPending}
                                className="font-body text-wine hover:bg-wine/10 flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                              >
                                <Trash2 size={16} />
                                {t('addresses.delete')}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-6">
              <div className="animate-fade-in-up flex items-center justify-between">
                <h1 className="font-display text-charcoal text-3xl">
                  {t('account.favorites')}
                </h1>
                <span className="font-body text-muted-foreground text-sm">
                  {favoriteIds.length} {t('account.favoritesCount').toLowerCase()}
                </span>
              </div>

              {favoriteProducts.length === 0 ? (
                <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-12 text-center">
                  <Heart className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
                  <h2 className="font-display text-charcoal text-xl mb-2">
                    {t('favorites.noFavorites')}
                  </h2>
                  <p className="font-body text-muted-foreground mb-6">
                    {t('favorites.noFavoritesDescription')}
                  </p>
                  <Link
                    to={localizePath('/products')}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    {t('favorites.browseProducts')}
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className={cn('animate-fade-in-up', `stagger-${(index % 4) + 1}`)}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h1 className="font-display text-charcoal animate-fade-in-up text-3xl">
                {t('account.settings')}
              </h1>
              <div className="shadow-luxury border-luxury animate-fade-in-up rounded-2xl bg-white p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-charcoal text-xl">
                    {t('profile.title')}
                  </h2>
                  {showProfileSuccess && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <CheckCircle size={16} />
                      {t('profile.saved')}
                    </div>
                  )}
                  {updateCustomer.isError && (
                    <div className="flex items-center gap-2 text-wine text-sm">
                      <AlertCircle size={16} />
                      {t('profile.error')}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('profile.firstName')}
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName || ''}
                      onChange={(e) => handleProfileChange('firstName', e.target.value)}
                      className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('profile.lastName')}
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName || ''}
                      onChange={(e) => handleProfileChange('lastName', e.target.value)}
                      className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('profile.email')}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('profile.phone')}
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone || ''}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="border-border bg-cream/50 font-body text-charcoal w-full rounded-xl border py-3 px-4 text-base focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={updateCustomer.isPending}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  {updateCustomer.isPending ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : null}
                  {t('profile.saveChanges')}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="shadow-luxury border-luxury animate-scale-in max-w-sm w-full rounded-2xl bg-white p-6">
            <div className="bg-wine/10 text-wine mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
              <AlertCircle size={32} />
            </div>
            <h2 className="font-display text-charcoal text-center mb-2 text-xl">
              {t('logout.title')}
            </h2>
            <p className="font-body text-muted-foreground text-center mb-6 text-base">
              {t('logout.confirm')}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="border-border font-body text-charcoal hover:bg-cream flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                disabled={logout.isPending}
              >
                {t('common.cancel', { ns: 'common' })}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-wine font-body text-cream hover:bg-wine/90 flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                disabled={logout.isPending}
              >
                {logout.isPending ? (
                  <Loader2 className="animate-spin mx-auto" size={20} />
                ) : (
                  t('logout.confirmButton')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddressForm
        isOpen={showAddressForm}
        address={editingAddress}
        onClose={() => setShowAddressForm(false)}
        onSuccess={() => {
          setShowAddressForm(false)
          setEditingAddress(null)
        }}
      />
    </div>
  )
}

interface OrderCardProps {
  order: Order
  index: number
  locale: string
  t: (key: string, options?: Record<string, unknown>) => string
  localizePath: (path: string) => string
  getStatusColor: (status: OrderFinancialStatus | OrderFulfillmentStatus) => string
}

function OrderCard({ order, index, locale, t, localizePath, getStatusColor }: OrderCardProps) {
  const items = order.lineItems.edges.map((edge) => edge.node)
  const encodedOrderId = encodeURIComponent(order.id)
  const orderDetailPath = localizePath(`/account/orders/${encodedOrderId}`)

  return (
    <div
      className={cn(
        'shadow-luxury border-luxury animate-fade-in-up overflow-hidden rounded-2xl bg-white',
        `stagger-${(index % 4) + 1}`,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream/50 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <p className="font-display text-charcoal text-lg font-semibold">
              {t('orders.orderNumber', { number: order.orderNumber })}
            </p>
            <p className="font-body text-muted-foreground text-sm">
              {t('orders.placedOn', { date: formatDate(new Date(order.processedAt), locale === 'zh' ? 'zh-CN' : 'en-US') })}
            </p>
          </div>
          <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
            getStatusColor(order.financialStatus),
          )}>
            {t(`orders.status.${order.financialStatus.toLowerCase()}`)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-display text-charcoal text-xl font-bold">
            {formatMoney(parseFloat(order.currentTotalPrice.amount), order.currentTotalPrice.currencyCode)}
          </p>
          <Link
            to={orderDetailPath}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            {t('orders.viewDetails')}
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="bg-cream aspect-square w-16 flex-shrink-0 overflow-hidden rounded-lg">
                {item.image?.url ? (
                  <img
                    src={item.image.url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="text-muted-foreground h-6 w-6" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-charcoal truncate font-semibold">
                  {item.title}
                </p>
                <p className="font-body text-muted-foreground text-sm">
                  {t('orders.quantity', { count: item.quantity })}
                </p>
              </div>
              <p className="font-body text-charcoal font-semibold">
                {formatMoney(parseFloat(item.discountedTotalPrice.amount), item.discountedTotalPrice.currencyCode)}
              </p>
            </div>
          ))}
          {items.length > 3 && (
            <p className="font-body text-muted-foreground text-center text-sm">
              {t('orders.moreItems', { count: items.length - 3 })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
