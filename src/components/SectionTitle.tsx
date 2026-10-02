import Link from 'next/link'

export function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between border-b-2 border-brand-600">
      <h2 className="-mb-0.5 border-b-2 border-brand-600 pb-1.5 text-lg font-bold uppercase text-brand-600">
        {href ? <Link href={href}>{title}</Link> : title}
      </h2>
      {href && (
        <Link href={href} className="text-sm text-muted hover:text-brand-600">
          Xem thêm ›
        </Link>
      )}
    </div>
  )
}
