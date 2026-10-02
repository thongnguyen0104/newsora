import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-serif text-6xl font-black text-brand-600">404</p>
      <p className="mt-4 text-lg">Không tìm thấy trang bạn yêu cầu.</p>
      <Link href="/" className="mt-6 inline-block text-brand-600 underline">
        Về trang chủ
      </Link>
    </div>
  )
}
