import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminPageActions, AdminRowActions } from '~/admin/components/AdminActionBits'
import { AdminAlert, AdminListMeta, AdminListPanel } from '~/admin/components/AdminListBits'
import { AdminDataTable } from '~/admin/components/AdminDataTable'
import { AdminFilterBar, AdminFilterInput, AdminFilterSelect } from '~/admin/components/AdminFilterBar'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getErrorMessage } from '~/admin/utils/getErrorMessage'
import { deleteCategory, getCategories } from '~/lib/api/categories'
import type { CategoryApi } from '~/lib/api/types'

const categoryTableHeaderClassName =
  'grid grid-cols-[minmax(0,1fr)_180px_110px_180px] gap-4 bg-shop-blue/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-shop-ink/60'

const categoryTableRowClassName = 'grid grid-cols-[minmax(0,1fr)_180px_110px_180px] gap-4 px-4 py-4 text-sm'

const statusFilterOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'active', label: 'Đang hiện' },
  { value: 'inactive', label: 'Đang ẩn' },
]

export function AdminCategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const search = searchParams.get('search') ?? ''
  const status = searchParams.get('status') ?? ''

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

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return categories.filter((category) => {
      const matchesSearch =
        !keyword ||
        category.name.toLowerCase().includes(keyword) ||
        category.slug.toLowerCase().includes(keyword) ||
        (category.description?.toLowerCase().includes(keyword) ?? false)

      const matchesStatus =
        !status ||
        (status === 'active' && category.isActive !== false) ||
        (status === 'inactive' && category.isActive === false)

      return matchesSearch && matchesStatus
    })
  }, [categories, search, status])

  function updateFilters(next: { search?: string; status?: string }) {
    const params = new URLSearchParams(searchParams)

    if (next.search !== undefined) {
      if (next.search) params.set('search', next.search)
      else params.delete('search')
    }

    if (next.status !== undefined) {
      if (next.status) params.set('status', next.status)
      else params.delete('status')
    }

    setSearchParams(params)
  }

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
      description='Theo dõi danh sách danh mục sản phẩm hiện có từ backend, lọc nhanh theo từ khóa hoặc trạng thái.'
      actions={<AdminPageActions createTo='/admin/categories/new' createLabel='Thêm danh mục' />}
    >
      <AdminFilterBar
        gridClassName='md:grid-cols-[minmax(0,1fr)_200px_auto]'
        onClear={() => setSearchParams(new URLSearchParams())}
      >
        <AdminFilterInput
          label='Tìm theo tên / slug / mô tả'
          value={search}
          placeholder='Ví dụ: đồ chơi, do-choi...'
          onChange={(value) => updateFilters({ search: value })}
        />
        <AdminFilterSelect
          label='Trạng thái'
          value={status}
          options={statusFilterOptions}
          onChange={(value) => updateFilters({ status: value })}
        />
      </AdminFilterBar>

      <AdminListMeta
        isLoading={isLoading}
        summary={`Hiển thị ${filteredCategories.length} / ${categories.length} danh mục`}
      />

      {error && <AdminAlert message={error} />}

      {isLoading ? (
        <AdminListPanel message='Đang tải danh sách danh mục...' />
      ) : categories.length === 0 ? (
        <AdminListPanel message='Chưa có danh mục nào.' />
      ) : filteredCategories.length === 0 ? (
        <AdminListPanel message='Không tìm thấy danh mục phù hợp với bộ lọc hiện tại.' />
      ) : (
        <AdminDataTable
          header={
            <div className={categoryTableHeaderClassName}>
              <span>Danh mục</span>
              <span>Slug</span>
              <span>Trạng thái</span>
              <span>Thao tác</span>
            </div>
          }
        >
          <div className='divide-y divide-shop-ink/8'>
            {filteredCategories.map((category) => (
              <div key={category.id} className={categoryTableRowClassName}>
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
                <AdminRowActions
                  editTo={`/admin/categories/${category.id}/edit`}
                  isDeleting={deletingCategoryId === category.id}
                  onDelete={() => {
                    void handleDeleteCategory(category)
                  }}
                />
              </div>
            ))}
          </div>
        </AdminDataTable>
      )}
    </AdminLayout>
  )
}
