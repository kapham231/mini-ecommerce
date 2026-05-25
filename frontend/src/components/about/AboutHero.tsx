import { Link } from 'react-router-dom'

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-shop-blue py-16 sm:py-24">
      {/* Background decoration */}
      <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-kid-mint-soft opacity-50 blur-3xl" />
      <div className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-shop-tan opacity-20 blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-kid-ink sm:text-6xl">
            Về <span className="text-kid-green">KidoZone</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-kid-ink/70">
            Chào mừng bạn đến với KidoZone - Thiên đường đồ chơi sáng tạo dành cho trẻ em.
            Chúng tôi không chỉ bán đồ chơi, chúng tôi mang đến những nụ cười và sự phát triển toàn diện cho bé.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/products"
              className="rounded-2xl bg-kid-green px-8 py-4 text-sm font-bold text-white shadow-kid-card transition hover:brightness-95 hover:shadow-kid-card-hover"
            >
              Khám phá sản phẩm
            </Link>
            <Link
              to="/#categories"
              className="group relative text-sm font-bold leading-6 text-kid-ink transition-colors hover:text-kid-green after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-kid-green after:transition-all after:duration-300 hover:after:w-full"
            >
              Tìm hiểu thêm <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}