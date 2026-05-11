import { SectionHeading } from '../home/SectionHeading'

const values = [
  {
    title: 'Đơn giản',
    description: 'Giao diện thân thiện, quy trình mua sắm tối giản giúp ba mẹ tiết kiệm thời gian.',
    icon: '✨',
    color: 'bg-blue-50',
  },
  {
    title: 'An toàn',
    description: 'Cam kết bảo mật thông tin người dùng và đảm bảo chất lượng sản phẩm tốt nhất.',
    icon: '🛡️',
    color: 'bg-green-50',
  },
  {
    title: 'Hiệu năng',
    description: 'Tốc độ tải trang nhanh, trải nghiệm mượt mà trên mọi thiết bị di động.',
    icon: '⚡',
    color: 'bg-orange-50',
  },
  {
    title: 'Niềm vui',
    description: 'Mục tiêu cuối cùng là nụ cười của trẻ nhỏ khi nhận được những món quà ý nghĩa.',
    icon: '🎈',
    color: 'bg-pink-50',
  },
]

export function ValuesGrid() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Giá trị cốt lõi"
          description="Những nguyên tắc định hướng cho sự phát triển của KidoZone."
        />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.title}
              className={`rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-shop-soft ${value.color}`}
            >
              <div className="text-4xl">{value.icon}</div>
              <h4 className="mt-4 text-lg font-bold text-kid-ink">{value.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-kid-ink/70">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
