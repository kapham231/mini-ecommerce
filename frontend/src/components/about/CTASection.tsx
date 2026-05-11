import { Link } from 'react-router-dom'

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-kid-green px-6 py-24 shadow-shop-soft sm:px-24 xl:py-32">
          {/* Animated Background Accents */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,#4CAF50_0%,#43A047_100%)]" />

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -z-10 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -z-10 h-64 w-64 translate-y-1/2 -translate-x-1/2 rounded-full bg-shop-tan/20 blur-3xl" />

          {/* Floating Toy-like Icons (Pure CSS) */}
          <div className="absolute left-10 top-10 h-12 w-12 animate-bounce rounded-xl bg-white/10 backdrop-blur-sm" />
          <div className="absolute right-20 bottom-10 h-16 w-16 animate-pulse rounded-full bg-shop-tan/20 backdrop-blur-sm" />

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Sẵn sàng mang <br className="sm:hidden" />
              <span className="text-shop-tan">niềm vui</span> về cho bé?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Hãy khám phá bộ sưu tập đồ chơi mới nhất của KidoZone và cùng bé yêu xây dựng những kỷ niệm tuyệt vời ngay hôm nay.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
              <Link
                to="/products"
                className="group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-2xl bg-white px-8 font-bold text-kid-green transition-all hover:bg-slate-50 sm:w-auto"
              >
                <span className="relative z-10">Mua sắm ngay</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
              </Link>
              <Link
                to="/register"
                className="group flex h-14 items-center justify-center gap-2 px-6 text-sm font-bold text-white transition-all hover:opacity-80"
              >
                Tạo tài khoản
                <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="absolute bottom-0 left-0 h-2 w-full bg-gradient-to-r from-transparent via-shop-tan/40 to-transparent" />
        </div>
      </div>
    </section>
  )
}