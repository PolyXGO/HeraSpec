# Đề Xuất Cấu Trúc Hệ Thống Skills Cho HeraSpec

## Trạng Thái Hiện Tại

Hiện tại HeraSpec chỉ có:
- ✅ Các skill được định nghĩa dưới dạng danh sách chuỗi (string lists) trong `config.ts`.
- ✅ Các skill được sử dụng trong file `tasks.md` dưới dạng metadata: `(projectType: xxx, skill: xxx)`.
- ❌ **KHÔNG** có cấu trúc thư mục thực sự cho các skill.
- ❌ **KHÔNG** có các file `skill.md` với các hướng dẫn chi tiết.
- ❌ **KHÔNG** có các scripts, templates hay ví dụ (examples) cụ thể trong mỗi skill.

## Đề Xuất Cấu Trúc Skills Mới

### Cấu Trúc Thư Mục

```
heraspec/
├── project.md
├── config.yaml
├── specs/
├── changes/
├── archives/
└── skills/                          # ← THƯ MỤC MỚI
    ├── README.md                    # Tổng quan về hệ thống skills
    │
    ├── perfex-module/               # Các skill dành riêng cho Perfex module
    │   ├── module-codebase/
    │   │   ├── skill.md
    │   │   ├── templates/
    │   │   │   ├── module-structure.php
    │   │   │   ├── module-config.php
    │   │   │   └── module-hooks.php
    │   │   ├── scripts/
    │   │   │   └── scaffold-module.sh
    │   │   └── examples/
    │   │       ├── good-module-structure/
    │   │       └── bad-module-structure/
    │   │
    │   ├── module-registration/     # Skill cũ được nâng cấp
    │   │   ├── skill.md
    │   │   └── templates/
    │   │
    │   └── permission-group/        # Skill cũ được nâng cấp
    │       ├── skill.md
    │       └── templates/
    │
    ├── ui-ux/                       # Skill dùng chung (Cross-cutting)
    │   ├── skill.md
    │   ├── templates/
    │   │   ├── component-style.scss
    │   │   ├── responsive-design.md
    │   │   └── accessibility-checklist.md
    │   ├── scripts/
    │   │   ├── generate-color-palette.py
    │   │   └── validate-accessibility.sh
    │   └── examples/
    │       ├── good-ux-patterns/
    │       └── bad-ux-patterns/
    │
    ├── documents/                   # Skill dùng chung (Cross-cutting)
    │   ├── skill.md
    │   ├── templates/
    │   │   ├── technical-doc-template.md
    │   │   ├── user-guide-template.md
    │   │   ├── api-doc-template.md
    │   │   └── changelog-template.md
    │   ├── scripts/
    │   │   ├── generate-docs.sh
    │   │   └── validate-docs.py
    │   └── examples/
    │       ├── good-technical-doc.md
    │       └── good-user-guide.md
    │
    └── content-optimization/        # Skill dùng chung (Cross-cutting)
        ├── skill.md
        ├── templates/
        │   ├── cta-template.md
        │   ├── landing-page-template.md
        │   └── email-campaign-template.md
        ├── scripts/
        │   ├── analyze-cta-performance.py
        │   └── generate-ab-test-variants.sh
        └── examples/
            ├── high-conversion-cta/
            └── low-conversion-cta/
```

## Cấu Trúc File `skill.md`

Mỗi thư mục skill sẽ có một file `skill.md` với định dạng chuẩn như sau:

```markdown
# Kỹ năng: Cấu Trúc Code Base (Module Perfex)

## Mục đích

Skill này được sử dụng để khởi tạo và quản lý cấu trúc code base cho module Perfex CRM theo các thực hành tốt nhất (best practices).

## Khi nào sử dụng

- Khi tạo một module mới cho Perfex CRM.
- Khi tái cấu trúc (refactoring) một module hiện có.
- Khi cần đảm bảo cấu trúc module tuân thủ các quy ước của Perfex.

## Quy trình từng bước

### Bước 1: Phân tích yêu cầu
- Xác định chức năng chính của module.
- Xác định các bảng cơ sở dữ liệu cần tạo.
- Xác định các hooks và filters cần sử dụng.

### Bước 2: Dựng khung cấu trúc (Scaffold)
- Chạy script: `scripts/scaffold-module.sh <module-name>`
- Script sẽ tự động tạo cấu trúc thư mục chuẩn.
- Sao chép các template vào các vị trí chính xác.

### Bước 3: Cấu hình Module
- Điền đầy đủ thông tin vào file `module-config.php` (từ template).
- Đăng ký module trong hệ thống Perfex.
- Thiết lập phân quyền.

### Bước 4: Triển khai logic cốt lõi
- Tạo các controllers, models theo đúng cấu trúc.
- Triển khai các hooks và filters.
- Tạo các tệp migrations cho database.

### Bước 5: Kiểm thử & Viết tài liệu
- Kiểm thử module hoạt động với Perfex core.
- Viết tài liệu kỹ thuật (sử dụng skill documents).
- Tạo hướng dẫn sử dụng (sử dụng skill documents).

## Input yêu cầu

- **Module name**: Tên module (dạng kebab-case).
- **Module description**: Mô tả chức năng module.
- **Database tables**: Danh sách các bảng cần tạo.
- **Hooks required**: Danh sách các hooks cần triển khai.
- **Permissions**: Danh sách các quyền cần khởi tạo.

## Output mong đợi

- Đầy đủ cấu trúc thư mục của module.
- Các file cấu hình được điền thông tin đầy đủ.
- Các file database migrations.
- Mã nguồn đăng ký module.
- Cấu trúc tài liệu hướng dẫn cơ bản.

## Giọng điệu & Quy tắc

### Phong cách viết code (Code Style)
- Tuân thủ tiêu chuẩn code PSR-12.
- Sử dụng camelCase cho các hàm/phương thức.
- Sử dụng PascalCase cho các class.
- Viết comment bằng tiếng Anh.

### Quy tắc đặt tên (Naming Conventions)
- Thư mục module: `perfex-<module-name>`
- Tên Class: `Perfex<ModuleName>`
- Tên Hàm: `perfex_<module_name>_<action>`

### Hạn chế (Limitations)
- ❌ KHÔNG tạo các hàm toàn cục (ngoại trừ các hàm callback cho hook).
- ❌ KHÔNG hardcode thông tin đăng nhập database.
- ❌ KHÔNG bỏ qua hệ thống phân quyền của Perfex.
- ❌ KHÔNG chỉnh sửa trực tiếp các file nhân (core) của Perfex.

## Templates có sẵn

- `templates/module-structure.php` - Cấu trúc cơ bản của module.
- `templates/module-config.php` - File cấu hình module mẫu.
- `templates/module-hooks.php` - File template cho các hooks.

## Scripts có sẵn

- `scripts/scaffold-module.sh` - Tự động tạo cấu trúc module.

## Ví dụ

Xem thư mục `examples/` để tham khảo:
- `good-module-structure/` - Ví dụ về cấu trúc module tốt.
- `bad-module-structure/` - Các lỗi cấu trúc cần tránh.

## Liên kết với các kỹ năng khác

- **documents**: Dùng để viết tài liệu kỹ thuật và hướng dẫn sử dụng.
- **ui-ux**: Dùng khi module có giao diện quản trị (admin interface).
- **content-optimization**: Dùng để xây dựng các trang marketing giới thiệu module.
```

## Các Danh Mục Skills

### 1. Skills Theo Loại Dự Án (Project-Specific)

Các skill được liên kết chặt chẽ với một loại dự án cụ thể:

#### Perfex Module Skills

```
skills/perfex-module/
├── module-codebase/          # ← MỚI: Cấu trúc code base
├── module-registration/      # Cũ, được nâng cấp
├── permission-group/          # Cũ, được nâng cấp
├── admin-menu-item/          # Cũ, được nâng cấp
├── login-hook/               # Cũ, được nâng cấp
├── database-table/           # Cũ, được nâng cấp
└── api-endpoint/             # Cũ, được nâng cấp
```

#### WordPress Plugin Skills

```
skills/wordpress-plugin/
├── admin-settings-page/      # Cũ, được nâng cấp
├── custom-post-type/         # Cũ, được nâng cấp
└── ...
```

### 2. Skills Dùng Chung (Cross-Cutting)

Các skill đa dụng có thể áp dụng trên nhiều loại dự án khác nhau:

```
skills/
├── ui-ux/                    # ← MỚI
├── documents/                # ← MỚI
└── content-optimization/     # ← MỚI
```

## Chi Tiết Về Các Skills Mới

### 1. module-codebase (Perfex Module)

**Mục đích**: Khởi tạo và quản lý cấu trúc code base cho module Perfex.

**Cấu trúc thư mục**:
```
module-codebase/
├── skill.md
├── templates/
│   ├── module-structure.php      # Cấu trúc file và thư mục
│   ├── module-config.php         # File cấu hình module
│   ├── module-hooks.php          # File template cho hooks
│   └── module-migration.php      # File template cho migration database
├── scripts/
│   └── scaffold-module.sh        # Script tự động dựng khung module
└── examples/
    ├── good-module-structure/    # Ví dụ tốt
    └── bad-module-structure/     # Ví dụ cần tránh
```

### 2. ui-ux (Dùng chung - Cross-Cutting)

**Mục đích**: Xử lý style, giao diện, tối ưu trải nghiệm người dùng (UI/UX) cho mọi dự án.

**Cấu trúc thư mục**:
```
ui-ux/
├── skill.md
├── templates/
│   ├── component-style.scss          # Template viết style cho component
│   ├── responsive-design.md          # Checklist thiết kế responsive
│   ├── accessibility-checklist.md    # Checklist a11y (khả năng tiếp cận)
│   └── color-palette-template.json   # Template bảng màu
├── scripts/
│   ├── generate-color-palette.py     # Tự động tạo bảng màu từ bản thiết kế
│   └── validate-accessibility.sh     # Script xác minh tính tiếp cận (a11y)
└── examples/
    ├── good-ux-patterns/              # Các pattern UX tốt
    └── bad-ux-patterns/              # Các pattern UX nên tránh
```

### 3. documents (Dùng chung - Cross-Cutting)

**Mục đích**: Viết tài liệu (tài liệu kỹ thuật + hướng dẫn cho người dùng).

**Cấu trúc thư mục**:
```
documents/
├── skill.md
├── templates/
│   ├── technical-doc-template.md    # Tài liệu kỹ thuật mẫu
│   ├── user-guide-template.md       # Hướng dẫn sử dụng mẫu
│   ├── api-doc-template.md           # Tài liệu API mẫu
│   └── changelog-template.md         # Bản ghi thay đổi mẫu
├── scripts/
│   ├── generate-docs.sh              # Tự động tạo tài liệu
│   └── validate-docs.py              # Xác minh định dạng tài liệu
└── examples/
    ├── good-technical-doc.md         # Ví dụ tài liệu kỹ thuật tốt
    └── good-user-guide.md            # Ví dụ hướng dẫn sử dụng tốt
```

### 4. content-optimization (Dùng chung - Cross-Cutting)

**Mục đích**: Tối ưu hóa nội dung, tăng tỷ lệ chuyển đổi (CR) cho CTA.

**Cấu trúc thư mục**:
```
content-optimization/
├── skill.md
├── templates/
│   ├── cta-template.md               # Các mẫu CTA
│   ├── landing-page-template.md      # Cấu trúc trang landing page mẫu
│   └── email-campaign-template.md     # Mẫu chiến dịch email marketing
├── scripts/
│   ├── analyze-cta-performance.py    # Phân tích hiệu năng CTA
│   └── generate-ab-test-variants.sh   # Tự động tạo các biến thể test A/B
└── examples/
    ├── high-conversion-cta/           # Ví dụ CTA tỷ lệ chuyển đổi cao
    └── low-conversion-cta/            # Ví dụ CTA cần cải thiện
```

## Cách Agent Sử Dụng Skills

### Quy Trình

1. **Agent đọc file `tasks.md`**:
   ```markdown
   ## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
   - [ ] 1.1 Khởi tạo cấu trúc module
   ```

2. **Agent xác định skill tương ứng**: `module-codebase`

3. **Agent mở thư mục skill**:
   ```
   heraspec/skills/perfex-module/module-codebase/
   ```

4. **Agent đọc file `skill.md`**:
   - Hiểu rõ mục đích, quy trình, các tham số đầu vào và kết quả đầu ra.
   - Nắm vững các quy tắc ứng xử, văn phong và hạn chế.

5. **Agent sử dụng tài nguyên trong skill**:
   - Chạy script: `scripts/scaffold-module.sh category-management`
   - Copy file mẫu: `templates/module-structure.php`
   - Tham khảo ví dụ: `examples/good-module-structure/`

6. **Agent triển khai code tuân thủ theo đúng hướng dẫn trong `skill.md`**

### Ví Dụ Cụ Thể

**Nhiệm vụ trong `tasks.md`**:
```markdown
## 1. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
- [ ] 1.1 Tạo cấu trúc module
- [ ] 1.2 Cấu hình đăng ký module
- [ ] 1.3 Tạo các bảng database
```

**Agent sẽ thực hiện**:
1. Đọc file `heraspec/skills/perfex-module/module-codebase/skill.md`.
2. Hiểu và áp dụng quy trình 5 bước.
3. Chạy lệnh `scripts/scaffold-module.sh category-management`.
4. Điền đầy đủ thông tin vào các template cấu hình.
5. Triển khai code tuân theo các quy ước đặt tên và phong cách viết code trong `skill.md`.

## Lợi Ích Mang Lại

### 1. Tính Tái Sử Dụng Cao
- Một skill có thể được tái sử dụng cho hàng loạt task khác nhau.
- Có sẵn template và script, giúp loại bỏ việc viết lại từ đầu.

### 2. Sự Nhất Quán
- Tất cả các module đều tuân theo một quy chuẩn thống nhất.
- Phong cách code (style) và cấu trúc thư mục đồng bộ.

### 3. Tăng Tốc Độ Học Hỏi Của Agent
- Các ví dụ tốt/xấu giúp agent học nhanh cách giải quyết bài toán theo chuẩn của dự án.
- File `skill.md` là "nguồn sự thật" duy nhất cho mỗi kỹ năng.

### 4. Dễ Dàng Mở Rộng
- Việc thêm các kỹ năng mới chỉ đơn giản là tạo thêm thư mục tương ứng.
- Không cần sửa đổi mã nguồn cốt lõi của công cụ CLI HeraSpec.

### 5. Giảm Tải Cho Agent
- Một Agent tổng quát làm việc với nhiều Skills chuyên biệt.
- Thay vì phải duy trì quá nhiều Agent chuyên biệt phức tạp khác nhau.

## Lộ Trình Chuyển Đổi (Migration Path)

### Bước 1: Khởi Tạo Cấu Trúc
- Tạo thư mục `heraspec/skills/`.
- Tạo các thư mục con cho từng skill.

### Bước 2: Nâng Cấp Các Kỹ Năng Hiện Có
- Với mỗi skill định nghĩa trong `config.ts`, tạo thư mục tương ứng.
- Soạn thảo tài liệu `skill.md` hướng dẫn chi tiết cho từng kỹ năng.
- Bổ sung templates/scripts nếu cần.

### Bước 3: Tích Hợp Các Kỹ Năng Mới
- Thêm `module-codebase` cho Perfex.
- Thêm `ui-ux`, `documents`, `content-optimization` (các skill dùng chung).

### Bước 4: Cập Nhật Chỉ Dẫn Cho Agent
- Hướng dẫn Agent tự động tìm đọc file `skill.md` khi gặp các task có gắn skill.
- Hướng dẫn cách chạy các scripts và sử dụng templates trong thư mục skill.

## Các Câu Hỏi Cần Xác Nhận

1. ✅ Cấu trúc thư mục này đã hợp lý chưa?
2. ✅ Định dạng file `skill.md` đã đầy đủ thông tin chưa?
3. ✅ Có cần bổ sung thêm phần nào trong file `skill.md` không?
4. ✅ Các skill mới (module-codebase, ui-ux, documents, content-optimization) đã đáp ứng đúng nhu cầu thực tế chưa?
5. ✅ Có cần thêm skill nào khác không?
6. ✅ Có cần xây dựng các lệnh CLI để quản lý skill không? (Ví dụ: `heraspec skill list`, `heraspec skill show <skill-name>`)

## Các Bước Tiếp Theo (Sau Khi Xác Nhận)

1. Tạo cấu trúc thư mục trong `src/core/skills/`.
2. Phát triển bộ phân tích (parser) cho file `skill.md`.
3. Cập nhật prompt chỉ dẫn cho agent để sử dụng hệ thống skills.
4. Phát triển các lệnh CLI quản lý skill.
5. Viết tài liệu `skill.md` mẫu cho các skill mới.
6. Xây dựng các scripts và templates mẫu đi kèm.
