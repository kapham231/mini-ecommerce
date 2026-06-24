import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function IconBell({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 24 24' fill='none' aria-hidden>
      <path
        d='M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function AdminNotificationBell() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen((prev) => !prev)}
        className='relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-shop-ink/10 bg-white text-shop-ink transition hover:border-shop-teal/40 hover:text-shop-teal'
        aria-label='Thông báo'
        aria-expanded={isOpen}
        aria-haspopup='dialog'
      >
        <IconBell className='h-5 w-5' />
      </button>

      {isOpen && (
        <div
          role='dialog'
          aria-label='Thông báo gần đây'
          className='absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] rounded-[1.5rem] border border-shop-ink/10 bg-white p-4 shadow-shop-soft'
        >
          <div className='flex items-center justify-between gap-3'>
            <h2 className='font-sans text-lg font-extrabold text-shop-ink'>Thông báo</h2>
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='rounded-xl px-2 py-1 text-xs font-bold text-shop-ink/60 transition hover:bg-shop-blue/45 hover:text-shop-ink'
            >
              Đóng
            </button>
          </div>

          <div className='mt-3 flex flex-wrap items-center gap-2'>
            <button
              type='button'
              disabled
              className='inline-flex min-h-9 items-center justify-center rounded-xl border border-shop-ink/10 bg-shop-blue/35 px-3 text-xs font-bold text-shop-ink opacity-50'
            >
              Đánh dấu tất cả đã đọc
            </button>
            <Link
              to='/admin/notifications'
              onClick={() => setIsOpen(false)}
              className='inline-flex min-h-9 items-center justify-center rounded-xl bg-kid-green px-3 text-xs font-bold text-white transition hover:brightness-95'
            >
              Xem tất cả
            </Link>
          </div>

          <div className='mt-4 max-h-80 overflow-y-auto'>
            <p className='text-sm text-shop-ink/60'>Chưa có thông báo nào.</p>
          </div>
        </div>
      )}
    </div>
  )
}
