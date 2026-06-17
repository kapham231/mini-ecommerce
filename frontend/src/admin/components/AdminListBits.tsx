import type { ReactNode } from 'react'

type AdminAlertProps = {
  message: string
  className?: string
}

export function AdminAlert({ message, className = 'mt-4' }: AdminAlertProps) {
  return (
    <p className={`${className} rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800`} role='alert'>
      {message}
    </p>
  )
}

type AdminListPanelProps = {
  message: string
  className?: string
}

export function AdminListPanel({ message, className = 'mt-6' }: AdminListPanelProps) {
  return (
    <div
      className={`${className} rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 px-5 py-12 text-center text-sm text-shop-ink/60`}
    >
      {message}
    </div>
  )
}

type AdminListMetaProps = {
  isLoading: boolean
  loadingLabel?: string
  summary: string
  trailing?: ReactNode
  className?: string
}

export function AdminListMeta({
  isLoading,
  loadingLabel = 'Đang tải dữ liệu...',
  summary,
  trailing,
  className = 'mt-6',
}: AdminListMetaProps) {
  return (
    <div className={`${className} flex flex-wrap items-center justify-between gap-3 text-sm text-shop-ink/60`}>
      <p>{isLoading ? loadingLabel : summary}</p>
      {trailing}
    </div>
  )
}
