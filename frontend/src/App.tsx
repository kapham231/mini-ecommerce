import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminCategoryEditPage } from '~/admin/pages/AdminCategoryEditPage'
import { AdminCategoryFormPage } from '~/admin/pages/AdminCategoryFormPage'
import { AdminCategoriesPage } from '~/admin/pages/AdminCategoriesPage'
import { AdminDashboardPage } from '~/admin/pages/AdminDashboardPage'
import { AdminProductEditPage } from '~/admin/pages/AdminProductEditPage'
import { AdminProductFormPage } from '~/admin/pages/AdminProductFormPage'
import { AdminProductsPage } from '~/admin/pages/AdminProductsPage'
import { useAppSelector } from '~/app/hooks'
import { BlogArticlesPage } from '~/pages/BlogArticlesPage'
import { CategoriesPage } from '~/pages/CategoriesPage'
import { ContactPage } from '~/pages/ContactPage'
import { HomePage } from '~/pages/HomePage'
import { LoginPage } from '~/pages/LoginPage'
import { NewsPage } from '~/pages/NewsPage'
import { ProfilePage } from '~/pages/ProfilePage'
import { ProductDetailPage } from '~/pages/ProductDetailPage'
import { ProductsPage } from '~/pages/ProductsPage'
import { RegisterPage } from '~/pages/RegisterPage'
import { CartPage } from './pages/CartPage'

function AppRoutes() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/categories' element={<CategoriesPage />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='/products/:slug' element={<ProductDetailPage />} />
      <Route path='/admin' element={<AdminDashboardPage />} />
      <Route path='/admin/products' element={<AdminProductsPage />} />
      <Route path='/admin/categories' element={<AdminCategoriesPage />} />
      <Route path='/admin/products/new' element={<AdminProductFormPage />} />
      <Route path='/admin/categories/new' element={<AdminCategoryFormPage />} />
      <Route path='/admin/categories/:id/edit' element={<AdminCategoryEditPage />} />
      <Route path='/admin/products/:id/edit' element={<AdminProductEditPage />} />
      <Route path='/news' element={<NewsPage />} />
      <Route path='/blog/articles' element={<BlogArticlesPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />} />
      <Route path='/register' element={isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />} />
      <Route path='/profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to='/login' replace />} />
      <Route path='/cart' element={<CartPage />} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
