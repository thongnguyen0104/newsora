import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Ảnh / tệp', plural: 'Thư viện ảnh' },
  admin: {
    group: 'Nội dung',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      label: 'Mô tả ảnh (alt)',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      label: 'Chú thích',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 225, position: 'centre' },
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'hero', width: 1600 },
    ],
    adminThumbnail: 'thumbnail',
  },
}
