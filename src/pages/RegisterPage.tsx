import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle, User } from 'lucide-react'
import { useRegister, useLogin } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const { t } = useTranslation('user')
  const { localizePath } = useLocale()
  const navigate = useNavigate()
  const register = useRegister()
  const login = useLogin()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [errors, setErrors] = useState<{
    firstName?: string
    lastName?: string
    email?: string
    password?: string
    confirmPassword?: string
    agreeTerms?: string
    general?: string
  }>({})
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (login.isSuccess && !showSuccess) {
      setShowSuccess(true)
      setTimeout(() => {
        navigate(localizePath('/account'), { replace: true })
      }, 1500)
    }
  }, [login.isSuccess, navigate, localizePath, showSuccess])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!firstName.trim()) {
      newErrors.firstName = t('register.firstNameRequired')
    }

    if (!lastName.trim()) {
      newErrors.lastName = t('register.lastNameRequired')
    }

    if (!email) {
      newErrors.email = t('register.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('register.emailInvalid')
    }

    if (!password) {
      newErrors.password = t('register.passwordRequired')
    } else if (password.length < 6) {
      newErrors.password = t('register.passwordTooShort')
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t('register.confirmPasswordRequired')
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t('register.passwordsDoNotMatch')
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = t('register.agreeTermsRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const result = await register.mutateAsync({
        email,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      })

      if (result.userErrors && result.userErrors.length > 0) {
        const fieldErrors: typeof errors = {}
        result.userErrors.forEach((err) => {
          if (err.field?.includes('email')) {
            fieldErrors.email = err.message
          } else if (err.field?.includes('password')) {
            fieldErrors.password = err.message
          } else {
            fieldErrors.general = err.message
          }
        })
        if (Object.keys(fieldErrors).length === 0) {
          fieldErrors.general = result.userErrors[0].message || t('register.error')
        }
        setErrors(fieldErrors)
        return
      }

      if (result.customer) {
        await login.mutateAsync({ email, password })
      }
    } catch {
      setErrors({
        general: t('register.error'),
      })
    }
  }

  return (
    <div className="bg-gradient-luxury relative min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          <div className="animate-fade-in-up shadow-luxury border-luxury overflow-hidden rounded-3xl bg-white p-8 lg:p-10">
            {showSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="bg-green-100 text-green-600 mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <CheckCircle size={48} />
                </div>
                <h2 className="font-display text-charcoal mb-3 text-2xl">{t('register.success')}</h2>
                <p className="font-body text-muted-foreground text-base">
                  {t('register.redirecting')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="bg-gradient-gold shadow-luxury mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white">
                    ✦
                  </div>
                  <h1 className="font-display text-charcoal mb-2 text-3xl">{t('register.title')}</h1>
                  <p className="font-body text-muted-foreground text-base">
                    {t('register.description')}
                  </p>
                </div>

                {errors.general && (
                  <div className="bg-wine/10 border-wine/30 mb-6 flex items-start gap-3 rounded-xl border p-4">
                    <AlertCircle className="text-wine mt-0.5 flex-shrink-0" size={20} />
                    <p className="font-body text-wine text-sm">{errors.general}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                        {t('register.firstName')}
                      </label>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={18} />
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className={cn(
                            'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-10 pr-4 text-base transition-all focus:ring-2 focus:outline-none',
                            errors.firstName && 'border-wine focus:border-wine focus:ring-wine/20',
                          )}
                          disabled={register.isPending || login.isPending}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="text-wine mt-2 text-sm">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                        {t('register.lastName')}
                      </label>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={18} />
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className={cn(
                            'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-10 pr-4 text-base transition-all focus:ring-2 focus:outline-none',
                            errors.lastName && 'border-wine focus:border-wine focus:ring-wine/20',
                          )}
                          disabled={register.isPending || login.isPending}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="text-wine mt-2 text-sm">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('register.email')}
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('register.emailPlaceholder')}
                        className={cn(
                          'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-4 text-base transition-all focus:ring-2 focus:outline-none',
                          errors.email && 'border-wine focus:border-wine focus:ring-wine/20',
                        )}
                        disabled={register.isPending || login.isPending}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-wine mt-2 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('register.password')}
                    </label>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('register.passwordPlaceholder')}
                        className={cn(
                          'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-12 text-base transition-all focus:ring-2 focus:outline-none',
                          errors.password && 'border-wine focus:border-wine focus:ring-wine/20',
                        )}
                        disabled={register.isPending || login.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                        disabled={register.isPending || login.isPending}
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
                      {t('register.confirmPassword')}
                    </label>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t('register.confirmPasswordPlaceholder')}
                        className={cn(
                          'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-12 text-base transition-all focus:ring-2 focus:outline-none',
                          errors.confirmPassword && 'border-wine focus:border-wine focus:ring-wine/20',
                        )}
                        disabled={register.isPending || login.isPending}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-muted-foreground hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                        disabled={register.isPending || login.isPending}
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-wine mt-2 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="agreeTerms" className="flex items-start gap-3">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="text-primary focus:ring-primary mt-1 h-5 w-5 rounded border-border"
                        disabled={register.isPending || login.isPending}
                      />
                      <span className="font-body text-charcoal text-sm">
                        {t('register.agreeTerms', {
                          terms: t('register.terms'),
                          privacy: t('register.privacy'),
                        })}
                      </span>
                    </label>
                    {errors.agreeTerms && (
                      <p className="text-wine mt-2 text-sm">{errors.agreeTerms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={register.isPending || login.isPending}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {register.isPending || login.isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {t('register.submit')}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="font-body text-muted-foreground text-base">
                    {t('register.haveAccount')}{' '}
                    <Link
                      to={localizePath('/account/login')}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      {t('register.login')}
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
