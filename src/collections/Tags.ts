import type { CollectionConfig } from 'payload'

import { anyone, authenticated, isAdminOrEditor } from '../access'
import { slugField } from '../fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Thẻ', plural: 'Thẻ' },
  admin: {
    useAsTitle: 'name',
    group: 'Nội dung',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      label: 'Tên thẻ',
      type: 'text',
      required: true,
    },
    slugField('name'),
  ],
}
