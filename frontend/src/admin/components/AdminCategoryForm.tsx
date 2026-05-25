import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'

export type AdminCategoryFormSubmitPayload = {
  name: string
  description?: string
}

type AdminCategoryFormValues = {
  name: string
  description: string
}

type AdminCategoryFormProps = {
  initialValues?: AdminCategoryFormValues
  submitLabel: string
  submittingLabel: string
  onSubmit: (payload: AdminCategoryFormSubmitPayload) => Promise<string>
  resetOnSuccess?: boolean
}

const defaultValues: AdminCategoryFormValues = {
  name: '',
  description: ''
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? error.message ?? fallback
  }
  return fallback
}

export function AdminCategoryForm({
  initialValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  resetOnSuccess = false
}: AdminCategoryFormProps) {
  const hydratedInitialValues = useMemo(
    () => ({
      ...defaultValues,
      ...initialValues
    }),
    [initialValues]
  )

  const [name, setName] = useState(hydratedInitialValues.name)
  const [description, setDescription] = useState(hydratedInitialValues.description)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setName(hydratedInitialValues.name)
    setDescription(hydratedInitialValues.description)
  }, [hydratedInitialValues])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    const trimmedName = name.trim()
    const trimmedDescription = description.trim()

    if (!trimmedName) {
      setError('Tên danh mục là bắt buộc.')
      return
    }
    if (trimmedName.length < 2) {
      setError('Tên danh mục phải có ít nhất 2 ký tự.')
      return
    }
    if (trimmedDescription.length > 500) {
      setError('Mô tả danh mục không được vượt quá 500 ký tự.')
      return
    }

    setIsSubmitting(true)
    try {
      const message = await onSubmit({
        name: trimmedName,
        description: trimmedDescription || undefined
      })
      setSuccessMessage(message)
      if (resetOnSuccess) {
        setName(defaultValues.name)
        setDescription(defaultValues.description)
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Lưu danh mục thất bại.'))
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
        Tên danh mục
        <input
          required
          disabled={isSubmitting}
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        disabled={isSubmitting}
        className='mt-2 inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-6 text-sm font-bold text-white shadow-md transition hover:brightness-95'
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  )
}
