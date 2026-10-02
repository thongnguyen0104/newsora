# Newsora

Báo điện tử (kiểu Thanh Niên / Tuổi Trẻ) xây dựng trên **Next.js 16 + Payload CMS 3**.

- **Trang người đọc**: trang chủ (tin nổi bật, tin mới, khối chuyên mục), trang chuyên mục có phân trang, trang bài viết, trang thẻ, tìm kiếm.
- **Trang quản trị** `/admin` bằng tiếng Việt: soạn bài (rich text, bản nháp, tự lưu, lịch sử phiên bản), chuyên mục nhiều cấp, thẻ, thư viện ảnh, cấu hình trang.
- **Phân quyền**: Quản trị viên / Biên tập viên / Phóng viên. Phóng viên chỉ sửa bài của mình và không được xuất bản.
- **Database**: SQLite. Local dùng file, production dùng [Turso](https://turso.tech) (SQLite trên cloud).
- **Lưu ảnh**: Oracle Cloud Object Storage (API tương thích S3). Local lưu vào thư mục `media/`.

## Chạy local

Yêu cầu: Node.js ≥ 20.9.

### Cách nhanh nhất (PowerShell)

Một lệnh chạy cả trang báo, trang quản trị và API. Script tự cài dependencies, tạo `.env` và chuẩn bị database:

```powershell
powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1           # chế độ dev
powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1 -Seed     # kèm dữ liệu mẫu
powershell -ExecutionPolicy Bypass -File .\deploy\run.ps1 -Mode prod -Port 8080   # build production rồi chạy
```

### Chạy thủ công

```bash
npm install
cp .env.example .env          # rồi đặt PAYLOAD_SECRET
npm run seed                  # (tuỳ chọn) tạo dữ liệu mẫu
npm run dev
```

- Trang báo: http://localhost:3000
- Quản trị: http://localhost:3000/admin. Tài khoản đầu tiên tạo ra sẽ tự động là Quản trị viên. Nếu đã chạy seed, đăng nhập bằng `admin@newsora.local` / `newsora123`.

Database local là file `newsora.db` (đã gitignore). Schema được đồng bộ tự động khi dev.

## Cấu trúc

```
src/
  app/(frontend)/       Giao diện người đọc
    page.tsx            Trang chủ
    [category]/         Trang chuyên mục và /[category]/[slug] trang bài viết
    tag/[slug]/         Bài theo thẻ
    tim-kiem/           Tìm kiếm
  app/(payload)/        Trang quản trị và API của Payload (không sửa tay)
  collections/          Posts, Categories, Tags, Media, Users
  globals/SiteSettings  Tên báo, logo, menu, chân trang
  access/               Hàm phân quyền
  components/           Header, Footer, PostCard...
  lib/payload.ts        Hàm truy vấn dữ liệu cho frontend
  migrations/           Migration database (cho production)
  seed/                 Dữ liệu mẫu
```

## Thay đổi schema

Khi thêm hoặc sửa field trong `collections/` hay `globals/`:

```bash
npm run generate:types                 # cập nhật src/payload-types.ts
npm run migrate:create ten-thay-doi    # tạo migration cho production
```

Commit cả file migration. Lần deploy sau, Vercel sẽ tự chạy migration.

## Deploy lên Vercel

Không cần Docker. Cần 3 dịch vụ, đều có gói miễn phí: **Vercel**, **Turso** và **Oracle Cloud Object Storage**.

### 1. Tạo database Turso

```bash
# Cài CLI: https://docs.turso.tech/cli/installation
turso auth signup
turso db create newsora
turso db show newsora --url        # -> DATABASE_URL (libsql://...)
turso db tokens create newsora     # -> DATABASE_AUTH_TOKEN
```

Hoặc tạo trên web tại https://app.turso.tech.

### 2. Tạo bucket Oracle Object Storage

1. Vào **Storage → Object Storage → Buckets → Create Bucket**, đặt tên `newsora-media` và giữ các tùy chọn mặc định.
2. Để ảnh tải nhanh từ Oracle, mở bucket và chọn **Edit Visibility → Public**. Bỏ chọn *Allow users to list objects* để người ngoài không xem được danh sách file.
3. **Profile → Customer secret keys → Generate secret key**. Cặp key này là `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY`. Có thể dùng chung một cặp key cho nhiều bucket.
4. Lấy **namespace** tại Profile → Tenancy → *Object storage namespace*, và **region**, ví dụ `ap-singapore-1`.

> ⚠️ Nên dùng một **bucket riêng** chỉ để chứa ảnh của trang báo. Không bật Public cho bucket đang chứa dữ liệu khác như backup, vì khi đó ai cũng tải được các file trong bucket.
>
> Nếu buộc phải dùng chung bucket, hãy để bucket ở chế độ Private, đặt `S3_PREFIX=newsora` để ảnh nằm trong thư mục riêng, và **không** đặt `S3_PUBLIC_URL`.

Kiểm tra trên máy: điền các biến `S3_*` vào `.env` rồi chạy lại `deploy\run.ps1`. Ảnh upload trong `/admin` sẽ được lưu lên bucket thay vì thư mục `media/`. Ảnh cũ trong `media/` không tự chuyển sang bucket. Nếu chỉ có dữ liệu mẫu, có thể xóa `newsora.db` và thư mục `media/` rồi chạy `deploy\run.ps1 -Seed` để tạo lại.

### 3. Import project vào Vercel

1. https://vercel.com/new: import repo GitHub `newsora`. Không cần chỉnh Build Command, vì `vercel.json` đã đặt sẵn `npm run ci` (chạy migration rồi build).
2. Thêm **Environment Variables**:

| Biến | Giá trị |
| --- | --- |
| `DATABASE_URL` | `libsql://newsora-<user>.turso.io` |
| `DATABASE_AUTH_TOKEN` | token Turso |
| `PAYLOAD_SECRET` | chuỗi ngẫu nhiên dài |
| `NEXT_PUBLIC_SERVER_URL` | `https://<ten-du-an>.vercel.app` (hoặc tên miền riêng) |
| `S3_BUCKET` | `newsora-media` |
| `S3_ENDPOINT` | `https://<namespace>.compat.objectstorage.<region>.oraclecloud.com` |
| `S3_REGION` | `ap-singapore-1` |
| `S3_ACCESS_KEY_ID` | Access key |
| `S3_SECRET_ACCESS_KEY` | Secret key |
| `S3_PUBLIC_URL` | (nếu bucket Public) `https://objectstorage.<region>.oraclecloud.com/n/<namespace>/b/newsora-media/o` |
| `S3_PREFIX` | (tuỳ chọn) thư mục trong bucket, ví dụ `newsora` |

3. Bấm **Deploy**, sau đó vào `https://<domain>/admin` để tạo tài khoản quản trị đầu tiên.

> Nếu không đặt `S3_PUBLIC_URL`, bucket có thể để Private. Khi đó ảnh được phục vụ qua `/api/media/file/...` của chính website (chậm hơn và tốn băng thông Vercel hơn).

## Lệnh hữu ích

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy môi trường dev |
| `npm run build` / `npm start` | Build và chạy production local |
| `npm run seed` | Tạo dữ liệu mẫu (chạy lại an toàn) |
| `npm run generate:types` | Sinh lại kiểu TypeScript từ schema |
| `npm run migrate:create` | Tạo migration |
| `npm run lint` / `npm run typecheck` | Kiểm tra code |
