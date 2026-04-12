type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'mint' | 'pink'
  theme?: 'kid' | 'shop'
  titleId?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  tone = 'mint',
  theme = 'kid',
  titleId,
}: SectionHeadingProps) {
  const dotKid =
    tone === 'pink'
      ? 'bg-kid-pink ring-kid-pink-soft'
      : 'bg-kid-mint ring-kid-mint-soft'
  const dotShop = 'bg-shop-teal ring-shop-blue/80'

  const dot = theme === 'shop' ? dotShop : dotKid

  const eyebrowCls =
    theme === 'shop'
      ? 'text-shop-ink/50'
      : 'text-kid-ink/55'

  const titleCls =
    theme === 'shop' ? 'font-sans font-extrabold text-shop-ink' : 'font-display font-extrabold text-kid-ink'

  const descCls =
    theme === 'shop' ? 'text-shop-ink/68' : 'text-kid-ink/65'

  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-2xl text-center'
          : 'max-w-2xl text-left'
      }
    >
      {eyebrow && (
        <p className={`mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${eyebrowCls}`}>
          <span className={`inline-block h-2 w-2 shrink-0 rounded-full ring-4 ${dot}`} aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        id={titleId}
        className={`text-2xl tracking-tight sm:text-3xl ${titleCls}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-2 text-sm leading-relaxed sm:text-[15px] ${descCls}`}>{description}</p>
      )}
    </div>
  )
}
