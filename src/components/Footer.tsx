import Link from 'next/link'

import { getNavCategories, getSiteSettings } from '@/lib/payload'

export async function Footer() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getNavCategories()])
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t-4 border-brand-600 bg-neutral-50">
      <div className="container-news grid gap-8 py-10 md:grid-cols-3">
        <div className="space-y-2">
          <p className="font-serif text-2xl font-black text-brand-600">{settings.siteName}</p>
          {settings.footer?.about && (
            <p className="whitespace-pre-line text-sm text-muted">{settings.footer.about}</p>
          )}
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase">Chuyên mục</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link href={`/${category.slug}`} className="hover:text-brand-600">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {settings.footer?.contact && (
          <div>
            <p className="mb-3 text-sm font-bold uppercase">Liên hệ</p>
            <p className="whitespace-pre-line text-sm text-muted">{settings.footer.contact}</p>
          </div>
        )}
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        {settings.footer?.copyright || `© ${year} ${settings.siteName}. Bảo lưu mọi quyền.`}
      </div>
    </footer>
  )
}
