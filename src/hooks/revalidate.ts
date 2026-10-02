import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Làm mới cache các trang người đọc khi nội dung thay đổi.
 * Bỏ qua khi chạy ngoài Next.js (ví dụ script seed) hoặc khi context.disableRevalidate = true.
 */
const revalidateSite = (context: Record<string, unknown>) => {
  if (context.disableRevalidate) return
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Không chạy trong Next.js runtime
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, context }) => {
  revalidateSite(context)
  return doc
}
