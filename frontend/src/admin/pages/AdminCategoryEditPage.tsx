import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AdminCategoryForm } from '~/admin/components/AdminCategoryForm'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategoryById, updateCategory } from '~/lib/api/categories'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminCategoryEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadCategory() {
      setIsLoading(true)
      setError(null)
      try {
        const category = await getCategoryById(id)
        if (cancelled) return
        setInitialValues({
          name: category.name,
          description: category.description ?? ''
        })
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Không tải được thông tin danh mục.'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    if (id) {
      void loadCategory()
    } else {
      setError('Thiếu ID danh mục.')
      setIsLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) {
    return (
      <AdminLayout title='Sửa danh mục' maxWidthClassName='max-w-3xl'>
        <div className='rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Đang tải dữ liệu danh mục...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout
      title='Sửa danh mục'
      maxWidthClassName='max-w-3xl'
      actions={
        <>
          <Link
            to='/admin/categories'
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            DS danh mục
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
      {error && (
        <p className='mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800' role='alert'>
          {error}
        </p>
      )}
      <AdminCategoryForm
        initialValues={initialValues}
        submitLabel='Lưu thay đổi'
        submittingLabel='Đang lưu...'
        onSubmit={async (payload) => {
          const updatedCategory = await updateCategory(id, payload)
          return `Đã cập nhật danh mục "${updatedCategory.name}".`
        }}
      />
    </AdminLayout>
  )
}
