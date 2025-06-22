# VS Code Debug Guide

## 🚀 Các cấu hình Debug có sẵn

### **1. 🚀 Debug Local Development**
- **Mục đích**: Debug ứng dụng chạy local với MongoDB local
- **Cách dùng**: Chọn từ dropdown và nhấn F5
- **Yêu cầu**: MongoDB phải đang chạy local

### **2. 🐳 Debug Docker Development**
- **Mục đích**: Debug ứng dụng trong Docker container
- **Cách dùng**: 
  1. Chọn từ dropdown
  2. Nhấn F5 (sẽ tự động khởi động Docker)
  3. Đặt breakpoints và debug

### **3. 🧪 Debug Test Environment**
- **Mục đích**: Debug với môi trường test
- **Cách dùng**: Chọn và nhấn F5
- **Database**: Sử dụng database test riêng biệt

### **4. 🏭 Debug Production (Local)**
- **Mục đích**: Debug với cấu hình production (local)
- **Cách dùng**: Chọn và nhấn F5
- **Lưu ý**: Source maps tắt để tối ưu performance

### **5. 🐳 Debug Docker Production**
- **Mục đích**: Debug production trong Docker
- **Cách dùng**: Chọn và nhấn F5
- **Tự động**: Khởi động Docker production trước

### **6. 🧪 Run Tests**
- **Mục đích**: Chạy tất cả tests
- **Cách dùng**: Chọn và nhấn F5
- **Output**: Hiển thị kết quả test trong terminal

### **7. 📊 Run Tests with Coverage**
- **Mục đích**: Chạy tests với coverage report
- **Cách dùng**: Chọn và nhấn F5
- **Output**: Coverage report + test results

### **8. 🔍 Debug Specific Test File**
- **Mục đích**: Debug file test cụ thể
- **Cách dùng**: 
  1. Mở file test muốn debug
  2. Chọn configuration này
  3. Nhấn F5

### **9. 🔄 Debug with Nodemon**
- **Mục đích**: Debug với auto-restart
- **Cách dùng**: Chọn và nhấn F5
- **Tính năng**: Tự động restart khi code thay đổi

## 🎯 Compounds (Chạy nhiều config cùng lúc)

### **🐳 Debug Full Stack (Docker)**
- Khởi động Docker development
- Debug ứng dụng trong container

### **🏭 Debug Full Stack (Production)**
- Khởi động Docker production
- Debug ứng dụng production

## 🛠️ Cách sử dụng

### **1. Khởi động Debug**
1. Mở **Debug panel** (Ctrl+Shift+D)
2. Chọn configuration từ dropdown
3. Nhấn **F5** hoặc **Start Debugging**

### **2. Đặt Breakpoints**
- Click vào lề trái của dòng code
- Hoặc đặt cursor và nhấn **F9**

### **3. Debug Controls**
- **F5**: Continue
- **F10**: Step Over
- **F11**: Step Into
- **Shift+F11**: Step Out
- **Ctrl+Shift+F5**: Restart
- **Shift+F5**: Stop

### **4. Inspect Variables**
- **Variables panel**: Xem tất cả variables
- **Watch panel**: Theo dõi biến cụ thể
- **Call Stack**: Xem call stack
- **Breakpoints**: Quản lý breakpoints

## 🔧 Tasks có sẵn

### **Docker Tasks**
- `docker-dev-up`: Khởi động Docker development
- `docker-prod-up`: Khởi động Docker production
- `docker-down`: Dừng tất cả containers

### **Development Tasks**
- `install-deps`: Cài đặt dependencies
- `lint`: Chạy ESLint
- `test`: Chạy tests

### **Database Tasks**
- `start-mongodb`: Khởi động MongoDB
- `stop-mongodb`: Dừng MongoDB

## 🎯 Tips & Tricks

### **1. Hot Reload với Nodemon**
- Sử dụng "🔄 Debug with Nodemon"
- Code thay đổi sẽ tự động restart

### **2. Debug API Calls**
- Đặt breakpoints trong controllers
- Inspect request/response objects

### **3. Debug Database Queries**
- Đặt breakpoints trong services
- Xem query parameters và results

### **4. Debug Cron Jobs**
- Đặt breakpoints trong cron.service.js
- Debug các hàm crawl

### **5. Debug Tests**
- Sử dụng "🔍 Debug Specific Test File"
- Debug từng test case riêng biệt

## 🚨 Troubleshooting

### **Debug không kết nối được**
1. Kiểm tra port 9229 có đang listen không
2. Đảm bảo Docker container đang chạy
3. Kiểm tra firewall settings

### **Breakpoints không hoạt động**
1. Đảm bảo source maps được bật
2. Kiểm tra file path mapping
3. Restart debug session

### **Docker không khởi động**
1. Kiểm tra Docker đang chạy
2. Kiểm tra port conflicts
3. Xem logs: `docker logs container-name`

## 📝 Environment Variables

### **Development**
```env
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://localhost:27017/exchanerates
```

### **Test**
```env
NODE_ENV=test
PORT=3001
MONGODB_URL=mongodb://localhost:27017/exchanerates-test
```

### **Production**
```env
NODE_ENV=production
PORT=3000
MONGODB_URL=mongodb://localhost:27017/exchanerates-prod
```

## 🎉 Kết luận

Với cấu hình này, bạn có thể:
- Debug ở mọi môi trường (dev, test, prod)
- Debug trong Docker hoặc local
- Debug tests và API calls
- Hot reload với nodemon
- Quản lý database và dependencies

Chọn configuration phù hợp với nhu cầu và bắt đầu debug! 🚀 