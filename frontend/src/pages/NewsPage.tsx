import { SectionHeading } from '~/components/home/SectionHeading'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { newsPosts } from '~/data/contentPosts'

export function NewsPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-kid-mint-soft via-shop-blue to-shop-blue/70 font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <SectionHeading
          theme='shop'
          eyebrow='Tin tức'
          align='left'
          title='Cập nhật mới nhất từ Kidozone'
          description='Các thông báo nổi bật về sản phẩm, chương trình ưu đãi và dịch vụ mới.'
        />

        {newsPosts.length === 0 ? (
          <p className='mt-8 rounded-xl border border-shop-ink/10 bg-white px-4 py-8 text-center text-sm text-shop-ink/65'>
            Hiện chưa có tin tức mới.
          </p>
        ) : (
          <div className='mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
            {newsPosts.map((post) => (
              <article key={post.id} className='rounded-2xl border border-shop-ink/10 bg-white p-5 shadow-shop-soft'>
                <img src={post.image} alt='' className='h-36 w-full rounded-xl object-contain bg-shop-blue/40 p-3' />
                <p className='mt-4 text-xs font-semibold uppercase tracking-wider text-shop-ink/60'>{post.publishedAt}</p>
                <h3 className='mt-2 text-lg font-bold text-shop-ink'>{post.title}</h3>
                <p className='mt-2 text-sm leading-relaxed text-shop-ink/70'>{post.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
