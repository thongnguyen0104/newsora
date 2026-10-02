import Link from 'next/link'

import { PostCard } from '@/components/PostCard'
import { SectionTitle } from '@/components/SectionTitle'
import type { Category } from '@/payload-types'
import { categoryWhere, findPosts, getNavCategories, getSiteSettings } from '@/lib/payload'

export const revalidate = 60

export default async function HomePage() {
  const [featured, latest, settings] = await Promise.all([
    findPosts({ where: { isFeatured: { equals: true } }, limit: 5 }),
    findPosts({ limit: 13 }),
    getSiteSettings(),
  ])

  const configuredSections = (settings.homeSections ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  const sectionCategories = configuredSections.length ? configuredSections : await getNavCategories()

  const sections = await Promise.all(
    sectionCategories.map(async (category) => ({
      category,
      posts: (await findPosts({ where: await categoryWhere(category), limit: 5 })).docs,
    })),
  )

  // Tin nổi bật: ưu tiên bài được đánh dấu, thiếu thì lấy bài mới nhất
  const topPosts = featured.docs.length ? featured.docs : latest.docs.slice(0, 5)
  const [hero, ...sideTop] = topPosts
  const topIds = new Set(topPosts.map((p) => p.id))
  const latestPosts = latest.docs.filter((p) => !topIds.has(p.id)).slice(0, 8)

  if (!hero) {
    return (
      <div className="py-20 text-center text-muted">
        <p className="text-lg">Chưa có bài viết nào được xuất bản.</p>
        <p className="mt-2 text-sm">
          Vào <Link href="/admin" className="text-brand-600 underline">trang quản trị</Link> để đăng bài, hoặc chạy{' '}
          <code>npm run seed</code> để tạo dữ liệu mẫu.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostCard post={hero} variant="hero" priority />
        </div>
        <div className="divide-y divide-line">
          {sideTop.map((post) => (
            <PostCard key={post.id} post={post} variant="horizontal" />
          ))}
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section>
          <SectionTitle title="Tin mới" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {sections
        .filter((s) => s.posts.length > 0)
        .map(({ category, posts: [lead, ...rest] }) => (
          <section key={category.id}>
            <SectionTitle title={category.name} href={`/${category.slug}`} />
            <div className="grid gap-6 md:grid-cols-2">
              <PostCard post={lead} variant="hero" showCategory={false} />
              <div>
                {rest.map((post) => (
                  <PostCard key={post.id} post={post} variant="horizontal" showCategory={false} />
                ))}
              </div>
            </div>
          </section>
        ))}
    </div>
  )
}
