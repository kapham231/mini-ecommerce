type PopupCheckoutProps = {
  onClose: () => void
}

export function PopupCheckout({ onClose }: PopupCheckoutProps) {
  return (
    <div className='w-full space-y-5 sm:space-y-6'>
      <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5'>
        <div
          className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-kid-mint-soft text-2xl text-kid-green shadow-sm ring-1 ring-kid-green/20 sm:h-16 sm:w-16 sm:text-3xl'
          aria-hidden
        >
          ✓
        </div>
        <div className='min-w-0 flex-1 text-center sm:text-left'>
          <h2 className='font-sans text-xl font-extrabold leading-tight text-shop-ink sm:text-2xl'>
            Thanh toán thành công
          </h2>
          <p className='mt-2 text-sm leading-relaxed text-shop-ink/70 sm:text-base'>
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ gửi email xác nhận trong vài phút tới.
          </p>
        </div>
      </div>

      <div className='grid gap-3 rounded-2xl border border-shop-ink/10 bg-shop-blue/60 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-wide text-shop-ink/50 sm:text-xs'>
            Mã đơn
          </p>
          <p className='mt-1 break-all font-mono text-sm font-bold text-shop-ink sm:text-base'>#KZ-2026-001</p>
        </div>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-wide text-shop-ink/50 sm:text-xs'>
            Giao hàng dự kiến
          </p>
          <p className='mt-1 text-sm font-semibold text-shop-ink sm:text-base'>2–4 ngày làm việc</p>
        </div>
      </div>

      <div className='flex flex-col gap-3 sm:flex-row sm:justify-end'>
        <button
          type='button'
          className='w-full rounded-xl border-2 border-shop-ink/15 bg-white px-4 py-2.5 text-sm font-bold text-shop-ink shadow-sm transition hover:border-shop-teal/40 hover:bg-slate-50 sm:w-auto sm:min-w-[120px]'
          onClick={onClose}
        >
          Đóng
        </button>
        <button
          type='button'
          className='w-full rounded-xl bg-kid-green px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-95 sm:w-auto sm:min-w-[160px]'
          onClick={onClose}
        >
          Hoàn tất
        </button>
      </div>
    </div>
  )
}
