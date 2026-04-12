export function NewsletterBar() {
  return (
    <section className='border-y border-shop-ink/10 bg-shop-tan' aria-labelledby='newsletter-heading'>
      <div className='mx-auto flex max-w-6xl flex-col items-stretch gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-10'>
        <div className='text-center sm:text-left'>
          <h2 id='newsletter-heading' className='font-serif text-2xl sm:text-[1.65rem]'>
            Bản tin Kidozone
          </h2>
          <p className='mt-1 text-sm'>
            Nhận mã giảm giá và tin mẫu mới — tối đa một email mỗi tuần.
          </p>
        </div>
        <form
          className='flex w-full max-w-md flex-col gap-2 sm:flex-row sm:items-center'
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor='newsletter-email' className='sr-only'>
            Email
          </label>
          <input
            id='newsletter-email'
            name='email'
            type='email'
            autoComplete='email'
            placeholder='Email của bạn'
            className='min-h-11 w-full flex-1 rounded-2xl border-0 bg-white/95 px-4 text-sm text-shop-ink shadow-sm placeholder:text-shop-ink/40 focus:outline-none focus:ring-2 focus:ring-white/80'
          />
          <button
            type='submit'
            className='min-h-11 shrink-0 rounded-2xl bg-shop-ink px-6 text-sm font-bold bg-[#A8DF8E] shadow-md transition hover:bg-shop-ink/90'
          >
            Đăng ký
          </button>
        </form>
      </div>
    </section>
  )
}
