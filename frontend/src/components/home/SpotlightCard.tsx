type SpotlightCardProps = {
  title: string
  description: string
  imageSrc: string
  href: string
}

export function SpotlightCard({ title, description, imageSrc, href }: SpotlightCardProps) {
  return (
    <article className='flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-shop-ink/8 bg-white shadow-shop-soft transition hover:shadow-lg'>
      <a href={href} className='group flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-shop-teal/60'>
        <div className='relative aspect-[4/3] bg-slate-100'>
          <img
            src={imageSrc}
            alt=''
            aria-hidden
            className='h-full w-full object-contain p-6 transition duration-300 group-hover:scale-[1.02]'
            loading='lazy'
          />
        </div>
        <div className='flex flex-1 flex-col px-5 pb-6 pt-4 text-center'>
          <h3 className='font-sans text-xl font-semibold leading-snug text-shop-ink sm:text-[1.35rem]'>
            {title}
          </h3>
          <p className='mt-2 flex-1 text-sm leading-relaxed text-shop-ink/70'>{description}</p>
          <span className='mt-4 inline-flex items-center justify-center text-sm font-semibold text-shop-teal underline-offset-4 group-hover:underline'>
            Khám phá
          </span>
        </div>
      </a>
    </article>
  )
}
