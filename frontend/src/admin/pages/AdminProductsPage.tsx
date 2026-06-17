import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminPagination, AdminPageActions, AdminRowActions } from '~/admin/components/AdminActionBits'
import { AdminAlert, AdminListMeta, AdminListPanel } from '~/admin/components/AdminListBits'
import { AdminDataTable } from '~/admin/components/AdminDataTable'
import { AdminFilterBar, AdminFilterInput, AdminFilterSelect } from '~/admin/components/AdminFilterBar'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getErrorMessage } from '~/admin/utils/getErrorMessage'
import { getCategories } from '~/lib/api/categories'
import { deleteProduct, getProducts } from '~/lib/api/products'
import type { CategoryApi, ProductApi } from '~/lib/api/types'
import { formatVndFromDecimal } from '~/lib/formatPrice'

const pageSize = 12

const productTableHeaderClassName =
  'grid grid-cols-[minmax(0,1.3fr)_minmax(140px,0.7fr)_120px_140px_180px] gap-4 bg-shop-blue/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-shop-ink/60'

const productTableRowClassName =
  'grid grid-cols-[minmax(0,1.3fr)_minmax(140px,0.7fr)_120px_140px_180px] gap-4 px-4 py-4 text-sm'

export function AdminProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<ProductApi[]>([])
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null)

  const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
  const search = searchParams.get('search') ?? ''
  const categoryId = searchParams.get('categoryId') ?? ''

  useEffect(() => {
    let cancelled = false

    async function loadCategories() {
      try {
        const data = await getCategories()
        if (!cancelled) {
          setCategories(data.filter((category) => category.isActive !== false))
        }
      } catch {
        // Keep products page usable even if categories fail.
      }
    }

    void loadCategories()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getProducts({
          page,
          limit: pageSize,
          search: search || undefined,
          categoryId: categoryId || undefined,
          sortBy: 'createdAt',
          order: 'desc',
        })

        if (cancelled) return
        setProducts(response.data)
        setTotalPages(Math.max(1, response.pagination.pages))
        setTotalItems(response.pagination.total)
      } catch (err) {
        if (!cancelled) {
          setError(getErrorMessage(err, 'Không tải được danh sách sản phẩm.'))
          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()
    return () => {
      cancelled = true
    }
  }, [page, search, categoryId])

  async function handleDeleteProduct(product: ProductApi) {
    setDeletingProductId(product.id)
    try {
      await deleteProduct(product.id)
      setProducts((prev) => prev.filter((item) => item.id !== product.id))
      setTotalItems((prev) => Math.max(0, prev - 1))
    } catch (err) {
      setError(getErrorMessage(err, 'Xóa sản phẩm thất bại.'))
    } finally {
      setDeletingProductId(null)
    }
  }

  function updateFilters(next: { search?: string; categoryId?: string; page?: number }) {
    const params = new URLSearchParams(searchParams)

    if (next.search !== undefined) {
      if (next.search) params.set('search', next.search)
      else params.delete('search')
    }

    if (next.categoryId !== undefined) {
      if (next.categoryId) params.set('categoryId', next.categoryId)
      else params.delete('categoryId')
    }

    if (next.page !== undefined) {
      if (next.page > 1) params.set('page', String(next.page))
      else params.delete('page')
    }

    setSearchParams(params)
  }

  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))

  return (
    <AdminLayout
      title='Quản lý sản phẩm'
      description='Theo dõi danh sách sản phẩm đang bán từ backend, lọc nhanh theo từ khóa hoặc danh mục và đi tới luồng tạo mới.'
      actions={<AdminPageActions createTo='/admin/products/new' createLabel='Thêm sản phẩm' />}
    >
      <AdminFilterBar
        gridClassName='md:grid-cols-[minmax(0,1fr)_260px_auto]'
        onClear={() => setSearchParams(new URLSearchParams())}
      >
        <AdminFilterInput
          label='Tìm theo tên / mô tả'
          value={search}
          placeholder='Ví dụ: gấu bông, pastel, xếp hình...'
          onChange={(value) => updateFilters({ search: value, page: 1 })}
        />
        <AdminFilterSelect
          label='Danh mục'
          value={categoryId}
          onChange={(value) => updateFilters({ categoryId: value, page: 1 })}
          options={[
            { value: '', label: 'Tất cả danh mục' },
            ...categories.map((category) => ({ value: category.id, label: category.name })),
          ]}
        />
      </AdminFilterBar>

      <AdminListMeta
        isLoading={isLoading}
        summary={`Hiển thị ${products.length} / ${totalItems} sản phẩm`}
        trailing={
          <p>
            Trang {page} / {totalPages}
          </p>
        }
      />

      {error && <AdminAlert message={error} />}

      {isLoading ? (
        <AdminListPanel message='Đang tải danh sách sản phẩm...' />
      ) : products.length === 0 ? (
        <AdminListPanel message='Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.' />
      ) : (
        <AdminDataTable
          minWidthClassName='min-w-[800px]'
          header={
            <div className={productTableHeaderClassName}>
              <span>Sản phẩm</span>
              <span>Danh mục</span>
              <span>Tồn kho</span>
              <span>Giá</span>
              <span>Thao tác</span>
            </div>
          }
        >
          <div className='divide-y divide-shop-ink/8'>
            {products.map((product) => (
              <div key={product.id} className={productTableRowClassName}>
                <div className='min-w-0'>
                  <p className='truncate font-bold text-shop-ink'>{product.name}</p>
                  <p className='mt-1 text-xs text-shop-ink/55'>
                    ID: {product.id.slice(0, 8)} · Slug: {product.slug}
                  </p>
                  {product.description && (
                    <p className='mt-2 line-clamp-2 text-sm text-shop-ink/65'>{product.description}</p>
                  )}
                </div>
                <div className='text-shop-ink/70'>{categoryNameById.get(product.categoryId) ?? 'Chưa rõ'}</div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      product.stock <= 10 ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {product.stock} sp
                  </span>
                </div>
                <div className='font-semibold text-shop-ink'>{formatVndFromDecimal(String(product.price))}</div>
                <AdminRowActions
                  editTo={`/admin/products/${product.id}/edit`}
                  isDeleting={deletingProductId === product.id}
                  onDelete={() => {
                    void handleDeleteProduct(product)
                  }}
                />
              </div>
            ))}
          </div>
        </AdminDataTable>
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={(nextPage) => updateFilters({ page: nextPage })} />
    </AdminLayout>
  )
}
