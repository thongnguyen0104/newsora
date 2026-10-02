import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Chuyển mọi chuỗi về Unicode dựng sẵn (NFC).
 * Văn bản dán từ một số nguồn (macOS, Word, trình duyệt) có thể ở dạng tổ hợp (NFD):
 * dấu tiếng Việt là ký tự riêng nên bị hiển thị tách rời ("chuyê ́n") và tìm kiếm không khớp.
 */
const toNFC = (value: unknown): unknown => {
  if (typeof value === 'string') return value.normalize('NFC')
  if (Array.isArray(value)) return value.map(toNFC)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toNFC(v)]))
  }
  return value
}

export const normalizeUnicode: CollectionBeforeChangeHook = ({ data }) => toNFC(data) as typeof data
