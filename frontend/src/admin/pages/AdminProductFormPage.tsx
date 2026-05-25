import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminProductForm } from '~/admin/components/AdminProductForm'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategories } from '~/lib/api/categories'
import { createProduct } from '~/lib/api/products'
import type { CategoryApi } from '~/lib/api/types'

export function AdminProductFormPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      setIsLoadingCategories(true)
      try {
        const data = await getCategories()
        if (!cancelled) {
          setCategories(data.filter((category) => category.isActive !== false))
        }
      } catch (err) {
        if (!cancelled) return
      } finally {
        if (!cancelled) {
          setIsLoadingCategories(false)
        }
      }
    }

    void loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminLayout
      title='Thêm sản phẩm'
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
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            Quay lại
          </button>
        </>
      }
    >
      <AdminProductForm
        categories={categories}
        isLoadingCategories={isLoadingCategories}
        submitLabel='Tạo sản phẩm'
        submittingLabel='Đang tạo...'
        resetOnSuccess
        onSubmit={async (payload) => {
          const createdProduct = await createProduct(payload)
          return `Đã tạo sản phẩm "${createdProduct.name}" với slug "${createdProduct.slug}".`
        }}
      />
    </AdminLayout>
  )
}
