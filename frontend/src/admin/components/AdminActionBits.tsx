import { Link, useNavigate } from 'react-router-dom'

type AdminPageActionsProps = {
  createTo: string
  createLabel: string
}

export function AdminPageActions({ createTo, createLabel }: AdminPageActionsProps) {
  const navigate = useNavigate()

  return (
    <>
      <button
        type='button'
        onClick={() => navigate(-1)}
        className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
      >
        Quay lại
      </button>
      <Link
        to={createTo}
        className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-5 text-sm font-bold text-white shadow-md transition hover:brightness-95'
      >
        {createLabel}
      </Link>
    </>
  )
}

type AdminPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function AdminPagination({ page, totalPages, onPageChange, className = 'mt-6' }: AdminPaginationProps) {
  const buttonClassName =
    'inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal disabled:cursor-not-allowed disabled:opacity-50'

  return (
    <div className={`${className} flex flex-wrap items-center justify-between gap-3`}>
      <button type='button' disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={buttonClassName}>
        Trang trước
      </button>
      <button
        type='button'
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={buttonClassName}
      >
        Trang sau
      </button>
    </div>
  )
}

type AdminRowActionsProps = {
  editTo: string
  onDelete: () => void
  isDeleting?: boolean
  deleteLabel?: string
  deletingLabel?: string
}

export function AdminRowActions({
  editTo,
  onDelete,
  isDeleting = false,
  deleteLabel = 'Xóa',
  deletingLabel = 'Đang xóa...',
}: AdminRowActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      <Link
        to={editTo}
        className='inline-flex min-h-9 items-center justify-center rounded-xl border border-shop-ink/10 bg-white px-3 text-xs font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
      >
        Sửa
      </Link>
      <button
        type='button'
        disabled={isDeleting}
        onClick={onDelete}
        className='inline-flex min-h-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 px-3 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60'
      >
        {isDeleting ? deletingLabel : deleteLabel}
      </button>
    </div>
  )
}
