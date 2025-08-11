# Hướng dẫn Setup Neon Database

## Bước 1: Tạo Neon Project
1. Vào [neon.tech](https://neon.tech)
2. Đăng ký/đăng nhập
3. **"Create a project"**
4. Đặt tên: `exchange-rate-api`
5. Chọn region gần bạn
6. Nhấn **"Create Project"**

## Bước 2: Lấy Connection String
1. Sau khi tạo xong, nhấn **"Connect"**
2. Chọn **"Connection string"**
3. Copy chuỗi dạng: `postgresql://user:password@host:port/database`

## Bước 3: Setup Database từ Local
Chạy script setup (sẽ tự động test kết nối, tạo schema, seed dữ liệu):

```bash
# Cách 1: Dùng npm script
POSTGRES_URL="postgresql://user:password@host:port/database" NODE_ENV=production npm run setup:neon

# Cách 2: Chạy trực tiếp
POSTGRES_URL="postgresql://user:password@host:port/database" NODE_ENV=production node scripts/setup-neon-db.js
```

## Bước 4: Kiểm tra
1. Vào Neon Dashboard → **"Tables"**
2. Bạn sẽ thấy các bảng: `users`, `currencies`, `exchange_rates`
3. Vào bảng `currencies` để xem 168 loại tiền tệ đã được seed

## Bước 5: Sử dụng cho Vercel
Copy connection string làm Environment Variable:
- `POSTGRES_URL` = chuỗi kết nối Neon
- `NODE_ENV` = `production`

## Lưu ý
- Script sẽ tự động đóng kết nối sau khi hoàn tất
- Nếu lỗi, kiểm tra connection string và quyền truy cập
- Dữ liệu currencies sẽ được seed với flag icons và tên đa ngôn ngữ
