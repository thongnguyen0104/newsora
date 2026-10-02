import Link from 'next/link'

import type { Post } from '@/payload-types'
import { asCategory, asMedia, formatDateTime, postUrl } from '@/lib/format'
import { CoverImage } from './CoverImage'

type Variant = 'hero' | 'default' | 'horizontal' | 'compact'

type Props = {
  post: Post
  variant?: Variant
  showCategory?: boolean
  priority?: boolean
}

export function PostCard({ post, variant = 'default', showCategory = true, priority }: Props) {
  const href = postUrl(post)
  const category = asCategory(post.category)
  const cover = asMedia(post.coverImage)

  const categoryLabel = showCategory && category && (
    <Link
      href={`/${category.slug}`}
      className="text-xs font-semibold uppercase tracking-wide text-brand-600 hover:underline"
    >
      {category.name}
    </Link>
  )

  if (variant === 'hero') {
    return (
      <article className="group">
        <Link href={href}>
          <CoverImage media={cover} size="hero" sizes="(min-width: 1024px) 800px, 100vw" priority={priority} />
        </Link>
        <div className="mt-3 space-y-2">
          {categoryLabel}
          <h2 className="font-serif text-2xl font-bold leading-snug md:text-3xl">
            <Link href={href} className="hover:text-brand-600">
              {post.title}
            </Link>
          </h2>
          {post.sapo && <p className="text-muted line-clamp-3">{post.sapo}</p>}
        </div>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className="group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 border-b border-line py-4 last:border-0">
        <Link href={href}>
          <CoverImage media={cover} size="card" sizes="(min-width: 768px) 280px, 40vw" />
        </Link>
        <div className="space-y-1.5">
          {categoryLabel}
          <h3 className="font-serif text-lg font-bold leading-snug">
            <Link href={href} className="hover:text-brand-600">
              {post.title}
            </Link>
          </h3>
          {post.sapo && <p className="hidden text-sm text-muted line-clamp-2 sm:block">{post.sapo}</p>}
          <time className="block text-xs text-muted">{formatDateTime(post.publishedAt)}</time>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="border-b border-line py-3 last:border-0">
        <h3 className="font-serif text-base font-semibold leading-snug">
          <Link href={href} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
      </article>
    )
  }

  return (
    <article className="group space-y-2">
      <Link href={href}>
        <CoverImage media={cover} size="card" sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw" />
      </Link>
      {categoryLabel}
      <h3 className="font-serif text-lg font-bold leading-snug">
        <Link href={href} className="hover:text-brand-600">
          {post.title}
        </Link>
      </h3>
    </article>
  )
}
