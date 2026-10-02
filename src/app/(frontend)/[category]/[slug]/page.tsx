import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { CoverImage } from '@/components/CoverImage'
import { PostCard } from '@/components/PostCard'
import { SectionTitle } from '@/components/SectionTitle'
import { asCategory, asMedia, asUser, formatDateTime, mediaUrl, postUrl } from '@/lib/format'
import { findPosts, getPostBySlug } from '@/lib/payload'
import type { Tag } from '@/payload-types'

export const revalidate = 60

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  const title = post.meta?.title || post.title
  const description = post.meta?.description || post.sapo || undefined
  const image = mediaUrl(asMedia(post.meta?.image) ?? asMedia(post.coverImage), 'hero')

  return {
    title,
    description,
    alternates: { canonical: postUrl(post) },
    openGraph: {
      type: 'article',
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { category: categorySlug, slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const category = asCategory(post.category)
  // Đường dẫn sai chuyên mục -> chuyển về URL chuẩn
  if (category && category.slug !== categorySlug) permanentRedirect(postUrl(post))

  const cover = asMedia(post.coverImage)
  const author = asUser(post.author)
  const tags = (post.tags ?? []).filter((t): t is Tag => typeof t === 'object')

  const related = category
    ? (
        await findPosts({
          where: { and: [{ category: { equals: category.id } }, { id: { not_equals: post.id } }] },
          limit: 4,
        })
      ).docs
    : []

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <article className="lg:col-span-2">
        {category && (
          <Link
            href={`/${category.slug}`}
            className="text-sm font-semibold uppercase tracking-wide text-brand-600 hover:underline"
          >
            {category.name}
          </Link>
        )}
        <h1 className="mt-2 font-serif text-3xl font-black leading-tight md:text-4xl">{post.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-4 text-sm text-muted">
          {author && <span className="font-semibold text-ink">{author.name}</span>}
          <time dateTime={post.publishedAt ?? undefined}>{formatDateTime(post.publishedAt)}</time>
        </div>

        {post.sapo && <p className="mt-5 font-semibold leading-relaxed">{post.sapo}</p>}

        {cover && (
          <figure className="mt-6">
            <CoverImage media={cover} size="hero" sizes="(min-width: 1024px) 800px, 100vw" priority />
            {cover.caption && (
              <figcaption className="mt-2 text-center text-sm italic text-muted">{cover.caption}</figcaption>
            )}
          </figure>
        )}

        <RichText
          data={post.content}
          className="prose prose-lg mt-6 max-w-none font-serif prose-headings:font-sans prose-a:text-brand-600"
        />

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="text-sm font-semibold">Thẻ:</span>
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tag/${tag.slug}`}
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm hover:bg-brand-50 hover:text-brand-600"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <aside>
          <SectionTitle title="Tin liên quan" />
          {related.map((p) => (
            <PostCard key={p.id} post={p} variant="horizontal" showCategory={false} />
          ))}
        </aside>
      )}
    </div>
  )
}
