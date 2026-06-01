import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryProvider } from '@/providers/QueryProvider'
import { LocaleRouter } from '@/components/locale/LocaleRouter'
import { MainLayout } from '@/components/layout/MainLayout'
import Home from '@/pages/Home'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import FavoritesPage from '@/pages/FavoritesPage'

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
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
        <Route
          path="/:locale/cart"
          element={<div className="p-8 text-center text-xl">Cart Page - Coming Soon</div>}
        />
        <Route
          path="/:locale/account"
          element={<div className="p-8 text-center text-xl">Account Page - Coming Soon</div>}
        />
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
