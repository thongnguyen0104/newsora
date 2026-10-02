import Image from 'next/image'
import Link from 'next/link'

import { asMedia, formatToday, mediaUrl } from '@/lib/format'
import { getNavCategories, getSiteSettings } from '@/lib/payload'

export async function Header() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getNavCategories()])
  const logo = mediaUrl(asMedia(settings.logo))

  return (
    <header className="border-b border-line">
      <div className="container-news flex items-center justify-between gap-4 py-2 text-xs text-muted">
        <span className="capitalize">{formatToday()}</span>
        <form action="/tim-kiem" className="flex items-center">
          <input
            type="search"
            name="q"
            placeholder="Tìm kiếm..."
            aria-label="Tìm kiếm"
            className="w-36 rounded-sm border border-line px-2 py-1 text-sm text-ink outline-none focus:border-brand-500 sm:w-56"
          />
        </form>
      </div>

      <div className="container-news flex items-end justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          {logo ? (
            <Image src={logo} alt={settings.siteName} width={180} height={48} className="h-12 w-auto" priority />
          ) : (
            <span className="font-serif text-4xl font-black tracking-tight text-brand-600">
              {settings.siteName}
            </span>
          )}
        </Link>
        {settings.tagline && <p className="hidden text-sm italic text-muted md:block">{settings.tagline}</p>}
      </div>

      <nav className="bg-brand-600 text-white">
        <ul className="container-news no-scrollbar flex gap-1 overflow-x-auto">
          <li>
            <Link href="/" className="block px-3 py-2.5 text-sm font-semibold hover:bg-brand-700">
              Trang chủ
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${category.slug}`}
                className="block whitespace-nowrap px-3 py-2.5 text-sm font-semibold hover:bg-brand-700"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
