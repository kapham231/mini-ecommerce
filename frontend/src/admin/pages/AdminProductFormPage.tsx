import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AdminLayout } from '~/admin/components/AdminLayout'
import { getCategories } from '~/lib/api/categories'
import { createProduct } from '~/lib/api/products'
import type { CategoryApi } from '~/lib/api/types'

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminProductFormPage() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<CategoryApi[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        if (!cancelled) {
          setError(getErrorMessage(err, 'Không tải được danh mục từ API.'))
        }
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    const priceNum = Number(price)
    const stockNum = Number.parseInt(stock, 10)
    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setError('Tên sản phẩm là bắt buộc.')
      return
    }
    if (trimmedName.length < 3) {
      setError('Tên sản phẩm phải có ít nhất 3 ký tự.')
      return
    }
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      setError('Giá không hợp lệ.')
      return
    }
    if (!Number.isFinite(stockNum) || stockNum < 0) {
      setError('Tồn kho phải là số nguyên ≥ 0.')
      return
    }
    if (!categoryId) {
      setError('Chọn danh mục.')
      return
    }
    if (trimmedDescription.length > 1000) {
      setError('Mô tả không được vượt quá 1000 ký tự.')
      return
    }

    setIsSubmitting(true)
    try {
      const createdProduct = await createProduct({
        name: trimmedName,
        description: trimmedDescription || undefined,
        price: priceNum,
        stock: stockNum,
        categoryId,
      })

      setSuccessMessage(`Đã tạo sản phẩm "${createdProduct.name}" với slug "${createdProduct.slug}".`)
      setName('')
      setDescription('')
      setPrice('')
      setStock('0')
      setCategoryId('')
    } catch (err) {
      setError(getErrorMessage(err, 'Tạo sản phẩm thất bại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout
      title='Thêm sản phẩm'
      maxWidthClassName='max-w-3xl'
      actions={
        <Link
          to='/admin/products'
          className='inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
        >
          DS sản phẩm
        </Link>
      }
    >
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 rounded-[1.25rem] border border-shop-ink/10 bg-white p-6 shadow-shop-soft'
      >
        {successMessage && (
          <p
            className='rounded-lg border border-shop-teal/40 bg-shop-mint/50 px-3 py-2 text-sm text-shop-ink'
            role='status'
          >
            {successMessage}
          </p>
        )}
        {error && (
          <p className='rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800' role='alert'>
            {error}
          </p>
        )}

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Tên sản phẩm
          <input
            required
            disabled={isSubmitting}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          />
        </label>

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Danh mục
          <select
            required
            disabled={isLoadingCategories || isSubmitting}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          >
            <option value=''>{isLoadingCategories ? 'Đang tải danh mục...' : '- Chọn -'}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Giá (VNĐ)
          <input
            required
            disabled={isSubmitting}
            type='number'
            min={0}
            step={1000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          />
        </label>

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Tồn kho
          <input
            required
            disabled={isSubmitting}
            type='number'
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          />
        </label>

        <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
          Mô tả
          <textarea
            rows={4}
            disabled={isSubmitting}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='resize-y rounded-xl border border-shop-ink/15 px-3 py-2 text-sm text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
          />
        </label>

        <button
          type='submit'
          disabled={isSubmitting || isLoadingCategories}
          className='mt-2 inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-6 text-sm font-bold text-white shadow-md transition hover:brightness-95'
        >
          {isSubmitting ? 'Đang tạo...' : 'Tạo sản phẩm'}
        </button>
      </form>
    </AdminLayout>
  )
}
