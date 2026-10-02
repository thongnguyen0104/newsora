import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Pagination } from '@/components/Pagination'
import { PostCard } from '@/components/PostCard'
import { findPosts, getPayloadClient } from '@/lib/payload'

const PAGE_SIZE = 12

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

async function getTag(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({ collection: 'tags', where: { slug: { equals: slug } }, limit: 1 })
  return docs[0] ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = await getTag((await params).slug)
  return tag ? { title: `#${tag.name}` } : {}
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params
  const page = Math.max(1, Number((await searchParams).page) || 1)

  const tag = await getTag(slug)
  if (!tag) notFound()

  const posts = await findPosts({ where: { tags: { contains: tag.id } }, limit: PAGE_SIZE, page })

  return (
    <div className="max-w-3xl">
      <h1 className="mb-4 border-b-2 border-brand-600 pb-3 font-serif text-3xl font-black">#{tag.name}</h1>
      {posts.docs.length === 0 ? (
        <p className="py-16 text-center text-muted">Chưa có bài viết với thẻ này.</p>
      ) : (
        posts.docs.map((post) => <PostCard key={post.id} post={post} variant="horizontal" />)
      )}
      <Pagination
        page={page}
        totalPages={posts.totalPages}
        hrefFor={(p) => `/tag/${tag.slug}${p > 1 ? `?page=${p}` : ''}`}
      />
    </div>
  )
}
