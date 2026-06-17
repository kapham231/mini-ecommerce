import { Navigate, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from '~/components/layout/ScrollToTop'
import { AdminRoute } from '~/features/auth/AdminRoute'
import { AuthBootstrap } from '~/features/auth/AuthBootstrap'
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
import { ProfilePage } from '~/pages/ProfilePage'
import { ProductDetailPage } from '~/pages/ProductDetailPage'
import { ProductsPage } from '~/pages/ProductsPage'
import { RegisterPage } from '~/pages/RegisterPage'
import { CartPage } from './pages/CartPage'
import { WishlistPage } from './pages/WishlistPage'
import { ErrorPage } from './pages/ErrorPage'
import { AboutUsPage } from './pages/AboutUsPage'

function AppRoutes() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/categories' element={<CategoriesPage />} />
      <Route path='/products' element={<ProductsPage />} />
      <Route path='/products/:slug' element={<ProductDetailPage />} />
      <Route path='/admin' element={<AdminRoute />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path='products' element={<AdminProductsPage />} />
        <Route path='categories' element={<AdminCategoriesPage />} />
        <Route path='products/new' element={<AdminProductFormPage />} />
        <Route path='categories/new' element={<AdminCategoryFormPage />} />
        <Route path='categories/:id/edit' element={<AdminCategoryEditPage />} />
        <Route path='products/:id/edit' element={<AdminProductEditPage />} />
      </Route>
      <Route path='/blog/articles' element={<BlogArticlesPage />} />
      <Route path='/contact' element={<ContactPage />} />
      <Route path='/login' element={isAuthenticated ? <Navigate to='/' replace /> : <LoginPage />} />
      <Route path='/register' element={isAuthenticated ? <Navigate to='/' replace /> : <RegisterPage />} />
      <Route path='/profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to='/login' replace />} />
      <Route path='/cart' element={<CartPage />} />
      <Route
        path='/wishlist'
        element={isAuthenticated ? <WishlistPage /> : <Navigate to='/login' replace />}
      />
      <Route path='/error' element={<ErrorPage />} />
      <Route path='*' element={<ErrorPage defaultStatusCode={404} />} />
      <Route path='/about-us' element={<AboutUsPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <>
      <AuthBootstrap>
        <ScrollToTop />
        <AppRoutes />
      </AuthBootstrap>
    </>
  )
}
