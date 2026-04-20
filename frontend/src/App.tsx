import { Navigate, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '~/app/hooks'
import { AdminProductFormPage } from '~/pages/AdminProductFormPage'
import { HomePage } from '~/pages/HomePage'
import { LoginPage } from '~/pages/LoginPage'
import { ProductDetailPage } from '~/pages/ProductDetailPage'
import { ProductsPage } from '~/pages/ProductsPage'
import { RegisterPage } from '~/pages/RegisterPage'
import { CartPage } from './pages/CartPage'

function AppRoutes() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='/products/:slug' element={<ProductDetailPage />} />
      <Route path='/admin/products/new' element={<AdminProductFormPage />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />} />
      <Route path='/register' element={isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
