import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminProductForm } from '~/admin/components/AdminProductForm'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategories } from '~/lib/api/categories'
import { getProductById, updateProduct } from '~/lib/api/products'
import type { CategoryApi } from '~/lib/api/types'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminProductEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    categoryId: '',
    imageUrl: ''
  })
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadInitialData() {
      setIsLoading(true)
      setError(null)
      try {
        const [categoryData, product] = await Promise.all([getCategories(), getProductById(id)])
        if (cancelled) return
        setCategories(categoryData.filter((category) => category.isActive !== false))
        setInitialValues({
          name: product.name,
          description: product.description ?? '',
          price: String(product.price),
          stock: String(product.stock),
          categoryId: product.categoryId,
          imageUrl: product.imageUrl ?? ''
        })
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Không tải được thông tin sản phẩm để chỉnh sửa.'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      void loadInitialData()
    } else {
      setError('Thiếu ID sản phẩm.')
      setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) {
    return (
      <AdminLayout title='Sửa sản phẩm'>
        <div className='rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Đang tải dữ liệu sản phẩm...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title='Sửa sản phẩm'
      maxWidthClassName='max-w-3xl'
      actions={
        <>
          <Link
            to='/admin/products'
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            DS sản phẩm
          </Link>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl bg-kid-green px-5 text-sm font-bold text-white shadow-md transition hover:brightness-95'
          >
            Quay lại
          </button>
        </>
      }
    >
      {error && (
        <p className='mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800' role='alert'>
          {error}
        </p>
      )}
      <AdminProductForm
        categories={categories}
        initialValues={initialValues}
        submitLabel='Lưu thay đổi'
        submittingLabel='Đang lưu...'
        onSubmit={async (payload) => {
          const updatedProduct = await updateProduct(id, payload)
          return `Đã cập nhật sản phẩm "${updatedProduct.name}".`
        }}
      />
    </AdminLayout>
  )
}
