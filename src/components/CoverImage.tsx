import Image from 'next/image'

import type { Media } from '@/payload-types'
import { mediaUrl } from '@/lib/format'

type Props = {
  media: Media | null
  size?: 'thumbnail' | 'card' | 'hero'
  sizes?: string
  priority?: boolean
  className?: string
}

/** Ảnh tỉ lệ 16:9, có khung xám khi bài chưa có ảnh. */
export function CoverImage({ media, size = 'card', sizes = '100vw', priority, className = '' }: Props) {
  const src = mediaUrl(media, size)

  return (
    <div className={`relative aspect-video overflow-hidden bg-neutral-200 ${className}`}>
      {src && (
        <Image
          src={src}
          alt={media?.alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      )}
    </div>
  )
}
