import type { CollectionConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Chuyên mục', plural: 'Chuyên mục' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'order'],
    group: 'Nội dung',
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      label: 'Tên chuyên mục',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'parent',
      label: 'Chuyên mục cha',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'order',
      label: 'Thứ tự hiển thị',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      label: 'Mô tả',
      type: 'textarea',
    },
  ],
}
