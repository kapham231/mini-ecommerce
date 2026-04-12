import type { Testimonial } from '~/data/homeShowcase'

type CustomerTestimonialsProps = {
  items: Testimonial[]
}

export function CustomerTestimonials({ items }: CustomerTestimonialsProps) {
  return (
    <div className='grid gap-6 md:grid-cols-3'>
      {items.map((t) => (
        <blockquote
          key={t.id}
          className='flex h-full flex-col rounded-[1.25rem] border border-shop-ink/8 bg-white/90 px-5 py-6 shadow-shop-soft'
        >
          <p className='flex-1 text-sm leading-relaxed text-shop-ink/80'>“{t.quote}”</p>
          <footer className='mt-5 flex items-center gap-3 border-t border-shop-ink/10 pt-4'>
            <span
              className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-shop-teal/25 font-sans text-lg font-semibold text-shop-ink'
              aria-hidden
            >
              {t.initial}
            </span>
            <div>
              <cite className='not-italic text-sm font-bold text-shop-ink'>{t.name}</cite>
              <p className='text-xs text-shop-ink/55'>{t.role}</p>
            </div>
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
