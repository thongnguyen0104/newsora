import Link from 'next/link'

type Props = {
  page: number
  totalPages: number
  /** Tạo URL cho một số trang */
  hrefFor: (page: number) => string
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2,
  )

  const base = 'min-w-9 rounded-sm border px-3 py-1.5 text-center text-sm'

  return (
    <nav aria-label="Phân trang" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link href={hrefFor(page - 1)} className={`${base} border-line hover:border-brand-500`}>
          ‹ Trước
        </Link>
      )}
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-muted">…</span>}
          <Link
            href={hrefFor(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${base} ${p === page ? 'border-brand-600 bg-brand-600 text-white' : 'border-line hover:border-brand-500'}`}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < totalPages && (
        <Link href={hrefFor(page + 1)} className={`${base} border-line hover:border-brand-500`}>
          Sau ›
        </Link>
      )}
    </nav>
  )
}
