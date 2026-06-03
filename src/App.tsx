import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { LocaleRouter } from '@/components/locale/LocaleRouter'
import { MainLayout } from '@/components/layout/MainLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
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

function AppRoutes() {
  return (
    <MainLayout>
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
        <Route
          path="/:locale/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route path="/:locale/favorites" element={<FavoritesPage />} />
        <Route path="/:locale/account/favorites" element={<FavoritesPage />} />
      </Routes>
    </MainLayout>
  )
}

export default function App() {
  return (
    <QueryProvider>
      <Router>
        <LocaleRouter>
          <AppRoutes />
        </LocaleRouter>
      </Router>
    </QueryProvider>
  )
}
