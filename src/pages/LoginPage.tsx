import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useLogin } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'
import { cn } from '@/lib/utils'

interface LocationState {
  from?: { pathname: string }
}

export default function LoginPage() {
  const { t } = useTranslation('user')
  const { localizePath } = useLocale()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const from = (location.state as LocationState)?.from?.pathname || localizePath('/account')

  useEffect(() => {
    const hasToken = !!localStorage.getItem('customer_access_token')
    if (login.isSuccess && hasToken && !showSuccess) {
      setShowSuccess(true)
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 1000)
    }
  }, [login.isSuccess, navigate, from, showSuccess])

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!email) {
      newErrors.email = t('login.emailRequired')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('login.emailInvalid')
    }

    if (!password) {
      newErrors.password = t('login.passwordRequired')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setErrors({})

    try {
      await login.mutateAsync({ email, password })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('login.error')
      setErrors({
        general: errorMessage,
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
                <h2 className="font-display text-charcoal mb-3 text-2xl">{t('login.success')}</h2>
                <p className="font-body text-muted-foreground text-base">
                  {t('login.redirecting')}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="bg-gradient-gold shadow-luxury mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl text-white">
                    ✦
                  </div>
                  <h1 className="font-display text-charcoal mb-2 text-3xl">{t('login.title')}</h1>
                  <p className="font-body text-muted-foreground text-base">
                    {t('login.description')}
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
                      {t('login.email')}
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('login.emailPlaceholder')}
                        className={cn(
                          'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-4 text-base transition-all focus:ring-2 focus:outline-none',
                          errors.email && 'border-wine focus:border-wine focus:ring-wine/20',
                        )}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-wine mt-2 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="font-body text-charcoal mb-2 block text-sm font-medium">
                      {t('login.password')}
                    </label>
                    <div className="relative">
                      <Lock className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2" size={20} />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('login.passwordPlaceholder')}
                        className={cn(
                          'border-border bg-cream/50 font-body text-charcoal placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-xl border py-3.5 pl-12 pr-12 text-base transition-all focus:ring-2 focus:outline-none',
                          errors.password && 'border-wine focus:border-wine focus:ring-wine/20',
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-muted-foreground hover:text-charcoal absolute top-1/2 right-4 -translate-y-1/2 transition-colors"
                        disabled={login.isPending}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-wine mt-2 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="rememberMe" className="flex items-center gap-2">
                      <input
                        id="rememberMe"
                        name="rememberMe"
                        type="checkbox"
                        className="text-primary focus:ring-primary h-4 w-4 rounded border-border"
                      />
                      <span className="font-body text-charcoal text-sm">{t('login.rememberMe')}</span>
                    </label>
                    <Link
                      to={localizePath('/account/forgot-password')}
                      className="font-body text-primary hover:text-primary/80 text-sm transition-colors"
                    >
                      {t('login.forgotPassword')}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={login.isPending}
                    className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {login.isPending ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        {t('login.submit')}
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="font-body text-muted-foreground text-base">
                    {t('login.noAccount')}{' '}
                    <Link
                      to={localizePath('/account/register')}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      {t('login.register')}
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
