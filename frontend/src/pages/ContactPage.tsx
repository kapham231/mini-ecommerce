import { SectionHeading } from '~/components/home/SectionHeading'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'

const contactItems = [
  { label: 'Hotline', value: '0333333333' },
  { label: 'Email', value: 'kidozone@gmail.com' },
  { label: 'Địa chỉ', value: 'Sài Gòn, Việt Nam' },
  { label: 'Giờ làm việc', value: '08:00 - 17:00 (Thứ 2 - Chủ nhật)' },
]

export function ContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-kid-mint-soft via-shop-blue to-shop-blue/70 font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <SectionHeading
          theme='shop'
          eyebrow='Liên hệ'
          align='left'
          title='Kidozone luôn sẵn sàng hỗ trợ'
          description='Nếu cần tư vấn chọn quà hoặc hỗ trợ đơn hàng, hãy liên hệ đội ngũ chăm sóc khách hàng.'
        />

        <div className='mt-8 grid gap-4 sm:grid-cols-2'>
          {contactItems.map((item) => (
            <div key={item.label} className='rounded-2xl border border-shop-ink/10 bg-white p-5 shadow-shop-soft'>
              <p className='text-xs font-semibold uppercase tracking-wider text-shop-ink/60'>{item.label}</p>
              <p className='mt-2 text-base font-semibold text-shop-ink'>{item.value}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
