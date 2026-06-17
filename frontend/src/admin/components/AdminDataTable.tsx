import type { ReactNode } from 'react'

type AdminDataTableProps = {
  header: ReactNode
  children: ReactNode
  minWidthClassName?: string
  className?: string
}

export function AdminDataTable({
  header,
  children,
  minWidthClassName = 'min-w-[640px]',
  className = 'mt-6',
}: AdminDataTableProps) {
  return (
    <div
      className={`${className} overflow-hidden rounded-[1.75rem] border border-shop-ink/10 bg-white shadow-shop-soft`}
    >
      <div className='overflow-x-auto'>
        <div className={minWidthClassName}>
          {header}
          <div className='max-h-[min(32rem,calc(100vh-18rem))] overflow-y-auto'>{children}</div>
        </div>
      </div>
    </div>
  )
}
