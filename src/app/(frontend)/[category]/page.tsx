import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { categoryWhere, findPosts, getCategoryBySlug, getChildCategories } from '@/lib/payload'

const PAGE_SIZE = 12

type Props = {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: `/${category.slug}` },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [children, posts] = await Promise.all([
    getChildCategories(category.id),
    findPosts({ where: await categoryWhere(category), limit: PAGE_SIZE, page }),
  ])

  const parent = typeof category.parent === 'object' ? category.parent : null
  const [lead, ...rest] = posts.docs

  return (
    <div>
      <div className="mb-6 border-b-2 border-brand-600 pb-3">
        {parent && (
          <Link href={`/${parent.slug}`} className="text-sm text-muted hover:text-brand-600">
            {parent.name} ›
          </Link>
        )}
        <h1 className="font-serif text-3xl font-black text-brand-600">{category.name}</h1>
        {children.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium">
            {children.map((child) => (
              <li key={child.id}>
                <Link href={`/${child.slug}`} className="hover:text-brand-600">
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!lead ? (
        <p className="py-16 text-center text-muted">Chuyên mục chưa có bài viết.</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {page === 1 && <PostCard post={lead} variant="hero" priority />}
            <div className={page === 1 ? 'mt-4' : ''}>
              {(page === 1 ? rest : posts.docs).map((post) => (
                <PostCard key={post.id} post={post} variant="horizontal" />
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={posts.totalPages}
              hrefFor={(p) => (p === 1 ? `/${category.slug}` : `/${category.slug}?page=${p}`)}
            />
          </div>
          <aside className="hidden lg:block">
            {category.description && (
              <p className="rounded-sm bg-brand-50 p-4 text-sm text-muted">{category.description}</p>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
