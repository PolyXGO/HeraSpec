# Quick Start - Bắt Đầu Nhanh

## TL;DR

**HeraSpec là CLI tool global - KHÔNG cần copy vào dự án!**

## Các Bước Để Sử Dụng Ngay

### Bước 1: Build và Link HeraSpec

```bash
# Di chuyển vào thư mục HeraSpec
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Cài dependencies
npm install

# Build code
npm run build

# Link để sử dụng global
npm link
```

### Bước 2: Kiểm Tra

```bash
heraspec --version
```

Nếu thấy version → thành công!

### Bước 3: Sử Dụng Trong Dự Án

```bash
# Di chuyển đến dự án của bạn (BẤT KỲ đâu)
cd ~/my-project

# Khởi tạo HeraSpec (tạo thư mục heraspec/ trong dự án này)
heraspec init

# Xong! Bây giờ bạn có thể dùng các lệnh khác
heraspec list
```

## Lưu Ý Quan Trọng

✅ **KHÔNG** copy thư mục HeraSpec vào dự án  
✅ Chỉ cần chạy `heraspec init` trong mỗi dự án  
✅ Mỗi dự án sẽ có thư mục `heraspec/` riêng  

## Cấu Trúc Sau Khi Init

```
my-project/
├── heraspec/          ← Được tạo bởi 'heraspec init'
│   ├── project.md
│   ├── config.yaml
│   ├── specs/
│   └── changes/
└── ... (code dự án)
```

**KHÔNG có** source code HeraSpec ở đây.

## Xem Chi Tiết

- [DEVELOPMENT_SETUP.md](docs/en/DEVELOPMENT_SETUP.md) - Hướng dẫn phát triển chi tiết
- [Documentation](docs/README.md) - Available in multiple languages

