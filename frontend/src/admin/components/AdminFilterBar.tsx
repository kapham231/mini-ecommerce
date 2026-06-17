import type { ReactNode } from 'react'

type AdminFilterBarProps = {
  children: ReactNode
  gridClassName?: string
  onClear: () => void
}

export function AdminFilterBar({
  children,
  gridClassName = 'md:grid-cols-[minmax(0,1fr)_auto]',
  onClear,
}: AdminFilterBarProps) {
  return (
    <section className={`grid gap-4 rounded-[1.5rem] border border-shop-ink/10 bg-shop-blue/35 p-4 md:items-end ${gridClassName}`}>
      {children}
      <button
        type='button'
        onClick={onClear}
        className='inline-flex min-h-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white px-5 text-sm font-bold text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
      >
        Xóa bộ lọc
      </button>
    </section>
  )
}

const fieldClassName =
  'rounded-xl border border-shop-ink/15 bg-white px-3 py-2 text-shop-ink outline-none ring-shop-teal/40 focus:ring-2'

type AdminFilterInputProps = {
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export function AdminFilterInput({ label, value, placeholder, onChange }: AdminFilterInputProps) {
  return (
    <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldClassName}
      />
    </label>
  )
}

type AdminFilterSelectOption = {
  value: string
  label: string
}

type AdminFilterSelectProps = {
  label: string
  value: string
  options: AdminFilterSelectOption[]
  onChange: (value: string) => void
}

export function AdminFilterSelect({ label, value, options, onChange }: AdminFilterSelectProps) {
  return (
    <label className='flex flex-col gap-1 text-sm font-semibold text-shop-ink'>
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={fieldClassName}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
