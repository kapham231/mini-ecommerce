import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { shopCategories } from '~/data/shopCatalog'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function AdminProductFormPage() {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [categoryId, setCategoryId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [demoSent, setDemoSent] = useState(false)

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugify(name))
    }
  }, [name, slugTouched])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setDemoSent(false)
    const priceNum = Number(price)
    const stockNum = Number.parseInt(stock, 10)
    const catId = Number.parseInt(categoryId, 10)
    if (!name.trim() || !slug.trim()) {
      setError('Tên và slug là bắt buộc.')
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
    if (!Number.isFinite(catId) || catId < 1) {
      setError('Chọn danh mục.')
      return
    }
    setDemoSent(true)
  }

  return (
    <div className='min-h-screen bg-shop-blue font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-lg px-4 py-10 sm:px-6'>
        <h1 className='font-sans text-2xl font-extrabold text-shop-ink'>Thêm sản phẩm</h1>
        <p className='mt-1 text-sm text-shop-ink/60'>
          {' '}
          <Link to='/products' className='font-semibold text-shop-teal hover:underline'>
            Về danh sách
          </Link>
        </p>

        <form
          onSubmit={handleSubmit}
          className='mt-8 flex flex-col gap-4 rounded-[1.25rem] border border-shop-ink/10 bg-white p-6 shadow-shop-soft'
        >
          {demoSent && (
            <p
              className='rounded-lg border border-shop-teal/40 bg-shop-mint/50 px-3 py-2 text-sm text-shop-ink'
              role='status'
            >
              Đã “gửi” bản demo — không có dữ liệu thật. Kết nối API sau để lưu sản phẩm.
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
            Slug (URL)
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true)
                setSlug(e.target.value)
              }}
              className='rounded-xl border border-shop-ink/15 px-3 py-2 font-mono text-sm text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
            Danh mục
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            >
              <option value=''>— Chọn —</option>
              {shopCategories.map((c) => (
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
              type='number'
              min={0}
              step={1}
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
            Ảnh (URL)
            <input
              type='url'
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder='https://...'
              className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            />
          </label>

          <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
            Mô tả
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='resize-y rounded-xl border border-shop-ink/15 px-3 py-2 text-sm text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'
            />
          </label>

          <button
            type='submit'
            className='mt-2 inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-6 text-sm font-bold text-white shadow-md transition hover:brightness-95'
          >
            Gửi
          </button>
        </form>
      </main>
      <SiteFooter />
    </div>
  )
}
