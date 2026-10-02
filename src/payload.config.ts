import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// URL công khai của bucket (bucket để Public). Nếu để trống, ảnh được phục vụ qua /api/media/file
const s3PublicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '')

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' – Newsora CMS',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  i18n: {
    supportedLanguages: { vi, en },
    fallbackLanguage: 'vi',
  },
  collections: [Posts, Categories, Tags, Media, Users],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Local: file:./newsora.db — Production (Vercel): libsql://<db>.turso.io + DATABASE_AUTH_TOKEN
  db: sqliteAdapter({
    // Chỉ tự đồng bộ schema với DB file local; DB trên cloud dùng migration (npm run ci)
    push: (process.env.DATABASE_URL || 'file:').startsWith('file:'),
    client: {
      url: process.env.DATABASE_URL || 'file:./newsora.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Lưu ảnh lên Oracle Cloud Object Storage (API tương thích S3). Không cấu hình thì lưu vào thư mục /media
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      // Luôn thêm cột `prefix` để schema giống nhau dù có bật S3 hay không (tránh lệch migration)
      alwaysInsertFields: true,
      collections: {
        media: {
          // Thư mục trong bucket, ví dụ "newsora" -> newsora/ten-anh.jpg
          prefix: process.env.S3_PREFIX || undefined,
          ...(s3PublicUrl && {
            disablePayloadAccessControl: true,
            generateFileURL: ({ filename, prefix }) =>
              [s3PublicUrl, prefix, filename].filter(Boolean).join('/'),
          }),
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        // Oracle chưa hỗ trợ checksum mặc định của AWS SDK v3 mới
        requestChecksumCalculation: 'WHEN_REQUIRED',
        responseChecksumValidation: 'WHEN_REQUIRED',
      },
    }),
  ],
})
