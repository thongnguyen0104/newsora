import type { SerializedUploadNode } from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

import type { Media, Post } from '@/payload-types'
import { mediaUrl } from '@/lib/format'

/**
 * Ảnh chèn trong bài đi qua next/image (có cache) thay vì <img> trỏ thẳng vào bucket,
 * để mỗi lượt đọc không tạo thêm request tới Object Storage.
 */
const UploadImage = ({ node }: { node: SerializedUploadNode }) => {
  if (typeof node.value !== 'object') return null
  const media = node.value as unknown as Media
  if (!media.mimeType?.startsWith('image')) {
    return media.url ? <a href={media.url}>{media.filename}</a> : null
  }

  const src = mediaUrl(media, 'hero')
  const size = media.sizes?.hero?.url ? media.sizes.hero : media
  if (!src || !size.width || !size.height) return null
  const alt = (node.fields?.alt as string | undefined) || media.alt || ''

  return (
    <figure>
      <Image src={src} alt={alt} width={size.width} height={size.height} sizes="(min-width: 1024px) 800px, 100vw" />
      {media.caption && <figcaption className="text-center italic">{media.caption}</figcaption>}
    </figure>
  )
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: ({ node }) => <UploadImage node={node} />,
})

export function PostContent({ data, className }: { data: Post['content']; className?: string }) {
  return <RichText data={data} converters={converters} className={className} />
}
