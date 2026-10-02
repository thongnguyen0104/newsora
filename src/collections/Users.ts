import type { CollectionConfig } from 'payload'

import { authenticated, hasRole, isAdmin } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Người dùng', plural: 'Người dùng' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Hệ thống',
  },
  auth: true,
  access: {
    read: authenticated,
    create: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false
      if (hasRole(req, 'admin')) return true
      return { id: { equals: req.user.id } }
    },
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        if (operation === 'create') {
          // Tài khoản đầu tiên luôn là quản trị viên
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        } else if (!hasRole(req, 'admin') && req.user) {
          // Chỉ quản trị viên được đổi vai trò
          data.role = originalDoc?.role
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: 'Họ tên',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Vai trò',
      type: 'select',
      required: true,
      defaultValue: 'author',
      saveToJWT: true,
      options: [
        { label: 'Quản trị viên', value: 'admin' },
        { label: 'Biên tập viên', value: 'editor' },
        { label: 'Phóng viên', value: 'author' },
      ],
    },
    {
      name: 'bio',
      label: 'Giới thiệu',
      type: 'textarea',
    },
  ],
}
