# Thiết Lập Môi Trường Phát Triển (Development Setup)

Hướng dẫn cách sử dụng HeraSpec trong môi trường phát triển (trước khi publish lên npm).

## Quan Trọng: Cách Thức Hoạt Động Của HeraSpec

**HeraSpec là một công cụ CLI toàn cục (global)**, chứ không phải là một dependency trong dự án của bạn:

- ✅ Cài đặt **một lần duy nhất** trên máy tính của bạn (toàn cục - global)
- ✅ Sử dụng trong **tất cả dự án** mà không cần sao chép mã nguồn của HeraSpec
- ✅ Không cần copy thư mục HeraSpec vào các dự án của bạn
- ✅ Chỉ cần chạy `heraspec init` trong mỗi dự án để tạo cấu trúc thư mục `heraspec/`

## Kịch Bản 1: HeraSpec Đã Được Publish Lên npm

(Nếu đã được publish lên npm registry công khai)

```bash
# Cài đặt toàn cục từ npm
npm install -g heraspec

# Xác minh cài đặt
heraspec --version

# Sử dụng trong bất kỳ dự án nào
cd my-project
heraspec init
```

## Kịch Bản 2: Chế Độ Phát Triển (Chưa Publish Lên npm)

(Trạng thái hiện tại - vì HeraSpec chưa được publish chính thức lên npm)

### Bước 1: Cài Đặt Dependencies và Build

Trong thư mục HeraSpec:

```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Cài đặt dependencies (bao gồm esbuild cho quá trình build)
npm install

# Build mã nguồn
npm run build
```

**Lưu ý quan trọng về quá trình Build:**

- HeraSpec sử dụng `esbuild` để biên dịch TypeScript.
- `esbuild` đã được thêm vào mục `devDependencies` trong file `package.json`.
- Script `prepare` đã được loại bỏ để tránh lỗi trong quá trình chạy `npm install` (vì quá trình build cần các dependencies được cài đặt trước).

Sau khi build xong, các file sẽ được tạo ra tại:
- `dist/` - Mã nguồn JavaScript đã biên dịch.
- `bin/heraspec.js` - Điểm truy cập chính của CLI.

### Bước 2: Liên Kết Package Cục Bộ (Link Local Package)

Có 2 cách thực hiện:

#### Lựa chọn A: Sử dụng `npm link` (Khuyến nghị)

```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Tạo global symlink (liên kết tượng trưng toàn cục)
npm link

# Xác minh cài đặt
heraspec --version

# Bây giờ bạn có thể sử dụng heraspec ở bất kỳ đâu
cd ~/my-project
heraspec init
```

**Lưu ý**: `npm link` tạo ra một symlink, vì vậy bất kỳ thay đổi nào trong mã nguồn sẽ có tác dụng ngay lập tức (sau khi chạy rebuild).

#### Lựa chọn B: Cài Đặt Trực Tiếp Từ Thư Mục Cục Bộ

```bash
# Cài đặt toàn cục trực tiếp từ đường dẫn cục bộ
npm install -g /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Xác minh cài đặt
heraspec --version
```

**Lưu ý**: Với phương pháp này, bạn cần phải chạy lại lệnh cài đặt mỗi khi mã nguồn của HeraSpec thay đổi.

### Bước 3: Sử Dụng Trong Các Dự Án

Bây giờ bạn đã có thể sử dụng lệnh `heraspec` trong bất kỳ dự án nào:

```bash
# Di chuyển đến thư mục dự án của bạn
cd ~/my-wordpress-plugin

# Khởi tạo HeraSpec (tạo thư mục heraspec/ trong dự án)
heraspec init

# Sử dụng các lệnh khác
heraspec list
heraspec show name-of-change
```

## Quy Trình Build

### Tổng Quan

HeraSpec sử dụng **esbuild** để biên dịch TypeScript sang JavaScript. Quy trình build tạo ra:

- `dist/index.js` - Export chính (dùng cho tích hợp programmatic)
- `bin/heraspec.js` - Điểm truy cập CLI (file thực thi)

### Các Dependencies Bắt Buộc

Đảm bảo các package sau có mặt trong phần `devDependencies`:
- `esbuild` - Công cụ build
- `typescript` - Trình biên dịch TypeScript (để kiểm tra kiểu)
- `@types/node` - Định nghĩa kiểu cho Node.js

### Các Lệnh Build

```bash
# Build một lần
npm run build

# Chế độ watch (tự động rebuild mỗi khi file thay đổi)
npm run dev

# Build và chạy thử CLI ngay lập tức
npm run dev:cli list
```

### Quy Trình Làm Việc Khi Build

1. **Cài đặt dependencies** (nếu chưa cài):
   ```bash
   npm install
   ```
   Lưu ý: `esbuild` sẽ được tự động cài đặt vì nó nằm trong `devDependencies`.

2. **Build mã nguồn**:
   ```bash
   npm run build
   ```
   Script build (`build.js`) sẽ thực hiện:
   - Gom mã nguồn `src/index.ts` → `dist/index.js`
   - Gom mã nguồn `src/cli/index.ts` → `bin/heraspec.js`
   - Đánh dấu tất cả các dependencies bên thứ ba là external (không đóng gói chúng vào bundle).

3. **Xác minh build**:
   ```bash
   # Kiểm tra xem các file đã được tạo chưa
   ls -la dist/
   ls -la bin/
   
   # Chạy thử CLI
   node bin/heraspec.js --version
   ```

### Các Lưu Ý Quan Trọng

- **Không có script `prepare`**: Đã bị loại bỏ để tránh việc tự động build khi chạy `npm install` (dễ gây lỗi nếu các dependencies chưa sẵn sàng).
- **Build thủ công**: Sau khi chạy `npm install`, bạn phải chạy `npm run build` một cách thủ công.
- **Rebuild khi thay đổi mã nguồn**: Mỗi khi bạn chỉnh sửa mã nguồn trong thư mục `src/`, bạn cần phải build lại để các thay đổi có hiệu lực.

## Quy Trình Phát Triển (Development Workflow)

Khi tham gia phát triển HeraSpec:

```bash
# 1. Chỉnh sửa code trong thư mục src/

# 2. Rebuild lại
npm run build

# 3. Kiểm thử ngay lập tức (nếu đã dùng npm link trước đó)
cd ~/test-project
heraspec list

# Hoặc kiểm thử trực tiếp
npm run dev:cli list
```

## Cấu Trúc Sau Khi Khởi Tạo

Sau khi chạy lệnh `heraspec init` trong một dự án, bạn sẽ có cấu trúc như sau:

```
my-project/
├── heraspec/              # ← Được tạo ra bởi 'heraspec init'
│   ├── project.md
│   ├── config.yaml
│   ├── specs/
│   ├── changes/
│   └── archives/
├── AGENTS.heraspec.md     # ← Được tạo ra bởi 'heraspec init'
└── ... (mã nguồn dự án của bạn)
```

**Hoàn toàn không có** mã nguồn của HeraSpec ở đây. Chỉ có cấu trúc thư mục `heraspec/` dùng để quản lý specs và changes của dự án.

## Câu Hỏi Thường Gặp (FAQ)

### Q: Tôi có cần copy thư mục HeraSpec vào từng dự án không?

**A: KHÔNG.** HeraSpec là một công cụ CLI toàn cục. Bạn chỉ cần:
1. Cài đặt toàn cục một lần duy nhất (hoặc link link cục bộ).
2. Chạy `heraspec init` trong mỗi dự án để khởi tạo cấu trúc quản lý.

### Q: Tại sao lệnh `npm install -g heraspec` không hoạt động?

**A:** Vì HeraSpec chưa được publish lên npm registry công khai. Bạn cần phải:
- Build mã nguồn thủ công.
- Link hoặc cài đặt từ thư mục cục bộ của dự án.

### Q: Làm thế nào để test thử HeraSpec trong quá trình phát triển?

**A:** 
```bash
# Trong thư mục HeraSpec
npm run build

# Tạo liên kết
npm link

# Test thử ở một dự án khác
cd ~/test-project
heraspec init
```

### Q: Tôi có thể sử dụng HeraSpec cho nhiều dự án không?

**A: CÓ.** Sau khi link hoặc cài đặt global cục bộ, bạn có thể sử dụng ở bất kỳ dự án nào:
```bash
cd project-1
heraspec init

cd project-2
heraspec init

cd project-3
heraspec init
```

Mỗi dự án sẽ có một thư mục cấu hình `heraspec/` hoàn toàn riêng biệt.

### Q: Làm sao để cập nhật HeraSpec sau khi chỉnh sửa code?

**A:**
```bash
# Trong thư mục HeraSpec
npm run build

# Nếu đã sử dụng npm link, không cần làm gì thêm
# Nếu cài đặt từ thư mục cục bộ, hãy cài đặt lại:
npm install -g /path/to/HeraSpec
```

## Hướng Dẫn Sửa Lỗi (Troubleshooting)

### Lỗi: "Cannot find package 'esbuild'"

**Nguyên nhân**: Package `esbuild` chưa được cài đặt trong `devDependencies`.

**Cách xử lý**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Cài đặt lại dependencies (esbuild sẽ được cài đặt)
npm install

# Sau đó build lại
npm run build
```

**Lưu ý**: Nếu vẫn gặp lỗi, hãy kiểm tra xem `package.json` đã khai báo `esbuild` trong `devDependencies` chưa:
```json
"devDependencies": {
  "@types/node": "^24.2.0",
  "esbuild": "^0.24.0",
  "typescript": "^5.9.3"
}
```

### Lỗi: "command not found: heraspec"

**Nguyên nhân**: Chưa được tạo liên kết (link) hoặc cài đặt toàn cục.

**Cách xử lý**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Đảm bảo đã build trước
npm run build

# Link toàn cục
npm link

# Xác minh lại
heraspec --version
```

### Lỗi: "Cannot find module" khi build

**Nguyên nhân**: Các dependencies chưa được cài đặt đầy đủ.

**Cách xử lý**:
```bash
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec

# Cài đặt lại các dependencies
npm install

# Xóa các thư mục cũ và build lại
rm -rf dist bin
npm run build
```

### Lỗi tự động build khi chạy `npm install`

**Nguyên nhân**: Script `prepare` đã bị xóa khỏi `package.json` để tránh lỗi này.

**Cách xử lý**: Đây là hành vi mong muốn. Bạn cần tự chạy build thủ công sau khi cài đặt dependencies:
```bash
npm install
npm run build
```

### Lỗi khi chạy heraspec trong dự án

**Kiểm tra theo thứ tự**:
1. Đã cài đặt dependencies chưa? (`npm install`)
2. Đã chạy build chưa? (`npm run build`)
3. Đã tạo liên kết chưa? (`npm link`)
4. Đã chạy `heraspec init` trong thư mục dự án chưa?

**Quy trình chuẩn đầy đủ**:
```bash
# Trong thư mục HeraSpec
cd /Applications/Data/Projects/HeadRandomSpec/HeraSpec
npm install        # Cài đặt dependencies
npm run build      # Build mã nguồn
npm link           # Liên kết toàn cục

# Kiểm tra phiên bản
heraspec --version

# Sử dụng trong dự án
cd ~/my-project
heraspec init
```

### Chi Tiết Quá Trình Build

HeraSpec sử dụng `esbuild` để biên dịch TypeScript. Quá trình build gồm:

1. **Build `src/index.ts`** → `dist/index.js` (main export)
2. **Build `src/cli/index.ts`** → `bin/heraspec.js` (CLI entry point)

Cả hai file đều được bundle cùng với việc bỏ qua việc gom nhóm các dependencies bên ngoài (như commander, chalk, v.v... không bị đóng gói trực tiếp vào file build).

Nếu gặp lỗi build, hãy kiểm tra:
- Phiên bản Node.js >= 20.19.0
- `esbuild` đã được cài đặt trong thư mục `node_modules`
- Không có lỗi cú pháp trong code TypeScript

## Tóm Tắt

1. **HeraSpec là công cụ CLI global** - không copy mã nguồn của nó vào dự án.
2. **Trong quá trình phát triển**: Build → Link → Sử dụng.
3. **Trong môi trường chạy thực tế** (sau khi publish): `npm install -g heraspec`.
4. **Mỗi dự án** chỉ cần chạy `heraspec init` một lần duy nhất để tạo cấu trúc `heraspec/`.
