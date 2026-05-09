import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategories } from '~/lib/api/categories'
import { deleteProduct, getProducts } from '~/lib/api/products'
import type { CategoryApi, ProductApi } from '~/lib/api/types'
import { formatVndFromDecimal } from '~/lib/formatPrice'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

const pageSize = 12

export function AdminProductsPage() {
  const navigate = useNavigate()
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
            to='/admin/products/new'
            className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-5 text-sm font-bold text-white shadow-md transition hover:brightness-95'
          >
            Thêm sản phẩm
          </Link>
        </>
      }
    >
      <section className='grid gap-4 rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 p-4 md:grid-cols-[minmax(0,1fr)_260px_auto] md:items-end'>
        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Tìm theo tên / mô tả
          <input
            value={search}
            onChange={(e) => updateFilters({ search: e.target.value, page: 1 })}
            placeholder='Ví dụ: gấu bông, pastel, xếp hình...'
            className='rounded-xl border border-shop-ink/15 bg-white px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          />
        </label>

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Danh mục
          <select
            value={categoryId}
            onChange={(e) => updateFilters({ categoryId: e.target.value, page: 1 })}
            className='rounded-xl border border-shop-ink/15 bg-white px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          >
            <option value=''>Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type='button'
          onClick={() => setSearchParams(new URLSearchParams())}
          className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
        >
          Xóa bộ lọc
        </button>
      </section>

      <div className='mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-shop-ink/60'>
        <p>
          {isLoading ? 'Đang tải dữ liệu...' : `Hiển thị ${products.length} / ${totalItems} sản phẩm`}
        </p>
        <p>Trang {page} / {totalPages}</p>
      </div>

      {error && (
        <p className='mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
          {error}
        </p>
      )}

      {isLoading ? (
        <div className='mt-6 rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Đang tải danh sách sản phẩm...
        </div>
      ) : products.length === 0 ? (
        <div className='mt-6 rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60'>
          Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className='mt-6 overflow-hidden rounded-[1.75rem] border border-shop-ink/10 bg-white shadow-shop-soft'>
          <div className='grid grid-cols-[minmax(0,1.3fr)_minmax(140px,0.7fr)_120px_140px_180px] gap-4 bg-shop-blue/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-shop-ink/60'>
            <span>Sản phẩm</span>
            <span>Danh mục</span>
            <span>Tồn kho</span>
            <span>Giá</span>
            <span>Thao tác</span>
          </div>

          <div className='divide-y divide-shop-ink/8'>
            {products.map((product) => (
              <div
                key={product.id}
                className='grid grid-cols-[minmax(0,1.3fr)_minmax(140px,0.7fr)_120px_140px_180px] gap-4 px-4 py-4 text-sm'
              >
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
                <div className='flex items-center gap-2'>
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className='inline-flex min-h-9 items-center justify-center rounded-xl border border-shop-ink/10 bg-white px-3 text-xs font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
                  >
                    Sửa
                  </Link>
                  <button
                    type='button'
                    disabled={deletingProductId === product.id}
                    onClick={() => {
                      void handleDeleteProduct(product)
                    }}
                    className='inline-flex min-h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {deletingProductId === product.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className='mt-6 flex flex-wrap items-center justify-between gap-3'>
        <button
          type='button'
          disabled={page <= 1}
          onClick={() => updateFilters({ page: page - 1 })}
          className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal disabled:cursor-not-allowed disabled:opacity-50'
        >
          Trang trước
        </button>

        <button
          type='button'
          disabled={page >= totalPages}
          onClick={() => updateFilters({ page: page + 1 })}
          className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal disabled:cursor-not-allowed disabled:opacity-50'
        >
          Trang sau
        </button>
      </div>
    </AdminLayout>
  )
}
