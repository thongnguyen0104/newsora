import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import type { Category, Post, SiteSetting } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

const published: Where = { _status: { equals: 'published' } }

type FindPostsArgs = {
  where?: Where
  limit?: number
  page?: number
}

/** Bài đã xuất bản, mới nhất trước. */
export async function findPosts({ where, limit = 10, page = 1 }: FindPostsArgs = {}) {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'posts',
    where: where ? { and: [published, where] } : published,
    sort: '-publishedAt',
    limit,
    page,
    depth: 1,
    overrideAccess: false,
  })
}

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const { docs } = await findPosts({ where: { slug: { equals: slug } }, limit: 1 })
  return docs[0] ?? null
})

export const getSiteSettings = cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getChildCategories = cache(async (parentId: number): Promise<Category[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { parent: { equals: parentId } },
    sort: 'order',
    limit: 50,
    depth: 0,
  })
  return docs
})

/** Chuyên mục trên menu: lấy từ cấu hình, nếu trống thì lấy tất cả chuyên mục cấp 1. */
export const getNavCategories = cache(async (): Promise<Category[]> => {
  const settings = await getSiteSettings()
  const configured = (settings.navCategories ?? []).filter(
    (c): c is Category => typeof c === 'object' && c !== null,
  )
  if (configured.length) return configured

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { parent: { exists: false } },
    sort: 'order',
    limit: 20,
    depth: 0,
  })
  return docs
})

/** Điều kiện lọc bài thuộc một chuyên mục, bao gồm các chuyên mục con. */
export async function categoryWhere(category: Category): Promise<Where> {
  const children = await getChildCategories(category.id)
  return { category: { in: [category.id, ...children.map((c) => c.id)] } }
}
