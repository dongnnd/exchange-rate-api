# Hệ thống Crawl Tỷ giá Hối đoái Thông minh

## Tổng quan

Hệ thống được thiết kế để crawl tỷ giá hối đoái một cách hiệu quả, tránh spam và tối ưu hóa việc lưu trữ dữ liệu. Với hơn 170 loại tiền tệ, hệ thống sử dụng các chiến lược khác nhau để quản lý việc crawl.

## Chiến lược Crawl

### 1. Crawl theo Batch (Chia nhỏ)
- **Mục đích**: Tránh spam và quá tải server
- **Cách hoạt động**: Chia 170+ loại tiền tệ thành các batch nhỏ (mặc định 10 loại/batch)
- **Delay**: Có delay giữa các batch (mặc định 1 giây)
- **Endpoint**: `POST /v1/exchange-rates/crawl/batches`

```json
{
  "baseCurrency": "USD",
  "batchSize": 10,
  "delayMs": 1000
}
```

### 2. Crawl Thông minh (Smart Crawl)
- **Mục đích**: Chỉ crawl những tỷ giá đã cũ
- **Cách hoạt động**: Kiểm tra timestamp của tỷ giá cuối cùng, chỉ crawl nếu đã quá thời gian quy định
- **Mặc định**: 30 phút
- **Endpoint**: `POST /v1/exchange-rates/crawl/smart`

```json
{
  "baseCurrency": "USD",
  "maxAgeMinutes": 30
}
```

### 3. Crawl Tiền tệ Ưu tiên
- **Mục đích**: Crawl các loại tiền tệ quan trọng nhất trước
- **Danh sách ưu tiên**: VND, EUR, JPY, GBP, CNY, KRW, SGD, THB
- **Endpoint**: `POST /v1/exchange-rates/crawl/priority`

### 4. Crawl Đơn lẻ
- **Mục đích**: Crawl một tỷ giá cụ thể
- **Endpoint**: `POST /v1/exchange-rates/crawl/single/:fromCurrency/:toCurrency`

## Cron Jobs Tự động

### 1. Priority Currencies Job
- **Tần suất**: Mỗi 30 phút
- **Mục đích**: Cập nhật các loại tiền tệ quan trọng
- **Cron**: `*/30 * * * *`

### 2. Smart Crawl Job
- **Tần suất**: Mỗi giờ
- **Mục đích**: Cập nhật tỷ giá đã cũ
- **Cron**: `0 * * * *`

### 3. Batch Crawl Job
- **Tần suất**: Mỗi 6 giờ
- **Mục đích**: Cập nhật tất cả tỷ giá
- **Cron**: `0 */6 * * *`

## API Endpoints

### Quản lý Cron Jobs
```
POST /v1/cron/start-all          # Bắt đầu tất cả cron jobs
POST /v1/cron/stop-all           # Dừng tất cả cron jobs
GET  /v1/cron/status             # Xem trạng thái cron jobs
POST /v1/cron/trigger/priority   # Trigger crawl ưu tiên thủ công
POST /v1/cron/trigger/smart      # Trigger smart crawl thủ công
POST /v1/cron/start/:jobName     # Bắt đầu job cụ thể
POST /v1/cron/stop/:jobName      # Dừng job cụ thể
```

### Crawl Endpoints
```
POST /v1/exchange-rates/crawl/priority                    # Crawl tiền tệ ưu tiên
POST /v1/exchange-rates/crawl/batches                     # Crawl theo batch
POST /v1/exchange-rates/crawl/smart                       # Crawl thông minh
POST /v1/exchange-rates/crawl/single/:from/:to            # Crawl đơn lẻ
```

## Cấu trúc Dữ liệu

### Exchange Rate Model
```javascript
{
  fromCurrency: ObjectId,    // Loại tiền tệ gốc
  toCurrency: ObjectId,      // Loại tiền tệ đích
  rate: Number,              // Tỷ giá
  source: String,            // Nguồn dữ liệu
  timestamp: Date,           // Thời gian cập nhật
  isActive: Boolean          // Trạng thái hoạt động
}
```

### Currency Model
```javascript
{
  code: String,              // Mã tiền tệ (USD, VND, EUR...)
  name: String,              // Tên tiền tệ
  symbol: String,            // Ký hiệu
  isActive: Boolean          // Trạng thái hoạt động
}
```

## Lợi ích của Thiết kế

### 1. Tránh Spam
- Crawl theo batch với delay
- Rate limiting tự động
- Chỉ crawl khi cần thiết

### 2. Tối ưu Hiệu suất
- Index database cho query nhanh
- Cache tỷ giá mới nhất
- Crawl thông minh theo thời gian

### 3. Linh hoạt
- Có thể điều chỉnh batch size
- Có thể thay đổi delay
- Có thể chọn loại tiền tệ ưu tiên

### 4. Monitoring
- Log chi tiết quá trình crawl
- Trạng thái cron jobs
- Thống kê số lượng tỷ giá đã crawl

## Sử dụng trong Production

### 1. Khởi động Cron Jobs
```bash
curl -X POST http://localhost:3000/v1/cron/start-all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. Kiểm tra trạng thái
```bash
curl -X GET http://localhost:3000/v1/cron/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Crawl thủ công
```bash
# Crawl tiền tệ ưu tiên
curl -X POST http://localhost:3000/v1/exchange-rates/crawl/priority \
  -H "Authorization: Bearer YOUR_TOKEN"

# Crawl thông minh
curl -X POST http://localhost:3000/v1/exchange-rates/crawl/smart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"maxAgeMinutes": 60}'
```

## Monitoring và Logs

Hệ thống ghi log chi tiết cho:
- Thời gian bắt đầu/kết thúc crawl
- Số lượng tỷ giá đã crawl
- Lỗi trong quá trình crawl
- Trạng thái cron jobs

## Tối ưu hóa Database

### Indexes
```javascript
// Compound index cho query nhanh
{ fromCurrency: 1, toCurrency: 1, timestamp: -1 }
{ source: 1, timestamp: -1 }
```

### Cleanup Strategy
- Giữ lại tỷ giá trong 30 ngày
- Archive tỷ giá cũ
- Compress dữ liệu lịch sử 