import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { QueryProvider } from '@/providers/QueryProvider'
import { LocaleRouter } from '@/components/locale/LocaleRouter'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ToastContainer } from '@/components/ui/ToastContainer'
import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import Home from '@/pages/Home'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'
import CartPage from '@/pages/CartPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import AccountPage from '@/pages/AccountPage'
import OrdersPage from '@/pages/OrdersPage'
import OrderDetailPage from '@/pages/OrderDetailPage'
import CheckoutPage from '@/pages/CheckoutPage'
import OrderConfirmationPage from '@/pages/OrderConfirmationPage'
import PaymentFailedPage from '@/pages/PaymentFailedPage'
import NotFoundPage from '@/pages/NotFoundPage'
import { useUserStore } from '@/stores/userStore'
import { useToastStore } from '@/stores/toastStore'

function TokenExpiryListener() {
  const { t } = useTranslation('common')
  const location = useLocation()
  const addToast = useToastStore.getState().addToast
  const getValidAccessToken = useUserStore.getState().getValidAccessToken
  const accessToken = useUserStore.getState().accessToken

  useEffect(() => {
    const checkToken = () => {
      if (accessToken && !getValidAccessToken()) {
        addToast(t('errors.unauthorized'), 'error')
      }
    }

    checkToken()

    const interval = setInterval(checkToken, 60000)

    return () => clearInterval(interval)
  }, [location.pathname, accessToken, getValidAccessToken, addToast, t])

  return null
}

function AppRoutes() {
  return (
    <MainLayout>
      <TokenExpiryListener />
      <Routes>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:locale" element={<Home />} />
        <Route path="/:locale/products" element={<ProductsPage />} />
        <Route path="/:locale/products/:handle" element={<ProductDetailPage />} />
        <Route
          path="/:locale/collections"
          element={<div className="p-8 text-center text-xl">Collections Page - Coming Soon</div>}
        />
        <Route
          path="/:locale/collections/:handle"
          element={
            <div className="p-8 text-center text-xl">Collection Detail Page - Coming Soon</div>
          }
        />
        <Route path="/:locale/cart" element={<CartPage />} />
        <Route path="/:locale/account/login" element={<LoginPage />} />
        <Route path="/:locale/account/register" element={<RegisterPage />} />
        <Route path="/:locale/account/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/:locale/account/reset-password" element={<ResetPasswordPage />} />
        <Route path="/:locale/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
        <Route path="/:locale/account/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
        <Route path="/:locale/account/orders/:orderId" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
        <Route path="/:locale/checkout" element={<CheckoutPage />} />
        <Route path="/:locale/checkout/success" element={<OrderConfirmationPage />} />
        <Route path="/:locale/checkout/failure" element={<PaymentFailedPage />} />
        <Route path="/:locale/favorites" element={<FavoritesPage />} />
        <Route path="/:locale/account/favorites" element={<FavoritesPage />} />
        <Route path="/:locale/*" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MainLayout>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <Router>
        <ErrorBoundary>
          <LocaleRouter>
            <ToastContainer />
            <AppRoutes />
          </LocaleRouter>
        </ErrorBoundary>
      </Router>
    </QueryProvider>
  )
}
