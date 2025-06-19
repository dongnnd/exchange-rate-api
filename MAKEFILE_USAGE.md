# Makefile Usage Guide

## Tổng quan

Makefile này cung cấp các lệnh tiện ích để quản lý project Node.js Express một cách dễ dàng.

## Cài đặt

### 1. Xem tất cả lệnh có sẵn
```bash
make help
```

### 2. Setup project lần đầu
```bash
make setup
```
Lệnh này sẽ:
- Cài đặt dependencies (`npm install`)
- Khởi động MongoDB với Docker

## Development

### Khởi động development server
```bash
make dev
```

### Kiểm tra code quality
```bash
# Kiểm tra ESLint và Prettier
make check

# Tự động sửa lỗi ESLint và Prettier
make fix

# Chỉ kiểm tra ESLint
make lint

# Chỉ sửa ESLint
make lint-fix

# Chỉ kiểm tra Prettier
make prettier

# Chỉ sửa Prettier
make prettier-fix
```

### Chạy tests
```bash
# Chạy tests một lần
make test

# Chạy tests trong watch mode
make test-watch

# Chạy tests với coverage
make coverage
```

### Development workflow hoàn chỉnh
```bash
make dev-workflow
```
Lệnh này sẽ:
1. Sửa tất cả lỗi code quality
2. Chạy tests
3. Khởi động development server

## Production

### Khởi động production server
```bash
make start
```

### Kiểm tra deployment
```bash
make deploy
```
Lệnh này sẽ:
1. Cài đặt dependencies
2. Chạy tests
3. Kiểm tra code quality

## Docker

### Development environment
```bash
make docker-dev
```

### Production environment
```bash
make docker-prod
```

### Test environment
```bash
make docker-test
```

## Database

### Khởi động MongoDB
```bash
make db-start
```

### Dừng MongoDB
```bash
make db-stop
```

## Authentication

### Lấy authentication token
```bash
make get-token
```

Sau khi chạy lệnh này, bạn sẽ thấy token và hướng dẫn sử dụng. Copy dòng export và chạy:
```bash
export API_TOKEN="your_token_here"
```

## Cron Jobs Management

### Khởi động cron jobs
```bash
make cron-start
```

### Dừng cron jobs
```bash
make cron-stop
```

### Kiểm tra trạng thái cron jobs
```bash
make cron-status
```

## Exchange Rate Crawling

### Crawl tiền tệ ưu tiên
```bash
make crawl-priority
```

### Crawl thông minh
```bash
make crawl-smart
```

### Crawl theo batch
```bash
make crawl-batches
```

## Maintenance

### Cleanup project
```bash
make clean
```
Lệnh này sẽ xóa:
- `node_modules`
- `logs`
- `coverage`
- `.nyc_output`
- `dist`

## Workflow Examples

### 1. Setup project mới
```bash
make setup
make dev
```

### 2. Development hàng ngày
```bash
make fix          # Sửa lỗi code quality
make test         # Chạy tests
make dev          # Khởi động server
```

### 3. Kiểm tra trước khi commit
```bash
make check        # Kiểm tra code quality
make test         # Chạy tests
```

### 4. Production deployment
```bash
make deploy       # Kiểm tra deployment
make start        # Khởi động production
```

### 5. Quản lý exchange rates
```bash
make get-token    # Lấy token
export API_TOKEN="your_token"
make cron-start   # Khởi động cron jobs
make crawl-priority  # Crawl tiền tệ ưu tiên
```

## Troubleshooting

### Lỗi "Please set API_TOKEN"
```bash
make get-token
export API_TOKEN="your_token_here"
```

### Lỗi MongoDB connection
```bash
make db-start
```

### Lỗi Docker
```bash
# Kiểm tra Docker đang chạy
docker --version

# Restart Docker nếu cần
```

## Tips

1. **Sử dụng tab completion**: Gõ `make` rồi nhấn Tab để xem tất cả lệnh
2. **Kiểm tra help**: `make help` để xem tất cả lệnh có sẵn
3. **Workflow automation**: Sử dụng `make dev-workflow` cho development hàng ngày
4. **Token management**: Lưu token vào file `.env` hoặc shell profile để không cần nhập lại

## Customization

Bạn có thể chỉnh sửa Makefile để thêm các lệnh mới:

```makefile
# Thêm lệnh mới
my-command:
	@echo "Running my custom command..."
	# your commands here
```

## Security Notes

- Thay đổi credentials mặc định trong `scripts/get-token.sh`
- Không commit token vào git
- Sử dụng environment variables cho production 