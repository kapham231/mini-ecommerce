import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategories } from '~/lib/api/categories'
import { getProducts } from '~/lib/api/products'
import type { CategoryApi, ProductApi } from '~/lib/api/types'
import { formatVndFromDecimal } from '~/lib/formatPrice'

const lowStockThreshold = 10

function getDashboardStats(products: ProductApi[], categories: CategoryApi[]) {
  const categoryNameById = new Map(categories.map((category) => [category.id, category.name]))
  const totalProducts = products.length
  const totalUnits = products.reduce((sum, product) => sum + product.stock, 0)
  const inventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0)
  const lowStockItems = products.filter((product) => product.stock <= lowStockThreshold)

  const categoryBreakdown = Array.from(
    products.reduce(
      (map, product) => {
        const categoryName = categoryNameById.get(product.categoryId) ?? 'Chưa rõ danh mục'
        const current = map.get(categoryName) ?? { name: categoryName, count: 0, units: 0 }
        current.count += 1
        current.units += product.stock
        map.set(categoryName, current)
        return map
      },
      new Map<string, { name: string; count: number; units: number }>()
    ).values()
  ).sort((a, b) => b.units - a.units)

  const topProducts = [...products]
    .sort((a, b) => b.stock * b.price - a.stock * a.price)
    .slice(0, 4)

  return {
    totalProducts,
    totalUnits,
    inventoryValue,
    lowStockItems,
    categoryBreakdown,
    topProducts,
    categoryNameById,
  }
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <article className='rounded-[1.5rem] border border-shop-ink/10 bg-white p-5 shadow-shop-soft'>
      <p className='text-sm font-semibold text-shop-ink/55'>{label}</p>
      <p className='mt-3 font-sans text-3xl font-extrabold text-shop-ink'>{value}</p>
      <p className='mt-2 text-sm text-shop-ink/60'>{hint}</p>
    </article>
  )
}

export function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductApi[]>([])
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDashboard() {
      setIsLoading(true)
      setError(null)
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          getProducts({ limit: 100 }),
          getCategories(),
        ])

        if (cancelled) return
        setProducts(productsResponse.data)
        setCategories(categoriesResponse.filter((category) => category.isActive !== false))
      } catch (err) {
        if (cancelled) return
        setError(getErrorMessage(err, 'Không tải được dữ liệu dashboard admin.'))
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadDashboard()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(() => getDashboardStats(products, categories), [products, categories])

  return (
    <AdminLayout
      eyebrow='Admin dashboard'
      title='Tổng quan vận hành cửa hàng'
      description='Này là dashboard admin'
      actions={
        <>
          <Link
            to='/admin/products'
            className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
          >
            DS sản phẩm
          </Link>
          <Link
            to='/admin/products/new'
            className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-5 text-sm font-bold text-white shadow-md transition hover:brightness-95'
          >
            Thêm sản phẩm
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
          Đang tải dữ liệu từ API...
        </div>
      ) : (
        <>
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          label='Sản phẩm đang bán'
          value={String(stats.totalProducts)}
          hint='Số sản phẩm đang xuất hiện trong danh sách sản phẩm.'
        />
        <StatCard
          label='Tổng tồn kho'
          value={`${stats.totalUnits} sp`}
          hint='Tổng số lượng hàng sẵn có trên toàn bộ danh sách sản phẩm.'
        />
        <StatCard
          label='Giá trị tồn kho'
          value={formatVndFromDecimal(String(stats.inventoryValue))}
          hint='Tạm tính theo giá bán hiện tại của từng sản phẩm trong danh sách sản phẩm.'
        />
        <StatCard
          label='Sắp hết hàng'
          value={`${stats.lowStockItems.length} sản phẩm`}
          hint={`Các sản phẩm có tồn kho dưới ${lowStockThreshold} sản phẩm.`}
        />
      </div>

      <section className='mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]'>
        <article className='rounded-[1.75rem] border border-shop-ink/10 bg-white p-6 shadow-shop-soft'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h2 className='font-sans text-2xl font-extrabold text-shop-ink'>Cảnh báo tồn kho</h2>
              <p className='mt-1 text-sm text-shop-ink/60'>Ưu tiên nhập thêm hoặc đẩy khuyến mãi để xoay vòng hàng.</p>
            </div>
            <span className='rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700'>
              {stats.lowStockItems.length} cần xử lý
            </span>
          </div>

          <div className='mt-6 overflow-hidden rounded-2xl border border-shop-ink/8'>
            <div className='grid grid-cols-[minmax(0,1.5fr)_auto_auto] gap-3 bg-shop-blue/55 px-4 py-3 text-xs font-bold uppercase tracking-wide text-shop-ink/60'>
              <span>Sản phẩm</span>
              <span>Tồn kho</span>
              <span>Giá</span>
            </div>
            <div className='divide-y divide-shop-ink/8'>
              {stats.lowStockItems.map((product) => (
                <div
                  key={product.id}
                  className='grid grid-cols-[minmax(0,1.5fr)_auto_auto] items-center gap-3 px-4 py-4 text-sm'
                >
                  <div className='min-w-0'>
                    <p className='truncate font-bold text-shop-ink'>{product.name}</p>
                    <p className='mt-1 text-xs text-shop-ink/55'>
                      {stats.categoryNameById.get(product.categoryId) ?? 'Chưa rõ danh mục'} · ID: {product.id.slice(0, 8)}
                    </p>
                  </div>
                  <span className='rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700'>
                    {product.stock} sp
                  </span>
                  <span className='font-semibold text-shop-ink'>{formatVndFromDecimal(String(product.price))}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className='rounded-[1.75rem] border border-shop-ink/10 bg-white p-6 shadow-shop-soft'>
          <h2 className='font-sans text-2xl font-extrabold text-shop-ink'>Tỷ trọng danh mục</h2>
          <p className='mt-1 text-sm text-shop-ink/60'>Nhìn nhanh nhóm nào đang chiếm nhiều hàng nhất trong kho.</p>

          <div className='mt-6 space-y-4'>
            {stats.categoryBreakdown.map((category) => {
              const width = Math.max(12, Math.round((category.units / stats.totalUnits) * 100))
              return (
                <div key={category.name}>
                  <div className='mb-2 flex items-center justify-between gap-3 text-sm'>
                    <span className='font-bold text-shop-ink'>{category.name}</span>
                    <span className='text-shop-ink/60'>
                      {category.count} sản phẩm · {category.units} tồn
                    </span>
                  </div>
                  <div className='h-3 rounded-full bg-shop-blue/80'>
                    <div
                      className='h-3 rounded-full bg-shop-teal transition-all'
                      style={{ width: `${width}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </article>
      </section>

      <section className='mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]'>
        <article className='rounded-[1.75rem] border border-shop-ink/10 bg-white p-6 shadow-shop-soft'>
          <div className='flex items-center justify-between gap-3'>
            <div>
              <h2 className='font-sans text-2xl font-extrabold text-shop-ink'>SKU giá trị cao</h2>
              <p className='mt-1 text-sm text-shop-ink/60'>
                Xếp theo giá trị tồn kho để biết mặt hàng nào đang giữ nhiều vốn nhất.
              </p>
            </div>
          </div>

          <div className='mt-6 grid gap-4 sm:grid-cols-2'>
            {stats.topProducts.map((product) => (
              <div key={product.id} className='rounded-2xl border border-shop-ink/8 bg-shop-blue/35 p-4'>
                <div className='flex items-start gap-3'>
                  <div className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2 text-xs font-bold text-shop-ink/45'>
                    SP
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-bold text-shop-ink'>{product.name}</p>
                    <p className='mt-1 text-xs text-shop-ink/55'>
                      {stats.categoryNameById.get(product.categoryId) ?? 'Chưa rõ danh mục'}
                    </p>
                    <p className='mt-3 text-sm font-semibold text-shop-teal'>{formatVndFromDecimal(String(product.price))}</p>
                    <p className='mt-1 text-xs text-shop-ink/60'>Tồn kho: {product.stock} sp</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
        </>
      )}
    </AdminLayout>
  )
}
