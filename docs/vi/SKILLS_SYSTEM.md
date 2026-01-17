# Hệ Thống Skills Của HeraSpec

## Tổng Quan

Hệ thống Skills cho phép AI agents triển khai các nhiệm vụ (tasks) một cách nhất quán bằng cách sử dụng các hướng dẫn, templates, và scripts có sẵn trong mỗi thư mục skill.

## Cấu Trúc Skills

```
heraspec/skills/
├── README.md                    # Tổng quan về skills
│
├── wordpress/                   # Skills dành riêng cho dự án WordPress
│   └── theme/
│       └── flatsome/
│           └── ux-element/      # Cấu trúc skill phân cấp
│               ├── skill.md
│               ├── templates/
│               └── ...
│
├── perfex-module/              # Skills cho module Perfex
│   ├── module-codebase/
│   │   ├── skill.md
│   │   └── ...
│
└── ui-ux/                      # Skill dùng chung (Cross-cutting)
    ├── skill.md
    └── ...
```

## Cách Agent Sử Dụng Skills

### Quy Trình Tự Động

1. **Agent đọc tasks.md**:
   ```markdown
   ## 1. WordPress – Flatsome Element (projectType: wordpress, skill: ux-element)
   - [ ] 1.1 Tạo Controller cho element
   - [ ] 1.2 Thiết lập View template
   ```

2. **Agent xác định skill**: `ux-element` cho dự án `wordpress`.

3. **Agent tìm thư mục skill**:
   - Đường dẫn: `heraspec/skills/wordpress/ux-element/` (hoặc cấu trúc phân cấp tương đương)
   - Kiểm tra file: `skill.md` tồn tại.

4. **Agent đọc hướng dẫn trong skill.md**:
   - Hiểu mục đích, quy trình thực hiện, các quy tắc (rules) và hạn chế (limitations).

5. **Agent sử dụng tài nguyên**:
   - Sử dụng code từ thư mục `templates/`.
   - Chạy các scripts trong `scripts/` nếu có.

## Các Skills Hiện Có

### Project-Specific (Theo Dự Án)

**WordPress:**
- `ux-element` - Tạo các element cho Flatsome UX Builder (Lưu ý: Chuyển snake_case thành camelCase khi dùng trong AngularJS template).
- `plugin-standard` - Tạo WordPress plugin chuẩn WordPress.org kèm Dashboard và Settings.
- `admin-settings-page` - Tạo trang cài đặt admin.
- `custom-post-type` - Đăng ký custom post types.
- `shortcode` - Tạo shortcodes.

**Perfex Module:**
- `module-codebase` - Cấu trúc code cơ bản cho module.
- `module-registration` - Đăng ký module với Perfex CRM.

### Cross-Cutting (Dùng Chung)

- `ui-ux` - Thiết kế giao diện và trải nghiệm người dùng.
- `unit-test` - Viết unit tests.
- `documents` - Viết tài liệu kỹ thuật (Hỗ trợ tạo song song Markdown & HTML tương tác)

## Ví Dụ Thực Tế

### Tạo Một Flatsome UX Element

Khi bạn muốn tạo một thành phần giao diện mới cho Flatsome, bạn có thể gửi prompt cho agent như sau:

**Ví dụ Prompt:**
> "Dựa vào skill `ux-element`, hãy tạo một element 'Countdown' cho plugin `PolyUtilities`.
> 
> **Yêu cầu:**
> 1. Cho phép thiết lập thời điểm countdown (Countdown To).
> 2. Tùy chọn định dạng hiển thị (ví dụ: Ngày:Giờ:Phút:Giây).
> 3. Bao gồm trường Heading (Tiêu đề) tùy chỉnh.
> 4. Bao gồm trường 'Expired Message' (Thông điệp khi hết hạn) để hiển thị khi thời gian kết thúc.
> 
> **Task:** `(projectType: wordpress, skill: ux-element)`"

Agent sau đó sẽ tuân theo các hướng dẫn của skill `ux-element`, sử dụng các template PHP và HTML có sẵn để đảm bảo hỗ trợ xem trước thời gian thực (real-time preview) trong UX Builder. **Quy tắc quan trọng**: Các biến có dấu gạch dưới trong PHP (như `bg_color`) phải được chuyển sang dạng camelCase trong AngularJS template (như `shortcode.options.bgColor`).

## Lệnh CLI

```bash
# Liệt kê tất cả skills
heraspec skill list

# Thêm một skill vào dự án
heraspec skill add ux-element --project-type wordpress

# Cập nhật một skill đã có
heraspec skill update ux-element --project-type wordpress
```

## Xem Thêm

- [PROJECT_TYPES_AND_SKILLS.md](./PROJECT_TYPES_AND_SKILLS.md) - Danh sách đầy đủ.
- [USER_GUIDE.md](./USER_GUIDE.md) - Hướng dẫn sử dụng chi tiết.
