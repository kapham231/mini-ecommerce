const features = [
  { title: 'Responsive UI', desc: 'Hiển thị hoàn hảo trên điện thoại, máy tính bảng và máy tính.' },
  { title: 'Quản lý giỏ hàng', desc: 'Trải nghiệm thêm, xóa, cập nhật giỏ hàng mượt mà.' },
  { title: 'Tìm kiếm & Lọc', desc: 'Dễ dàng tìm thấy món đồ chơi yêu thích theo danh mục.' },
  { title: 'Xác thực người dùng', desc: 'Đăng ký, đăng nhập bảo mật với JWT.' },
]

export function WhySection() {
  return (
    <section className="bg-kid-ink text-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tại sao chọn <span className="text-kid-green">KidoZone</span>?
            </h2>
            <p className="mt-6 text-lg text-white/70">
              Chúng tôi tập trung vào việc xây dựng một sản phẩm chất lượng cao,
              không chỉ đẹp về mặt giao diện mà còn mạnh mẽ về mặt tính năng.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {features.map((f) => (
                <div key={f.title}>
                  <h4 className="text-lg font-bold text-kid-green">{f.title}</h4>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-kid-green to-shop-tan opacity-30 blur-2xl" />
              <div className="relative rounded-3xl bg-white/5 p-2 ring-1 ring-white/10">
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1000&auto=format&fit=crop"
                  alt="Feature showcase"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
