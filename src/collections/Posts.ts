import { APIError, type CollectionConfig } from 'payload'

import { authenticated, hasRole, isAdminOrEditor, publishedOrAuthenticated } from '../access'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Bài viết', plural: 'Bài viết' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'author', '_status', 'publishedAt'],
    group: 'Nội dung',
    listSearchableFields: ['title', 'sapo'],
  },
  defaultSort: '-publishedAt',
  versions: {
    drafts: {
      autosave: { interval: 1000 },
    },
    maxPerDoc: 30,
  },
  access: {
    read: publishedOrAuthenticated,
    create: authenticated,
    update: ({ req }) => {
      if (!req.user) return false
      if (hasRole(req, 'admin', 'editor')) return true
      // Phóng viên chỉ sửa bài của mình
      return { author: { equals: req.user.id } }
    },
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        if (data._status === 'published') {
          if (req.user && hasRole(req, 'author')) {
            throw new APIError('Phóng viên không có quyền xuất bản. Hãy lưu nháp để biên tập viên duyệt.', 403)
          }
          if (!data.publishedAt) data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    {
      name: 'sapo',
      label: 'Sapo (tóm tắt)',
      type: 'textarea',
      admin: { description: 'Đoạn dẫn in đậm hiển thị dưới tiêu đề và trên trang danh sách.' },
    },
    {
      name: 'coverImage',
      label: 'Ảnh đại diện',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'richText',
      required: true,
    },
    {
      type: 'collapsible',
      label: 'SEO',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'meta',
          type: 'group',
          label: false,
          fields: [
            { name: 'title', label: 'Tiêu đề SEO', type: 'text' },
            { name: 'description', label: 'Mô tả SEO', type: 'textarea' },
            { name: 'image', label: 'Ảnh chia sẻ', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
    // Sidebar
    slugField('title'),
    {
      name: 'category',
      label: 'Chuyên mục',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      label: 'Thẻ',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      label: 'Tác giả',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      defaultValue: ({ user }) => user?.id,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Thời gian xuất bản',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime', displayFormat: 'dd/MM/yyyy HH:mm' },
      },
    },
    {
      name: 'isFeatured',
      label: 'Tin nổi bật trang chủ',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar' },
    },
  ],
}
