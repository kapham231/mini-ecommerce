import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import { createPresignedUpload, uploadFileToS3 } from '~/lib/api/uploads'
import type { CategoryApi } from '~/lib/api/types'

export type AdminProductFormSubmitPayload = {
  name: string
  description?: string
  price: number
  stock: number
  categoryId: string
  imageUrl?: string
}

type AdminProductFormValues = {
  name: string
  description: string
  price: string
  stock: string
  categoryId: string
  imageUrl: string
}

type AdminProductFormProps = {
  categories: CategoryApi[]
  isLoadingCategories?: boolean
  initialValues?: AdminProductFormValues
  submitLabel: string
  submittingLabel: string
  onSubmit: (payload: AdminProductFormSubmitPayload) => Promise<string>
  resetOnSuccess?: boolean
}

const defaultValues: AdminProductFormValues = {
  name: '',
  description: '',
  price: '',
  stock: '0',
  categoryId: '',
  imageUrl: ''
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminProductForm({
  categories,
  isLoadingCategories = false,
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  resetOnSuccess = false
}: AdminProductFormProps) {
  const hydratedInitialValues = useMemo(
    () => ({
      ...defaultValues,
      ...initialValues
    }),
    [initialValues]
  )

  const [name, setName] = useState(hydratedInitialValues.name)
  const [description, setDescription] = useState(hydratedInitialValues.description)
  const [price, setPrice] = useState(hydratedInitialValues.price)
  const [stock, setStock] = useState(hydratedInitialValues.stock)
  const [categoryId, setCategoryId] = useState(hydratedInitialValues.categoryId)
  const [uploadedImageUrl, setUploadedImageUrl] = useState(hydratedInitialValues.imageUrl)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  useEffect(() => {
    setName(hydratedInitialValues.name)
    setDescription(hydratedInitialValues.description)
    setPrice(hydratedInitialValues.price)
    setStock(hydratedInitialValues.stock)
    setCategoryId(hydratedInitialValues.categoryId)
    setUploadedImageUrl(hydratedInitialValues.imageUrl)
    setSelectedImageFile(null)
  }, [hydratedInitialValues])

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
      let imageUrl = uploadedImageUrl
      if (selectedImageFile) {
        setIsUploadingImage(true)
        try {
          const presignedUpload = await createPresignedUpload({
            fileName: selectedImageFile.name,
            contentType: selectedImageFile.type
          })
          await uploadFileToS3(presignedUpload.uploadUrl, selectedImageFile)
          imageUrl = presignedUpload.fileUrl
          setUploadedImageUrl(imageUrl)
        } finally {
          setIsUploadingImage(false)
        }
      }

      const message = await onSubmit({
        name: trimmedName,
        description: trimmedDescription || undefined,
        price: priceNum,
        stock: stockNum,
        categoryId,
        imageUrl: imageUrl || undefined
      })
      setSuccessMessage(message)

      if (resetOnSuccess) {
        setName(defaultValues.name)
        setDescription(defaultValues.description)
        setPrice(defaultValues.price)
        setStock(defaultValues.stock)
        setCategoryId(defaultValues.categoryId)
        setUploadedImageUrl(defaultValues.imageUrl)
      }

      setSelectedImageFile(null)
    } catch (err) {
      setError(getErrorMessage(err, 'Lưu sản phẩm thất bại.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
        Số lượng
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

      <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
        Ảnh sản phẩm
        <input
          disabled={isSubmitting || isUploadingImage}
          type='file'
          accept='image/png,image/jpeg,image/webp,image/gif'
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null
            setSelectedImageFile(file)
          }}
          className='rounded-xl border border-shop-ink/15 px-3 py-2 text-shop-ink file:mr-3 file:rounded-lg file:border-0 file:bg-shop-teal/10 file:px-3 file:py-1.5 file:font-semibold file:text-shop-teal'
        />
        {uploadedImageUrl && (
          <img src={uploadedImageUrl} alt='Ảnh sản phẩm' className='mt-2 h-28 w-28 rounded-xl border border-shop-ink/10 object-cover' />
        )}
      </label>

      <button
        type='submit'
        disabled={isSubmitting || isLoadingCategories || isUploadingImage}
        className='mt-2 inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-6 text-sm font-bold text-white shadow-md transition hover:brightness-95'
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}
