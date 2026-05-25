import { Link, useNavigate } from 'react-router-dom'
import { AdminCategoryForm } from '~/admin/components/AdminCategoryForm'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { createCategory } from '~/lib/api/categories'

export function AdminCategoryFormPage() {
  const navigate = useNavigate()

  return (
    <AdminLayout
      title='Thêm danh mục'
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
      <AdminCategoryForm
        submitLabel='Tạo danh mục'
        submittingLabel='Đang tạo...'
        resetOnSuccess
        onSubmit={async (payload) => {
          const createdCategory = await createCategory(payload)
          return `Đã tạo danh mục "${createdCategory.name}" với slug "${createdCategory.slug}".`
        }}
      />
    </AdminLayout>
  )
}
