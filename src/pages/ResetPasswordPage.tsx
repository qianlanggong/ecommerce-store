import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import { useResetPassword } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const { t } = useTranslation('user')
  const { localizePath } = useLocale()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPassword = useResetPassword()

  const resetToken = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<{
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (resetPassword.isSuccess && !showSuccess) {
      setShowSuccess(true)
      setTimeout(() => {
        navigate(localizePath('/account/login'), { replace: true })
      }, 2000)
    }
  }, [resetPassword.isSuccess, navigate, localizePath, showSuccess])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!password) {
      newErrors.password = t('resetPassword.passwordRequired')
    } else if (password.length < 6) {
      newErrors.password = t('resetPassword.passwordTooShort')
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('resetPassword.confirmPasswordRequired')
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('resetPassword.passwordsDoNotMatch')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (!resetToken) {
      setErrors({
        general: t('resetPassword.invalidToken'),
      })
      return
    }

    try {
      const result = await resetPassword.mutateAsync({
        password,
        resetToken,
      })

      if (result.userErrors && result.userErrors.length > 0) {
        setErrors({
          general: result.userErrors[0].message || t('resetPassword.error'),
        })
      }
    } catch {
      setErrors({
        general: t('resetPassword.error'),
      })
    }
  }

  if (!resetToken) {
    return (
      <div className="bg-gradient-luxury relative min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-md">
            <div className="animate-fade-in-up shadow-luxury border-luxury overflow-hidden rounded-3xl bg-white p-8 lg:p-10">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-wine/10 text-wine mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <AlertCircle size={48} />
                </div>
                <h2 className="font-display text-charcoal mb-3 text-2xl">
                  {t('resetPassword.invalidLink')}
                </h2>
                <p className="font-body text-muted-foreground mb-8 text-base">
                  {t('resetPassword.invalidLinkDescription')}
                </p>
                <Link
                  to={localizePath('/account/forgot-password')}
                  className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t('resetPassword.tryAgain')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
                  {t('resetPassword.success')}
                </h2>
                <p className="font-body text-muted-foreground text-base">
                  {t('resetPassword.redirecting')}
                </p>
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
                {t('resetPassword.title')}
              </h1>
              <p className="font-body text-muted-foreground text-base">
                {t('resetPassword.description')}
              </p>
            </div>

            {errors.general && (
              <div className="bg-wine/10 border-wine/30 mb-6 flex items-start gap-3 rounded-xl border p-4">
                <AlertCircle className="text-wine mt-0.5 flex-shrink-0" size={20} />
                <p className="font-body text-wine text-sm">{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                  {t('resetPassword.password')}
                </label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('resetPassword.passwordPlaceholder')}
                    className={cn(
                      'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-12 text-base transition-all focus:ring-2 focus:outline-none',
                      errors.password && 'border-wine focus:border-wine focus:ring-wine/20',
                    )}
                    disabled={resetPassword.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                    disabled={resetPassword.isPending}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-wine mt-2 text-sm">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                  {t('resetPassword.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                    className={cn(
                      'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-12 text-base transition-all focus:ring-2 focus:outline-none',
                      errors.confirmPassword && 'border-wine focus:border-wine focus:ring-wine/20',
                    )}
                    disabled={resetPassword.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-muted-foreground hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                    disabled={resetPassword.isPending}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-wine mt-2 text-sm">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={resetPassword.isPending}
                className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {resetPassword.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {t('resetPassword.submit')}
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
                {t('resetPassword.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
