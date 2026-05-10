import { SectionHeading } from '../home/SectionHeading'

export function StorySection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/4 opacity-20">
        <div className="h-96 w-96 rounded-full bg-kid-mint-soft blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/4 opacity-20">
        <div className="h-96 w-96 rounded-full bg-shop-tan/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] bg-white p-3 shadow-shop-soft ring-1 ring-shop-ink/5">
                <img
                  src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=1000&auto=format&fit=crop"
                  alt="Đồ chơi trẻ em"
                  className="h-full w-full rounded-[2rem] object-cover transition duration-700 hover:scale-105"
                />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-6 shadow-xl sm:block lg:-left-10">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-kid-green text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-kid-ink">Đội ngũ</p>
                    <p className="text-xs text-kid-ink/60">2 Thành viên</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              eyebrow="Câu chuyện của chúng tôi"
              title="Dự án thực tế từ niềm đam mê lập trình"
              description="KidoZone không chỉ là một trang web, đó là kết quả của quá trình nghiên cứu và áp dụng các công nghệ hiện đại nhất."
            />
            
            <div className="mt-8 space-y-6 text-base leading-7 text-kid-ink/70">
              <p>
                Chúng tôi bắt đầu dự án này với một mục tiêu duy nhất: Xây dựng một hệ thống <strong>Ecommerce hoàn chỉnh</strong> có thể vận hành ổn định trong thực tế. Mọi dòng code đều được chăm chút để tối ưu hóa trải nghiệm người dùng từ phía Frontend đến Backend.
              </p>

              <div className="rounded-3xl border-2 border-dashed border-kid-green/20 bg-kid-mint-soft/30 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-kid-green text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-kid-ink">Dự án Phi Thương Mại</h4>
                    <p className="mt-1 text-sm leading-relaxed">
                      Đây là sản phẩm phục vụ mục đích <strong>học tập và trưng bày kỹ năng (Portfolio)</strong>. Dự án hoàn toàn không có mục đích thương mại hay lợi nhuận, minh chứng cho sự phối hợp nhịp nhàng giữa Frontend và Backend.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-10 grid grid-cols-2 gap-4 border-t border-shop-ink/5 pt-8 sm:grid-cols-3">
                <div>
                  <p className="text-2xl font-extrabold text-kid-green">02</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-kid-ink/50">Developers</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-kid-green">100%</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-kid-ink/50">Fullstack</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-2xl font-extrabold text-kid-green">Modern</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-kid-ink/50">Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
