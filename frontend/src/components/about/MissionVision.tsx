export function MissionVision() {
  return (
    <section className="bg-kid-mint-soft/30 py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-8 shadow-shop-soft sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kid-green text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-kid-ink">Sứ mệnh</h3>
            <p className="mt-4 text-base leading-7 text-kid-ink/70">
              Biến việc mua sắm đồ chơi trở nên đơn giản, thú vị và đầy cảm hứng cho mọi gia đình. 
              Chúng tôi tin rằng mỗi món đồ chơi đều mang lại một cơ hội học hỏi và khám phá mới cho trẻ.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-shop-soft sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-shop-tan text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="mt-6 text-xl font-bold text-kid-ink">Tầm nhìn</h3>
            <p className="mt-4 text-base leading-7 text-kid-ink/70">
              Trở thành một nền tảng thương mại điện tử đồ chơi hàng đầu, nơi công nghệ hiện đại 
              gặp gỡ niềm vui trẻ thơ, tạo nên một cộng đồng mua sắm văn minh và sáng tạo.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
