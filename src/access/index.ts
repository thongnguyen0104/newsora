import type { Access, PayloadRequest } from 'payload'

export type Role = 'admin' | 'editor' | 'author'

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean =>
  Boolean(req.user && roles.includes((req.user as { role?: Role }).role as Role))

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const isAdmin: Access = ({ req }) => hasRole(req, 'admin')

export const isAdminOrEditor: Access = ({ req }) => hasRole(req, 'admin', 'editor')

/** Người đọc chỉ thấy bài đã xuất bản; người đăng nhập thấy cả bản nháp. */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
