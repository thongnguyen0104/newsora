import type { TextField } from 'payload'

import { slugify } from '../utilities/slugify'

/** Trường slug tự sinh từ một trường khác (mặc định `title`) nếu để trống. */
export const slugField = (sourceField = 'title'): TextField => ({
  name: 'slug',
  label: 'Slug (đường dẫn)',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Để trống để tự sinh từ tiêu đề.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const source = data?.[sourceField]
        if (typeof source === 'string' && source.trim()) return slugify(source)
        return value
      },
    ],
  },
})
