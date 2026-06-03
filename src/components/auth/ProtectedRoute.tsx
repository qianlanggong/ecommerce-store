import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useAuthState } from '@/services/userService'
import { useLocale } from '@/hooks/useLocale'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { t } = useTranslation('user')
  const { localizePath } = useLocale()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuthState()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="font-body text-muted-foreground text-base">{t('login.loading')}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={localizePath('/account/login')} state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
