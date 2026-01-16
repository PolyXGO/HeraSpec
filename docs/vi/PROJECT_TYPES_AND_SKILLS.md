# Các Loại Dự Án và Skills

Tài liệu này định nghĩa tất cả các loại dự án (project types) được hỗ trợ và các kỹ năng (skills) đi kèm trong HeraSpec.

## Các Loại Dự Án

### wordpress-plugin

Phát triển plugin cho WordPress.

**Skills:**
- `admin-settings-page` - Tạo trang cài đặt admin
- `custom-post-type` - Đăng ký custom post types
- `shortcode` - Tạo shortcodes
- `ux-element` - Tạo Flatsome UX Builder elements
- `rest-endpoint` - Các endpoint cho WordPress REST API
- `meta-box` - Tạo meta boxes
- `taxonomy` - Đăng ký custom taxonomies

### wordpress-theme

Phát triển theme cho WordPress.

**Skills:**
- `theme-setup` - Cài đặt và khởi tạo theme
- `template-part` - Các thành phần template
- `ux-element` - Tạo Flatsome UX Builder elements
- `widget-area` - Đăng ký vùng widget
- `customizer-setting` - Cài đặt theme customizer

### perfex-module

Phát triển module cho Perfex CRM.

**Skills:**
- `module-registration` - Đăng ký module
- `permission-group` - Nhóm quyền
- `admin-menu-item` - Menu admin
- `database-table` - Bảng cơ sở dữ liệu

## Cách Sử Dụng Skills Trong Tasks

Skills được tham chiếu trong file `tasks.md`:

```markdown
## 1. WordPress – Flatsome Element (projectType: wordpress, skill: ux-element)
- [ ] Task 1.1 Tạo cấu trúc element
```

## Thêm Project Types hoặc Skills Mới

1. Thêm vào mảng `PROJECT_TYPES` hoặc đối tượng `SKILLS` trong `src/core/config.ts`.
2. Cập nhật tài liệu này.
