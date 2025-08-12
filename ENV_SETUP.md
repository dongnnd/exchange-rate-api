# Environment Variables Setup for Render

## Các biến môi trường cần thiết:

### Bắt buộc:
```
NODE_ENV=production
PORT=10000
POSTGRES_URL=postgresql://username:password@host:port/database
JWT_SECRET=your_super_secret_jwt_key_here
```

### Tùy chọn:
```
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

## Cách lấy POSTGRES_URL từ Render:

1. Tạo PostgreSQL database trong Render
2. Vào database settings
3. Copy "External Database URL"
4. Sử dụng URL này cho POSTGRES_URL

## JWT_SECRET:
- Tạo một chuỗi ngẫu nhiên dài (ít nhất 32 ký tự)
- Ví dụ: `my-super-secret-jwt-key-2024-very-long-and-secure`
