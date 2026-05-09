import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { deleteCategory, getCategories } from '~/lib/api/categories'
import type { CategoryApi } from '~/lib/api/types'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminCategoriesPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getCategories()
        if (!cancelled) {
          setCategories(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Không tải được danh sách danh mục.'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDeleteCategory(category: CategoryApi) {
    setDeletingCategoryId(category.id)
    try {
      await deleteCategory(category.id)
      setCategories((prev) => prev.filter((item) => item.id !== category.id))
    } catch (err) {
      setError(getErrorMessage(err, 'Xóa danh mục thất bại.'))
    } finally {
      setDeletingCategoryId(null)
    }
  }

  return (
    <AdminLayout
      title='Quản lý danh mục'
      description='Theo dõi danh sách danh mục sản phẩm hiện có từ backend.'
      actions={
        <>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            Quay lại
          </button>
          <Link
            to='/admin/categories/new'
            className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-5 text-sm font-bold text-white shadow-md transition hover:brightness-95'
          >
            Thêm danh mục
          </Link>
        </>
      }
    >
      {error && (
        <p className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
          {error}
        </p>
      )}

      {isLoading ? (
        <div className='rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Đang tải danh sách danh mục...
        </div>
      ) : categories.length === 0 ? (
        <div className='rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Chưa có danh mục nào.
        </div>
      ) : (
        <div className='overflow-hidden rounded-[1.75rem] border border-shop-ink/10 bg-white shadow-shop-soft'>
          <div className='grid grid-cols-[minmax(0,1fr)_180px_110px_180px] gap-4 bg-shop-blue/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-shop-ink/60'>
            <span>Danh mục</span>
            <span>Slug</span>
            <span>Trạng thái</span>
            <span>Thao tác</span>
          </div>
          <div className='divide-y divide-shop-ink/8'>
            {categories.map((category) => (
              <div key={category.id} className='grid grid-cols-[minmax(0,1fr)_180px_110px_180px] gap-4 px-4 py-4 text-sm'>
                <div className='min-w-0'>
                  <p className='truncate font-bold text-shop-ink'>{category.name}</p>
                  {category.description && (
                    <p className='mt-1 line-clamp-2 text-xs text-shop-ink/60'>{category.description}</p>
                  )}
                </div>
                <div className='truncate text-shop-ink/70'>{category.slug}</div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      category.isActive === false ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {category.isActive === false ? 'Ẩn' : 'Hiện'}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className='inline-flex min-h-9 items-center justify-center rounded-xl border border-shop-ink/10 bg-white px-3 text-xs font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
                  >
                    Sửa
                  </Link>
                  <button
                    type='button'
                    disabled={deletingCategoryId === category.id}
                    onClick={() => {
                      void handleDeleteCategory(category)
                    }}
                    className='inline-flex min-h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {deletingCategoryId === category.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
