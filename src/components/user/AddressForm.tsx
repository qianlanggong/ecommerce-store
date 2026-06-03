import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Loader2, Save, MapPin } from 'lucide-react'
import { useCreateAddress, useUpdateAddress } from '@/services/userService'
import { cn } from '@/lib/utils'
import type { MailingAddress, MailingAddressInput } from '@/types'

interface AddressFormProps {
  isOpen: boolean
  onClose: () => void
  address?: MailingAddress | null
  onSuccess?: () => void
}

export default function AddressForm({ isOpen, onClose, address, onSuccess }: AddressFormProps) {
  const { t } = useTranslation('user')
  const createAddress = useCreateAddress()
  const updateAddress = useUpdateAddress()

  const [formData, setFormData] = useState<MailingAddressInput>({
    firstName: '',
    lastName: '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    zip: '',
    country: 'US',
    phone: '',
  })
  const [isDefault, setIsDefault] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEditing = !!address

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName || '',
        lastName: address.lastName || '',
        company: address.company || '',
        address1: address.address1 || '',
        address2: address.address2 || '',
        city: address.city || '',
        province: address.province || '',
        zip: address.zip || '',
        country: address.countryCode || address.country || 'US',
        phone: address.phone || '',
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        zip: '',
        country: 'US',
        phone: '',
      })
    }
    setIsDefault(false)
    setErrors({})
  }, [address, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName?.trim()) {
      newErrors.firstName = t('addresses.form.firstName') + ' ' + t('login.emailRequired').replace('email', '')
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = t('addresses.form.lastName') + ' ' + t('login.emailRequired').replace('email', '')
    }
    if (!formData.address1?.trim()) {
      newErrors.address1 = t('addresses.form.address1') + ' ' + t('login.emailRequired').replace('email', '')
    }
    if (!formData.city?.trim()) {
      newErrors.city = t('addresses.form.city') + ' ' + t('login.emailRequired').replace('email', '')
    }
    if (!formData.zip?.trim()) {
      newErrors.zip = t('addresses.form.zip') + ' ' + t('login.emailRequired').replace('email', '')
    }
    if (!formData.country?.trim()) {
      newErrors.country = t('addresses.form.country') + ' ' + t('login.emailRequired').replace('email', '')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const addressData: MailingAddressInput = {
        ...formData,
        firstName: formData.firstName?.trim(),
        lastName: formData.lastName?.trim(),
        address1: formData.address1?.trim(),
        address2: formData.address2?.trim() || undefined,
        city: formData.city?.trim(),
        province: formData.province?.trim() || undefined,
        zip: formData.zip?.trim(),
        country: formData.country?.trim(),
        company: formData.company?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
      }

      if (isEditing && address) {
        await updateAddress.mutateAsync({
          addressId: address.id,
          address: addressData,
        })
      } else {
        await createAddress.mutateAsync(addressData)
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('addresses.form.error')
      setErrors({ general: errorMessage })
    }
  }

  const handleChange = (field: keyof MailingAddressInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  if (!isOpen) return null

  const isPending = createAddress.isPending || updateAddress.isPending

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="shadow-luxury border-luxury animate-scale-in max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white">
        <div className="flex items-center justify-between border-b border-cream/50 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-gold shadow-luxury flex h-12 w-12 items-center justify-center rounded-xl text-white">
              <MapPin size={24} />
            </div>
            <h2 className="font-display text-charcoal text-xl font-semibold">
              {isEditing ? t('addresses.edit') : t('addresses.addNew')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-charcoal rounded-full p-2 transition-colors"
            disabled={isPending}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errors.general && (
            <div className="bg-wine/10 border-wine/30 flex items-start gap-3 rounded-xl border p-4">
              <p className="font-body text-wine text-sm">{errors.general}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.firstName')} *
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleChange('firstName', e.target.value)}
                className={cn(
                  'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                  errors.firstName && 'border-wine focus:border-wine focus:ring-wine/20',
                )}
                disabled={isPending}
              />
              {errors.firstName && <p className="text-wine mt-1 text-xs">{errors.firstName}</p>}
            </div>

            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.lastName')} *
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleChange('lastName', e.target.value)}
                className={cn(
                  'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                  errors.lastName && 'border-wine focus:border-wine focus:ring-wine/20',
                )}
                disabled={isPending}
              />
              {errors.lastName && <p className="text-wine mt-1 text-xs">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="font-body text-charcoal mb-2 block text-sm font-medium">
              {t('addresses.form.company')}
            </label>
            <input
              type="text"
              value={formData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder={t('addresses.form.company')}
              className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none"
              disabled={isPending}
            />
          </div>

          <div>
            <label className="font-body text-charcoal mb-2 block text-sm font-medium">
              {t('addresses.form.address1')} *
            </label>
            <input
              type="text"
              value={formData.address1 || ''}
              onChange={(e) => handleChange('address1', e.target.value)}
              placeholder={t('addresses.form.address1')}
              className={cn(
                'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                errors.address1 && 'border-wine focus:border-wine focus:ring-wine/20',
              )}
              disabled={isPending}
            />
            {errors.address1 && <p className="text-wine mt-1 text-xs">{errors.address1}</p>}
          </div>

          <div>
            <label className="font-body text-charcoal mb-2 block text-sm font-medium">
              {t('addresses.form.address2')}
            </label>
            <input
              type="text"
              value={formData.address2 || ''}
              onChange={(e) => handleChange('address2', e.target.value)}
              placeholder={t('addresses.form.address2')}
              className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none"
              disabled={isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.city')} *
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder={t('addresses.form.city')}
                className={cn(
                  'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                  errors.city && 'border-wine focus:border-wine focus:ring-wine/20',
                )}
                disabled={isPending}
              />
              {errors.city && <p className="text-wine mt-1 text-xs">{errors.city}</p>}
            </div>

            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.state')}
              </label>
              <input
                type="text"
                value={formData.province || ''}
                onChange={(e) => handleChange('province', e.target.value)}
                placeholder={t('addresses.form.state')}
                className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none"
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.zip')} *
              </label>
              <input
                type="text"
                value={formData.zip || ''}
                onChange={(e) => handleChange('zip', e.target.value)}
                placeholder={t('addresses.form.zip')}
                className={cn(
                  'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                  errors.zip && 'border-wine focus:border-wine focus:ring-wine/20',
                )}
                disabled={isPending}
              />
              {errors.zip && <p className="text-wine mt-1 text-xs">{errors.zip}</p>}
            </div>

            <div>
              <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                {t('addresses.form.country')} *
              </label>
              <select
                value={formData.country || 'US'}
                onChange={(e) => handleChange('country', e.target.value)}
                className={cn(
                  'border-border bg-cream/50 font-body text-charcoal focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none',
                  errors.country && 'border-wine focus:border-wine focus:ring-wine/20',
                )}
                disabled={isPending}
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
              {errors.country && <p className="text-wine mt-1 text-xs">{errors.country}</p>}
            </div>
          </div>

          <div>
            <label className="font-body text-charcoal mb-2 block text-sm font-medium">
              {t('addresses.form.phone')}
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('addresses.form.phone')}
              className="border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3 px-4 text-base transition-all focus:ring-2 focus:outline-none"
              disabled={isPending}
            />
          </div>

          {!isEditing && (
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="text-primary focus:ring-primary mt-1 h-5 w-5 rounded border-border"
                  disabled={isPending}
                />
                <span className="font-body text-charcoal text-sm">
                  {t('addresses.form.isDefault')}
                </span>
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border-border font-body text-charcoal hover:bg-cream flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
              disabled={isPending}
            >
              {t('common.cancel', { ns: 'common' })}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Save size={20} />
                  {t('profile.saveChanges')}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
