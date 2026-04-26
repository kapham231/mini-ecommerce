import { SectionHeading } from '~/components/home/SectionHeading'
import { SiteFooter } from '~/components/layout/SiteFooter'
import { SiteHeader } from '~/components/layout/SiteHeader'
import { articlePosts } from '~/data/contentPosts'

export function BlogArticlesPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-kid-mint-soft via-shop-blue to-shop-blue/70 font-sans'>
      <SiteHeader />
      <main className='mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12'>
        <SectionHeading
          theme='shop'
          eyebrow='Bài viết'
          align='left'
          title='Góc chia sẻ dành cho phụ huynh'
          description='Mẹo chọn quà, cách bảo quản đồ chơi và kinh nghiệm đồng hành cùng bé mỗi ngày.'
        />

        {articlePosts.length === 0 ? (
          <p className='mt-8 rounded-xl border border-shop-ink/10 bg-white px-4 py-8 text-center text-sm text-shop-ink/65'>
            Hiện chưa có bài viết để hiển thị.
          </p>
        ) : (
          <div className='mt-8 space-y-4'>
            {articlePosts.map((post) => (
              <article
                key={post.id}
                className='grid gap-4 rounded-2xl border border-shop-ink/10 bg-white p-4 shadow-shop-soft sm:grid-cols-[180px_1fr] sm:items-center sm:p-5'
              >
                <img src={post.image} alt='' className='h-32 w-full rounded-xl object-contain bg-shop-blue/40 p-3 sm:h-28' />
                <div>
                  <p className='text-xs font-semibold uppercase tracking-wider text-shop-ink/60'>{post.publishedAt}</p>
                  <h3 className='mt-1 text-lg font-bold text-shop-ink'>{post.title}</h3>
                  <p className='mt-2 text-sm leading-relaxed text-shop-ink/70'>{post.content}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
