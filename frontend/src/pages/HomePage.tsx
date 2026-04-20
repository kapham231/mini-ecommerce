import { Link } from 'react-router-dom'
import { ProductCard } from '~/components/products/ProductCard'
import { CustomerTestimonials } from '~/components/home/CustomerTestimonials'
import { HeroSection } from '~/components/home/HeroSection'
import { NewsletterBar } from '~/components/home/NewsletterBar'
import { SectionHeading } from '~/components/home/SectionHeading'
import { SpotlightCard } from '~/components/home/SpotlightCard'
import { ToyCategoryCard } from '~/components/home/ToyCategoryCard'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import {
  catalogProducts,
  homeArticles,
  spotlightShowcase,
  testimonials,
  toyCategories,
} from '~/data/homeShowcase'
import { catalogProductToProductSummary } from '~/lib/catalogProductToSummary'

export function HomePage() {
  const { featured, secondary } = homeArticles

  return (
    <div className='min-h-screen bg-shop-blue'>
      <SiteHeader />

      <HeroSection />

      <main>
        <div className='mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16'>
          <section id='featured' className='scroll-mt-32'>
            <SectionHeading
              theme='shop'
              eyebrow='Khám phá'
              title='Khám phá và tìm món yêu thích'
              description='Ba gợi ý nổi bật để bạn bắt đầu — chạm vào từng thẻ để xem thêm sản phẩm liên quan.'
              tone='mint'
            />
            <div className='mt-10 grid gap-6 md:grid-cols-3'>
              {spotlightShowcase.map((item) => (
                <SpotlightCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  imageSrc={item.imageSrc}
                  href={item.href}
                />
              ))}
            </div>
          </section>

          <section id='categories' className='mt-16 scroll-mt-32 sm:mt-20'>
            <SectionHeading
              theme='shop'
              eyebrow='Danh mục'
              title='Mua theo nhóm đồ chơi'
              description='Chọn nhanh theo sở thích — mỗi nhóm đều được kiểm duyệt an toàn cho trẻ nhỏ.'
              tone='pink'
            />
            <div className='mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4'>
              {toyCategories.map((cat, i) => (
                <ToyCategoryCard
                  key={cat.id}
                  title={cat.title}
                  imageSrc={cat.imageSrc}
                  description={cat.description}
                  variant={i % 2 === 0 ? 'mint' : 'pink'}
                />
              ))}
            </div>
          </section>

          <section id='products' className='mt-16 scroll-mt-32 sm:mt-20'>
            <SectionHeading
              theme='shop'
              eyebrow='Bán chạy'
              title='Thú bông được săn đón'
              description='Hình ảnh thật, đánh giá từ khách hàng đã mua — thêm giỏ chỉ với một chạm.'
              tone='mint'
            />
            <div className='mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
              {catalogProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={catalogProductToProductSummary(p)}
                  linkTo='/products'
                />
              ))}
            </div>
            <div className='mt-10 flex justify-center'>
              <Link
                to='/products'
                className='inline-flex min-h-11 items-center justify-center rounded-2xl bg-kid-green px-10 text-sm font-bold text-white shadow-md transition hover:brightness-95'
              >
                Xem thêm
              </Link>
            </div>
          </section>

          <section id='news' className='mt-16 scroll-mt-32 sm:mt-20'>
            <SectionHeading
              theme='shop'
              eyebrow='Blog & ưu đãi'
              title='Thêm chút đặc biệt cho món quà'
              description='Gợi ý quà tặng, ưu đãi theo tuần và dịch vụ cá nhân hóa — cập nhật thường xuyên.'
              tone='pink'
            />
            <div className='mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8'>
              <a
                href={featured.href}
                className='group flex flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-shop-soft transition hover:shadow-lg lg:min-h-[420px]'
              >
                <div className='relative min-h-[220px] flex-1 lg:min-h-[260px]'>
                  <img
                    src={featured.imageSrc}
                    alt=''
                    aria-hidden
                    className='h-full w-full object-contain p-6 transition duration-300 group-hover:scale-[1.02]'
                    loading='lazy'
                  />
                </div>
                <div className='flex flex-col px-6 pb-7 pt-5'>
                  <h3 className='font-sans text-2xl font-semibold leading-snug text-shop-ink'>
                    {featured.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-shop-ink/70'>{featured.excerpt}</p>
                  <span className='mt-4 inline-flex text-sm font-semibold text-shop-teal underline-offset-4 group-hover:underline'>
                    {featured.ctaLabel}
                  </span>
                </div>
              </a>

              <div className='flex flex-col gap-6'>
                {secondary.map((article) => (
                  <a
                    key={article.id}
                    href={article.href}
                    className='group flex gap-4 overflow-hidden rounded-[1.25rem] bg-white p-4 shadow-shop-soft transition hover:shadow-lg sm:gap-5 sm:p-5'
                  >
                    <div className='relative h-28 w-32 shrink-0 overflow-hidden rounded-xl sm:h-32 sm:w-36'>
                      <img
                        src={article.imageSrc}
                        alt=''
                        aria-hidden
                        className='h-full w-full p-2 transition group-hover:scale-[1.03]'
                        loading='lazy'
                      />
                    </div>
                    <div className='flex min-w-0 flex-1 flex-col justify-center'>
                      <h3 className='font-sans text-lg font-semibold leading-snug text-shop-ink'>
                        {article.title}
                      </h3>
                      <p className='mt-1 line-clamp-2 text-sm text-shop-ink/65'>{article.excerpt}</p>
                      <span className='mt-2 text-sm font-semibold text-shop-teal underline-offset-4 group-hover:underline'>
                        {article.ctaLabel}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section
          id='testimonials'
          className='scroll-mt-32 border-y border-shop-ink/8 bg-shop-blue py-14 sm:py-16'
          aria-labelledby='testimonials-heading'
        >
          <div className='mx-auto max-w-6xl px-4 sm:px-6'>
            <SectionHeading
              theme='shop'
              titleId='testimonials-heading'
              eyebrow='Phản hồi'
              title='Khách hàng nói gì về chúng tôi'
              description='Trích ý kiến thật từ đơn hàng gần đây — mình luôn lắng nghe để phục vụ tốt hơn.'
              tone='mint'
            />
            <div className='mt-10'>
              <CustomerTestimonials items={testimonials} />
            </div>
          </div>
        </section>

        <NewsletterBar />
      </main>

      <SiteFooter />
    </div>
  )
}
