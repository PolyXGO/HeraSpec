# Kiến Trúc HeraSpec

## Tổng Quan

HeraSpec được xây dựng bằng TypeScript và tuân theo kiến trúc module:

```
src/
├── cli/              # Điểm truy cập CLI
├── commands/         # Triển khai các lệnh
├── core/             # Logic cốt lõi
│   ├── config.ts     # Các hằng số cấu hình
│   ├── schemas/      # Zod schemas để validation
│   ├── parsers/      # Xử lý Markdown
│   ├── validation/   # Logic kiểm tra (validation)
│   ├── templates/    # Các file mẫu (templates)
│   └── ...
└── utils/            # Các hàm tiện ích
```

## Các Khái Niệm Cốt Lõi

### Spec
Tài liệu cấu trúc định nghĩa yêu cầu, scenarios, và quy tắc. Nằm trong `heraspec/specs/` và là "nguồn sự thật" (source of truth) cho dự án.

### Change
Một đề xuất thay đổi nằm trong `heraspec/changes/<slug>/`, chứa proposal, tasks và delta specs.

### Skill
Các quy trình và tài nguyên có thể tái sử dụng cho từng loại dự án (project type).

**WordPress:**
- admin-settings-page
- custom-post-type
- shortcode
- ux-element (Hỗ trợ Flatsome UX Builder)

Xem [PROJECT_TYPES_AND_SKILLS.md](PROJECT_TYPES_AND_SKILLS.md) để biết danh sách chuyên sâu.

## Quy Trình Xử Lý

1. **Phát triển**: AI hoặc con người tạo change và specs.
2. **Kiểm tra**: Chạy `heraspec validate` để đảm bảo spec đúng định dạng.
3. **Thực hiện**: Triển khai code dựa trên specs và sự hỗ trợ của các Skills.
4. **Lưu trữ**: Chạy `heraspec archive` để merge specs vào hệ thống chính.
