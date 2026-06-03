import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Loader2, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRecoverPassword } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

export default function ForgotPasswordPage() {
  const { t } = useTranslation('user')
  const { localizePath } = useLocale()
  const recoverPassword = useRecoverPassword()

  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (recoverPassword.isSuccess && !showSuccess) {
      setShowSuccess(true)
    }
  }, [recoverPassword.isSuccess, showSuccess])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = t('forgotPassword.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('forgotPassword.emailInvalid')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const result = await recoverPassword.mutateAsync(email)

      if (result.userErrors && result.userErrors.length > 0) {
        setErrors({
          general: result.userErrors[0].message || t('forgotPassword.error'),
        })
      }
    } catch {
      setErrors({
        general: t('forgotPassword.error'),
      })
    }
  }

  if (showSuccess) {
    return (
      <div className="bg-gradient-luxury relative min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md">
            <div className="animate-fade-in-up shadow-luxury border-luxury overflow-hidden rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-green-100 text-green-600 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <CheckCircle size={48} />
                </div>
                <h2 className="font-display text-charcoal mb-3 text-2xl">
                  {t('forgotPassword.success')}
                </h2>
                <p className="font-body text-muted-foreground mb-8 text-base">
                  {t('forgotPassword.successDescription')}
                </p>
                <Link
                  to={localizePath('/account/login')}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  <ArrowLeft size={20} />
                  {t('forgotPassword.backToLogin')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-luxury relative min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          <div className="animate-fade-in-up shadow-luxury border-luxury overflow-hidden rounded-3xl bg-white p-8 lg:p-10">
            <div className="mb-8 text-center">
              <div className="bg-gradient-gold shadow-luxury mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white">
                ✦
              </div>
              <h1 className="font-display text-charcoal mb-2 text-3xl">
                {t('forgotPassword.title')}
              </h1>
              <p className="font-body text-muted-foreground text-base">
                {t('forgotPassword.description')}
              </p>
            </div>

            {errors.general && (
              <div className="bg-wine/10 border-wine/30 mb-6 flex items-start gap-3 rounded-xl border p-4">
                <p className="font-body text-wine text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                  {t('forgotPassword.email')}
                </label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    className={cn(
                      'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-4 text-base transition-all focus:ring-2 focus:outline-none',
                      errors.email && 'border-wine focus:border-wine focus:ring-wine/20',
                    )}
                    disabled={recoverPassword.isPending}
                  />
                </div>
                {errors.email && (
                  <p className="text-wine mt-2 text-sm">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={recoverPassword.isPending}
                className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {recoverPassword.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {t('forgotPassword.submit')}
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link
                to={localizePath('/account/login')}
                className="font-body text-primary hover:text-primary/80 inline-flex items-center gap-2 text-base font-medium transition-colors"
              >
                <ArrowLeft size={18} />
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
