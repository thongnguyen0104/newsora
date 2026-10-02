import type { GlobalConfig } from 'payload'

import { anyone, isAdminOrEditor } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình trang',
  admin: { group: 'Hệ thống' },
  access: {
    read: anyone,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    { name: 'siteName', label: 'Tên báo', type: 'text', defaultValue: 'Newsora', required: true },
    { name: 'tagline', label: 'Khẩu hiệu', type: 'text', defaultValue: 'Tin tức nhanh, chính xác' },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navCategories',
      label: 'Chuyên mục trên menu',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Để trống để hiển thị tất cả chuyên mục cấp 1 theo thứ tự.' },
    },
    {
      name: 'homeSections',
      label: 'Chuyên mục hiển thị ở trang chủ',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'Để trống để dùng các chuyên mục trên menu.' },
    },
    {
      name: 'footer',
      label: 'Chân trang',
      type: 'group',
      fields: [
        { name: 'about', label: 'Giới thiệu', type: 'textarea' },
        { name: 'contact', label: 'Liên hệ', type: 'textarea' },
        { name: 'copyright', label: 'Bản quyền', type: 'text' },
      ],
    },
  ],
}
