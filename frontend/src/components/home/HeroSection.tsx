type HeroPill = {
  label: string
  href: string
}

type HeroSectionProps = {
  imageSrc?: string
  imageAlt?: string
  pills?: HeroPill[]
}

const defaultPills: HeroPill[] = [
  { label: 'Bộ sưu tập mới', href: '#featured' },
  { label: 'Ưu đãi tuần này', href: '#products' },
]

export function HeroSection({
  imageSrc = '/banner/banner.png',
  imageAlt = 'Bộ sưu tập thú bông Kidozone',
  pills = defaultPills,
}: HeroSectionProps) {
  return (
    <section className='relative w-full overflow-hidden bg-shop-ink'>
      <div className='relative min-h-[min(78vh,620px)] w-full sm:min-h-[min(72vh,560px)]'>
        <img
          src={imageSrc}
          alt={imageAlt}
          className='absolute inset-0 h-full w-full object-cover object-center'
          loading='eager'
          decoding='async'
        />
        <div
          className='absolute inset-0 bg-gradient-to-t from-shop-ink/55 via-shop-ink/10 to-shop-ink/25'
          aria-hidden
        />

        <div className='relative z-10 flex min-h-[inherit] flex-col'>
          <div className='flex flex-wrap justify-center gap-2 px-4 pb-4 pt-5 sm:gap-3 sm:pt-7'>
            {pills.map((pill) => (
              <a
                key={pill.href + pill.label}
                href={pill.href}
                className='rounded-full border border-white/35 bg-white/18 px-4 py-2 text-xs font-semibold shadow-sm bg-[#A8DF8E] transition hover:bg-white/28 sm:px-5 sm:text-sm'
              >
                {pill.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
