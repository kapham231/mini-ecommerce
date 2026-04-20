type FeaturedToyCardProps = {
  name: string
  priceLabel: string
  imageSrc: string
  tag: string
  accent?: 'mint' | 'pink'
}

export function FeaturedToyCard({
  name,
  priceLabel,
  imageSrc,
  tag,
  accent = 'mint',
}: FeaturedToyCardProps) {
  const tagStyles =
    accent === 'pink'
      ? 'bg-kid-mint text-kid-ink ring-1 ring-kid-mint/50'
      : 'bg-kid-mint text-kid-ink ring-1 ring-kid-mint/50'

  const btnStyles =
    accent === 'pink'
      ? 'border-kid-green/60 bg-kid-green text-white hover:brightness-95'
      : 'border-kid-green/60 bg-kid-green text-white hover:brightness-95'

  return (
    <article
      className='group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-kid-ink/8 bg-white shadow-kid-card transition hover:-translate-y-0.5 hover:shadow-kid-card-hover'
    >
      <div className='relative flex aspect-square items-center justify-center bg-gradient-to-b from-slate-100 to-white'>
        <img
          src={imageSrc}
          alt={name}
          className='h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]'
          loading='lazy'
        />
        <span
          className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tagStyles}`}
        >
          {tag}
        </span>
      </div>
      <div className='flex flex-1 flex-col p-4 pt-3'>
        <h3 className='line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-kid-ink'>
          {name}
        </h3>
        <p className='mt-2 text-base font-extrabold text-kid-ink'>{priceLabel}</p>
        <button
          type='button'
          className={`mt-auto inline-flex h-10 items-center justify-center rounded-full border-2 px-4 text-xs font-bold transition ${btnStyles}`}
        >
          Xem chi tiết
        </button>
      </div>
    </article>
  )
}
