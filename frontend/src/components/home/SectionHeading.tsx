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
  theme = 'kid',
  titleId,
}: SectionHeadingProps) {
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
        <p className={`mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em]`}>
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
