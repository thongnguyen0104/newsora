/**
 * Tạo dữ liệu mẫu: chuyên mục, thẻ, ảnh minh họa và bài viết.
 * Chạy: npm run seed  (an toàn khi chạy lại — bỏ qua dữ liệu đã tồn tại)
 */
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import config from '../payload.config'
import type { Post } from '../payload-types'
import { slugify } from '../utilities/slugify'
import { categories, posts, tags } from './data'

const context = { disableRevalidate: true }

function toLexical(paragraphs: string[]): Post['content'] {
  return {
    root: {
      type: 'root',
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => {
        const isHeading = text.startsWith('## ')
        const node = {
          type: 'text',
          text: isHeading ? text.slice(3) : text,
          format: 0,
          style: '',
          mode: 'normal',
          detail: 0,
          version: 1,
        }
        return isHeading
          ? { type: 'heading', tag: 'h2', children: [node], direction: 'ltr', format: '', indent: 0, version: 1 }
          : {
              type: 'paragraph',
              children: [node],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
              textFormat: 0,
              textStyle: '',
            }
      }),
    },
  } as Post['content']
}

const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Sinh ảnh minh họa 1600x900 có nền gradient và nhãn chuyên mục. */
async function makeImage(label: string, hue: number): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="hsl(${hue},55%,42%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360},60%,22%)"/>
    </linearGradient></defs>
    <rect width="1600" height="900" fill="url(#g)"/>
    <circle cx="1300" cy="200" r="260" fill="white" fill-opacity="0.08"/>
    <circle cx="250" cy="760" r="340" fill="white" fill-opacity="0.06"/>
    <text x="80" y="820" font-family="Arial, sans-serif" font-size="72" font-weight="700" fill="white" fill-opacity="0.9">${escapeXml(label)}</text>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer()
}

async function findOne(payload: Payload, collection: 'categories' | 'tags' | 'posts', slug: string) {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })
  return docs[0] ?? null
}

async function seed() {
  const payload = await getPayload({ config })
  payload.logger.info('Bắt đầu seed dữ liệu mẫu...')

  // Tác giả: dùng người dùng có sẵn, nếu chưa có thì tạo tài khoản demo
  let { docs: users } = await payload.find({ collection: 'users', limit: 1 })
  if (!users.length) {
    const user = await payload.create({
      collection: 'users',
      data: { email: 'admin@newsora.local', password: 'newsora123', name: 'Ban biên tập', role: 'admin' },
    })
    users = [user]
    payload.logger.info('Đã tạo tài khoản admin@newsora.local / newsora123 — hãy đổi mật khẩu!')
  }
  const authorId = users[0].id

  // Chuyên mục (cha trước, con sau)
  const categoryIds = new Map<string, number>()
  for (const cat of categories) {
    const existing = await findOne(payload, 'categories', cat.slug)
    const doc =
      existing ??
      (await payload.create({
        collection: 'categories',
        context,
        data: {
          name: cat.name,
          slug: cat.slug,
          order: cat.order,
          description: cat.description,
          parent: cat.parent ? categoryIds.get(cat.parent) : undefined,
        },
      }))
    categoryIds.set(cat.slug, doc.id)
  }

  // Thẻ
  const tagIds = new Map<string, number>()
  for (const name of tags) {
    const slug = slugify(name)
    const doc = (await findOne(payload, 'tags', slug)) ?? (await payload.create({ collection: 'tags', context, data: { name, slug } }))
    tagIds.set(name, doc.id)
  }

  // Bài viết
  let created = 0
  for (const [i, post] of posts.entries()) {
    if (await findOne(payload, 'posts', post.slug)) continue

    const categoryName = categories.find((c) => c.slug === post.category)?.name ?? ''
    const image = await makeImage(categoryName, (i * 47) % 360)
    const media = await payload.create({
      collection: 'media',
      context,
      data: { alt: post.title, caption: `Ảnh minh họa – ${categoryName}` },
      file: { data: image, mimetype: 'image/jpeg', name: `${post.slug}.jpg`, size: image.length },
    })

    await payload.create({
      collection: 'posts',
      context,
      draft: false,
      data: {
        title: post.title,
        slug: post.slug,
        sapo: post.sapo,
        content: toLexical(post.content),
        category: categoryIds.get(post.category)!,
        tags: post.tags.map((t) => tagIds.get(t)!).filter(Boolean),
        author: authorId,
        coverImage: media.id,
        isFeatured: post.featured ?? false,
        // Rải thời gian xuất bản lùi dần mỗi bài 3 giờ
        publishedAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toISOString(),
        _status: 'published',
      },
    })
    created++
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    context,
    data: {
      siteName: 'Newsora',
      tagline: 'Tin tức nhanh, chính xác, đa chiều',
      footer: {
        about: 'Newsora – báo điện tử cập nhật tin tức thời sự, kinh tế, giáo dục, thể thao, giải trí và công nghệ.',
        contact: 'Email: toasoan@newsora.local\nĐường dây nóng: 0900 000 000',
      },
    },
  })

  payload.logger.info(`Seed xong: ${categories.length} chuyên mục, ${tags.length} thẻ, ${created} bài viết mới.`)
  process.exit(0)
}

await seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
