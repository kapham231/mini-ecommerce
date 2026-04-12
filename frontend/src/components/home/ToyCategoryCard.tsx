type ToyCategoryCardProps = {
  title: string
  imageSrc: string
  description?: string
  href?: string
  variant?: 'mint' | 'pink'
}

export function ToyCategoryCard({
  title,
  imageSrc,
  description,
  href = '#',
  variant = 'mint',
}: ToyCategoryCardProps) {
  const shell =
    variant === 'pink'
      ? 'border-shop-teal/30 bg-shop-blue/40 hover:border-shop-teal/50 hover:bg-shop-blue/55'
      : 'border-shop-teal/25 bg-shop-mint/90 hover:border-shop-teal/45 hover:bg-shop-mint'

  return (
    <a
      href={href}
      className={`group flex flex-col items-center rounded-[1.25rem] border-2 p-4 text-center shadow-shop-soft transition hover:-translate-y-0.5 hover:shadow-lg ${shell}`}
    >
      <div className='mb-3 flex h-[4.25rem] w-full max-w-[6.5rem] items-center justify-center rounded-xl bg-white/90 shadow-sm ring-1 ring-shop-ink/5 transition group-hover:ring-shop-ink/10'>
        <img
          src={imageSrc}
          alt={title}
          className='h-11 w-auto object-contain'
          loading='lazy'
        />
      </div>
      <span className='text-sm font-bold text-shop-ink'>{title}</span>
      {description && (
        <span className='mt-1 line-clamp-2 text-[11px] leading-snug text-shop-ink/55'>{description}</span>
      )}
    </a>
  )
}
