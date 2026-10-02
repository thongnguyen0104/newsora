import type { Metadata } from 'next'

import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { findPosts } from '@/lib/payload'

const PAGE_SIZE = 12

export const metadata: Metadata = { title: 'Tìm kiếm', robots: { index: false } }

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page: pageParam } = await searchParams
  const query = q.trim()
  const page = Math.max(1, Number(pageParam) || 1)

  const posts = query
    ? await findPosts({
        where: { or: [{ title: { like: query } }, { sapo: { like: query } }] },
        limit: PAGE_SIZE,
        page,
      })
    : null

  return (
    <div className="max-w-3xl">
      <form action="/tim-kiem" className="mb-6 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Nhập từ khóa..."
          className="flex-1 rounded-sm border border-line px-3 py-2 outline-none focus:border-brand-500"
        />
        <button type="submit" className="rounded-sm bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700">
          Tìm
        </button>
      </form>

      {posts && (
        <>
          <p className="mb-2 text-sm text-muted">
            Tìm thấy {posts.totalDocs} kết quả cho &ldquo;{query}&rdquo;
          </p>
          {posts.docs.map((post) => (
            <PostCard key={post.id} post={post} variant="horizontal" />
          ))}
          <Pagination
            page={page}
            totalPages={posts.totalPages}
            hrefFor={(p) => `/tim-kiem?q=${encodeURIComponent(query)}${p > 1 ? `&page=${p}` : ''}`}
          />
        </>
      )}
    </div>
  )
}
