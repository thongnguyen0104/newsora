import type { Category, Media, Post, User } from '@/payload-types'

const TIME_ZONE = 'Asia/Ho_Chi_Minh'

export function formatDateTime(value?: string | null): string {
  if (!value) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

/** "Thứ năm, 02/10/2026" */
export function formatToday(): string {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: TIME_ZONE,
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date())
}

export function asCategory(value: Post['category'] | null | undefined): Category | null {
  return value && typeof value === 'object' ? value : null
}

export function asMedia(value: number | Media | null | undefined): Media | null {
  return value && typeof value === 'object' ? value : null
}

export function asUser(value: number | User | null | undefined): User | null {
  return value && typeof value === 'object' ? value : null
}

export function postUrl(post: Pick<Post, 'slug' | 'category'>): string {
  const category = asCategory(post.category)
  return `/${category?.slug ?? 'tin-tuc'}/${post.slug}`
}

export function mediaUrl(
  media: Media | null,
  size?: keyof NonNullable<Media['sizes']>,
): string | null {
  if (!media) return null
  const url = (size && media.sizes?.[size]?.url) || media.url
  if (!url) return null
  // Ảnh lưu nội bộ (/api/media/file/...) -> đường dẫn tương đối để next/image tối ưu như ảnh local
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
  return serverUrl && url.startsWith(serverUrl) ? url.slice(serverUrl.length) : url
}
