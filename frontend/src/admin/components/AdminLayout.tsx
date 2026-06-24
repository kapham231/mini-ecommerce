import type { ReactNode } from 'react'
import { AdminNotificationBell } from '~/admin/components/AdminNotificationBell'

type AdminLayoutProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
  maxWidthClassName?: string
  children: ReactNode
}

export function AdminLayout({
  eyebrow = 'Admin',
  title,
  description,
  actions,
  maxWidthClassName = 'max-w-6xl',
  children,
}: AdminLayoutProps) {
  return (
    <div className='min-h-screen bg-shop-blue font-sans'>
      <header className={`mx-auto ${maxWidthClassName} px-4 pt-6 sm:px-6`}>
        <div className='flex items-center justify-end'>
          <AdminNotificationBell />
        </div>
      </header>

      <main className={`mx-auto ${maxWidthClassName} px-4 pb-10 pt-4 sm:px-6`}>
        <section className='rounded-[2rem] bg-white px-6 py-7 shadow-shop-soft sm:px-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <p className='text-sm font-bold uppercase tracking-[0.22em] text-shop-teal'>{eyebrow}</p>
              <h1 className='mt-2 font-sans text-3xl font-extrabold text-shop-ink sm:text-4xl'>{title}</h1>
              {description && (
                <p className='mt-3 max-w-2xl text-sm leading-6 text-shop-ink/65 sm:text-base'>{description}</p>
              )}
            </div>
            {actions && <div className='flex flex-wrap gap-3'>{actions}</div>}
          </div>

          <div className='mt-8'>{children}</div>
        </section>
      </main>
    </div>
  )
}
