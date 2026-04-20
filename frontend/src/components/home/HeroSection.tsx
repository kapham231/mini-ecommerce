type HeroSectionProps = {
  imageSrc?: string
  imageAlt?: string
}

export function HeroSection({
  imageSrc = '/banner/banner.png',
  imageAlt = 'Bộ sưu tập thú bông Kidozone',
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
      </div>
    </section>
  )
}
