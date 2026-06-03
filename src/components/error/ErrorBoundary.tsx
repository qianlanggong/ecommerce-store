import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useLocale } from '@/hooks/useLocale'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          onReload={this.handleReload}
          onReset={this.handleReset}
        />
      )
    }

    return this.props.children
  }
}

function ErrorFallback({
  error,
  onReload,
  onReset,
}: {
  error: Error | null
  onReload: () => void
  onReset: () => void
}) {
  const { t } = useTranslation('common')
  const { localizePath } = useLocale()

  return (
    <div className="bg-gradient-luxury flex min-h-screen items-center justify-center p-4">
      <div className="shadow-luxury border-luxury max-w-md w-full overflow-hidden rounded-3xl bg-white p-8 text-center">
        <div className="bg-wine/10 text-wine mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
          <AlertTriangle size={48} />
        </div>

        <h1 className="font-display text-charcoal mb-3 text-2xl">{t('error.title')}</h1>
        <p className="font-body text-muted-foreground mb-6 text-base">
          {t('error.description')}
        </p>

        {error && (
          <div className="bg-wine/5 border-wine/20 mb-6 rounded-xl border p-4 text-left">
            <p className="font-body text-wine text-sm font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onReload}
            className="bg-gradient-gold font-body text-cream shadow-luxury hover:shadow-luxury-hover flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <RefreshCw size={18} />
            {t('error.reload')}
          </button>

          <button
            onClick={onReset}
            className="border-primary bg-cream font-body text-primary hover:bg-primary/5 flex flex-1 items-center justify-center gap-2 rounded-xl border py-3 text-base font-semibold transition-colors"
          >
            {t('error.tryAgain')}
          </button>
        </div>

        <Link
          to={localizePath('/')}
          className="font-body text-primary hover:text-primary/80 mt-6 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <Home size={16} />
          {t('error.backHome')}
        </Link>
      </div>
    </div>
  )
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary
