# Hướng Dẫn Sử Dụng HeraSpec

Hướng dẫn chi tiết về cách sử dụng HeraSpec - framework phát triển dựa trên spec cho mọi loại dự án và công cụ AI.

## Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Cài Đặt](#cài-đặt)
3. [Khởi Tạo Dự Án](#khởi-tạo-dự-án)
4. [Tạo Change Đầu Tiên](#tạo-change-đầu-tiên)
5. [Quy Trình Làm Việc](#quy-trình-làm-việc)
6. [Các Lệnh CLI](#các-lệnh-cli)
7. [Định Dạng Spec](#định-dạng-spec)
8. [Định Dạng Delta Spec](#định-dạng-delta-spec)
9. [Định Dạng Tasks](#định-dạng-tasks)
10. [Ví Dụ Thực Tế](#ví-dụ-thực-tế)
11. [Tích Hợp AI](#tích-hợp-ai)
12. [Hệ Thống Memory](#hệ-thống-memory)

## Tổng Quan

HeraSpec là một framework phát triển dựa trên specification (spec) giúp bạn:

- **Lập kế hoạch trước khi code**: Thống nhất với AI về những gì cần xây dựng
- **Theo dõi thay đổi**: Quản lý các thay đổi qua change proposals
- **Làm việc đa dự án**: Hỗ trợ WordPress, Perfex CRM, Laravel, Node.js, v.v.
- **Tích hợp AI**: Hoạt động với mọi công cụ AI (Cursor, Copilot, Windsurf, v.v.)

### Cấu Trúc Thư Mục

```
heraspec/
  project.md              # Thông tin tổng quan dự án
  config.yaml            # Cấu hình HeraSpec
  specs/                 # Specs chính (source of truth) và delta specs
    global/              # Source specs
    wordpress/
      plugin-core.md
    crm/perfex/
      modules-core.md
    add-two-factor-auth/ # Delta specs cho change
      wordpress/plugin-core.md
      crm/perfex/modules-core.md
  changes/               # Các thay đổi đang thực hiện
    add-two-factor-auth/
      proposal.md
      tasks.md
      design.md (tùy chọn)
      # Delta specs KHÔNG nằm trong changes/, mà nằm trong specs/<slug>/
  archives/              # Các thay đổi đã hoàn thành
```

## Cài Đặt

### Yêu Cầu

- **Node.js >= 20.19.0** - Kiểm tra phiên bản: `node --version`

### Cài Đặt CLI

#### Nếu HeraSpec đã được publish lên npm:

```bash
npm install -g heraspec
```

#### Nếu đang phát triển (development mode):

HeraSpec hiện tại chưa publish lên npm. Bạn cần build và link từ source:

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

**Lưu ý**: Không cần copy thư mục HeraSpec vào dự án! HeraSpec là CLI tool global, chỉ cần link một lần.

Kiểm tra cài đặt:

```bash
heraspec --version
```

Xem thêm: [DEVELOPMENT_SETUP.md](../en/DEVELOPMENT_SETUP.md) để biết chi tiết về development setup.

## Khởi Tạo Dự Án

### Bước 1: Di Chuyển Vào Thư Mục Dự Án

```bash
cd my-project
```

### Bước 2: Chạy Lệnh Init

```bash
heraspec init
```

Lệnh này sẽ tạo:

- Thư mục `heraspec/` với cấu trúc đầy đủ
- File `AGENTS.heraspec.md` tại thư mục gốc (cho AI tools)
- Các file template (`project.md`, `config.yaml`)

**Lưu ý quan trọng:**
- Nếu đã init trước đó, chạy lại `heraspec init` sẽ **cập nhật** `AGENTS.heraspec.md` với template mới nhất (bao gồm Skills System instructions)
- Các file `project.md` và `config.yaml` sẽ **không bị ghi đè** nếu đã tồn tại (để bảo vệ nội dung bạn đã chỉnh sửa)
- **Skills**: `heraspec init` chỉ tạo thư mục `heraspec/skills/` và `README.md`. Skills **KHÔNG được tự động copy** vào project. Bạn cần tự tạo hoặc copy skills vào `heraspec/skills/` khi cần sử dụng (xem phần [Skills System](#skills-system) để biết cách thêm skills)
- Để cập nhật template mới nhất, chỉ cần chạy lại: `heraspec init`

### Bước 3: Cập Nhật Thông Tin Dự Án

Mở `heraspec/project.md` và điền thông tin:

```markdown
# HeraSpec Project

## Overview
Mô tả dự án của bạn ở đây.

## Project Types
- wordpress-plugin
- perfex-module

## Tech Stack
- PHP 8.1
- WordPress 6.0
- Laravel 10

## Conventions
- Code style: PSR-12
- Naming: camelCase cho functions, PascalCase cho classes
```

## Tạo Change Đầu Tiên

### Cách 1: Yêu Cầu AI Tạo

Hỏi AI assistant của bạn:

```
Tạo một HeraSpec change để thêm xác thực hai yếu tố (2FA) 
cho WordPress plugin và Perfex module.
```

**Hoặc yêu cầu AI tự động đọc project.md và tạo changes:**

```
Đọc heraspec/project.md và tạo các HeraSpec change cho tất cả 
tính năng được đề cập trong phần Overview/Features/Roadmap.
```

```
Dựa trên mô tả trong heraspec/project.md, hãy tạo các HeraSpec changes 
để triển khai các tính năng cần thiết theo từng phase/phần.
```

**Prompt mẫu chi tiết hơn:**

```
Hãy làm theo các bước sau:
1. Đọc và phân tích heraspec/project.md
2. Xác định các tính năng/chức năng cần xây dựng
3. Với mỗi tính năng, tạo một HeraSpec change riêng biệt
4. Mỗi change cần có:
   - proposal.md: Mô tả rõ mục đích và phạm vi
   - tasks.md: Nhóm theo project type và skill
   - specs/: Delta specs với Meta section đúng project type/stack
5. Đảm bảo tuân theo conventions trong project.md
```

AI sẽ tự động tạo:

```
heraspec/changes/add-two-factor-auth/
  ├── proposal.md       # Đề xuất thay đổi
  ├── tasks.md          # Danh sách công việc
  └── design.md         # Thiết kế kỹ thuật (tùy chọn)

heraspec/specs/add-two-factor-auth/  # Delta specs (KHÔNG nằm trong changes/)
  ├── wordpress/plugin-core.md
  └── crm/perfex/modules-core.md
```

### Cách 2: Tạo Thủ Công

Bạn cũng có thể tạo thủ công:

```bash
mkdir -p heraspec/changes/add-two-factor-auth
mkdir -p heraspec/specs/add-two-factor-auth
touch heraspec/changes/add-two-factor-auth/proposal.md
touch heraspec/changes/add-two-factor-auth/tasks.md
# Delta specs được tạo trong heraspec/specs/add-two-factor-auth/ (KHÔNG phải trong changes/)
```

## Quy Trình Làm Việc

### 1. Tạo Change (Create)

- AI hoặc bạn tạo thư mục change
- Viết proposal.md mô tả mục đích và phạm vi
- Tạo tasks.md với danh sách công việc
- Viết delta specs trong `specs/`

### 2. Tinh Chỉnh Specs (Refine)

- Xem lại delta specs: `heraspec show add-two-factor-auth`
- Yêu cầu AI chỉnh sửa specs nếu cần
- Validate: `heraspec validate add-two-factor-auth`
- **Lưu ý**: Delta specs nằm trong `heraspec/specs/<change-name>/`, không sửa source specs trực tiếp

### 3. Phê Duyệt (Approve)

Khi bạn hài lòng với specs, thông báo cho AI:

```
Specs đã được phê duyệt. Bắt đầu implement.
```

Hoặc đơn giản:

```
OK, bắt đầu làm.
```

### 4. Triển Khai (Implement)

- AI hoặc bạn làm theo tasks.md
- Đánh dấu task hoàn thành: `- [x]` thay vì `- [ ]`
- Kiểm tra progress: `heraspec show add-two-factor-auth`

### 5. Lưu Trữ (Archive)

Khi hoàn thành:

```bash
heraspec archive add-two-factor-auth --yes
```

Lệnh này sẽ:

- Merge delta specs vào source specs
- Di chuyển change folder vào `archives/` với prefix ngày tháng
- Cập nhật source of truth specs
- **Parallel Merge Safety**: Kiểm tra fingerprint để chặn việc vô tình ghi đè lên những thay đổi mà agent khác đang làm song song (Xem lệnh `heraspec sync`).
- **Tự động lưu Memory**: Trích xuất nội dung `proposal.md` và ghi nhận thành một Observation trong Memory DB, đồng thời tự động tối ưu hóa cấu hình bộ nhớ.

### 6. Tạo Tài Liệu Sản Phẩm (Generate Documentation)

Sau khi có đủ specs, tạo tài liệu mô tả sản phẩm:

```bash
heraspec make docs                    # Mặc định dùng chatgpt
heraspec make docs --agent claude     # Chỉ định agent
```

Output: `documentation/product-documentation.txt` - Tài liệu mô tả tính năng cho end-users.

### 7. Tạo Test Cases (Generate Tests)

Tạo test cases từ specs:

```bash
heraspec make test                    # Unit tests (mặc định)
heraspec make test --type integration # Integration tests
heraspec make test --type e2e         # E2E tests
```

Output: Test files trong `tests/<type>/` - Skeleton tests cần implement logic.

### 8. Đề Xuất Tính Năng (Feature Suggestions)

Phân tích project và đề xuất features mới:

```bash
heraspec suggest
```

Output: `heraspec/suggestions/feature-suggestions.md` - Danh sách đề xuất với integration points.

## Các Lệnh CLI

### `heraspec init [path]`

Khởi tạo HeraSpec trong dự án.

```bash
heraspec init              # Khởi tạo tại thư mục hiện tại
heraspec init ./subdir     # Khởi tạo tại subdir
```

### `heraspec list`

Liệt kê các changes hoặc specs.

```bash
heraspec list              # Liệt kê changes
heraspec list --specs      # Liệt kê specs
heraspec list --changes    # Liệt kê changes (mặc định)
```

Ví dụ output:

```
Active changes:
──────────────────────────────────────────────────
  • add-two-factor-auth
  • improve-user-dashboard

Specs:
──────────────────────────────────────────────────
  • global
  • wordpress/plugin-core
  • crm/perfex/modules-core
```

### `heraspec show <item-name>`

Hiển thị chi tiết change hoặc spec.

```bash
heraspec show add-two-factor-auth    # Xem change
heraspec show wordpress/plugin-core  # Xem spec
```

Hiển thị:

- Proposal (đề xuất)
- Tasks (công việc)
- Design (thiết kế, nếu có)
- Delta specs

### `heraspec validate <item-name>`

Kiểm tra tính hợp lệ của change hoặc spec.

```bash
heraspec validate add-two-factor-auth
heraspec validate wordpress/plugin-core --strict
```

Output ví dụ:

```
Validation Report: add-two-factor-auth

────────────────────────────────────────────────────────
✓ Valid

Warnings:
  • Requirement "User Authentication" has no scenarios
```

### `heraspec archive <change-name> [--yes]`

Lưu trữ change đã hoàn thành và merge specs.

```bash
heraspec archive add-two-factor-auth --yes
```

**Lưu ý**: 
- Không dùng `--yes` sẽ yêu cầu xác nhận.
- **Parallel Merge Safety**: Khi chạy lệnh `archive`, HeraSpec sẽ xác minh mã hash (fingerprint) nguyên bản của các requirement bị `MODIFIED` hoặc `REMOVED` để đảm bảo không có agent/người nào khác đã thay đổi nội dung đó ở source spec gốc trong lúc bạn đang làm việc. Nếu phát hiện xung đột, quá trình lưu trữ sẽ bị hủy và yêu cầu bạn chạy `heraspec sync`.

### `heraspec sync <change-name>`

Đồng bộ change với source spec gốc để giải quyết Parallel Merge Conflicts.

```bash
heraspec sync add-two-factor-auth
```

**Chức năng:**
- So sánh các fingerprint của delta spec so với source spec hiện tại.
- Nếu source spec đã bị người khác cập nhật, lệnh này sẽ cập nhật các fingerprint cục bộ của bạn để khớp với nội dung source mới.
- Hệ thống sẽ cảnh báo bạn nên xem lại delta spec một lần nữa để đảm bảo các sửa đổi của bạn vẫn chính xác và hợp lý với source mới trước khi thử chạy lại `archive`.

### `heraspec skill list`

Liệt kê tất cả skills có sẵn trong dự án.

```bash
heraspec skill list
```

Output ví dụ:
```
Available Skills:

════════════════════════════════════════════════════════════

📦 perfex-module:
   • module-codebase
   • module-registration
   • permission-group

🔧 Cross-cutting skills:
   • ui-ux
   • documents
   • content-optimization
   • unit-test
   • integration-test
   • e2e-test
   • suggestion
```

### `heraspec skill show <skill-name> [--project-type <type>]`

Hiển thị chi tiết về một skill.

```bash
# Project-specific skill
heraspec skill show module-codebase --project-type perfex-module

# Cross-cutting skill
heraspec skill show ui-ux
```

Hiển thị:
- Purpose và khi nào sử dụng
- Quy trình từng bước
- Input/Output
- Templates và scripts có sẵn
- Full content của skill.md

### `heraspec skill add <skill-name> [--project-type <type>]`

Thêm một skill mặc định vào project từ HeraSpec templates.

```bash
# Cross-cutting skill
heraspec skill add ui-ux
heraspec skill add unit-test
heraspec skill add integration-test
heraspec skill add e2e-test
heraspec skill add suggestion

# Project-specific skill
heraspec skill add module-codebase --project-type perfex-module
```

**Chức năng:**
- Copy skill template từ HeraSpec core vào project
- Tự động tạo cấu trúc thư mục (skill.md, templates/, scripts/, examples/)
- Copy resources nếu có (scripts, templates, data)

**Lưu ý:**
- Skill sẽ được tạo trong `heraspec/skills/<skill-name>/` (cross-cutting)
- Hoặc `heraspec/skills/<project-type>/<skill-name>/` (project-specific)
- Nếu skill đã tồn tại, lệnh sẽ báo lỗi

**Cách Thêm Skills Vào Dự Án:**

1. **Xem danh sách skills có sẵn trong HeraSpec core:**
   Khi bạn chạy `heraspec skill add` với tên skill không hợp lệ, lệnh sẽ hiển thị tất cả skills có sẵn:
   ```bash
   heraspec skill add invalid-skill-name
   # Output:
   # Skill template "invalid-skill-name" not found
   #
   # Available skills:
   #   - ui-ux (cross-cutting)
   #   - documents (cross-cutting)
   #   - unit-test (cross-cutting)
   #   - ux-element (projectType: wordpress)
   #   - module-codebase (projectType: perfex-module)
   ```

2. **Thêm cross-cutting skills:**
   Các skills này hoạt động với mọi loại project:
   ```bash
   # Thêm UI/UX skill (bao gồm scripts, templates, và data)
   heraspec skill add ui-ux
   
   # Thêm test skills
   heraspec skill add unit-test
   heraspec skill add integration-test
   heraspec skill add e2e-test
   
   # Thêm các cross-cutting skills khác
   heraspec skill add documents
   heraspec skill add content-optimization
   heraspec skill add suggestion
   ```

3. **Thêm project-specific skills:**
   Các skills này dành riêng cho một loại project cụ thể:
   ```bash
   # Thêm Perfex module skill
   heraspec skill add module-codebase --project-type perfex-module

   # Thêm WordPress UX Element skill
   heraspec skill add ux-element --project-type wordpress

   # Thêm WordPress Plugin Check skill
   heraspec skill add plugin-check --project-type wordpress
   # Lưu ý: Yêu cầu cài plugin "Plugin Check (PCP)" và chỉnh DB_HOST='127.0.0.1' trong wp-config.php
   ```

4. **Những gì được copy:**
   Lệnh tự động:
   - Copy template `skill.md` vào project
   - Tạo các thư mục chuẩn: `templates/`, `scripts/`, `examples/`
   - Copy các resources bổ sung nếu skill có:
     - **Scripts**: Python scripts, shell scripts, v.v.
     - **Templates**: Code templates, file templates
     - **Data**: CSV files, JSON files, configuration files

5. **Ví dụ: Thêm UI/UX skill:**
   ```bash
   heraspec skill add ui-ux
   ```
   
   Lệnh này tạo ra:
   ```
   heraspec/skills/ui-ux/
   ├── skill.md              # Hướng dẫn skill chính
   ├── scripts/              # Search scripts (tự động copy)
   │   └── search.py
   ├── templates/            # UI templates (tự động copy)
   │   └── ...
   ├── data/                # Design data (tự động copy)
   │   ├── products.csv
   │   ├── styles.csv
   │   ├── charts.csv
   │   └── stacks/
   ├── examples/            # Example files (trống, để bạn thêm examples)
   └── ...
   ```

6. **Xác minh skill đã được thêm:**
   ```bash
   # Liệt kê tất cả skills trong project
   heraspec skill list
   
   # Xem chi tiết skill
   heraspec skill show ui-ux
   ```

7. **Sau khi thêm skill:**
   - Xem lại `skill.md` để hiểu mục đích và quy trình của skill
   - Kiểm tra thư mục `scripts/` để xem các automation scripts
   - Xem lại `templates/` để tìm các templates có thể tái sử dụng
   - Thêm examples của bạn vào thư mục `examples/`
   - Sử dụng skill trong tasks: `(skill: ui-ux)`

**Lưu ý quan trọng:**
- Skills được copy từ HeraSpec core templates, nên bạn có phiên bản mới nhất
- Nếu skill có resources (scripts, templates, data), chúng sẽ được tự động copy
- Bạn có thể tùy chỉnh skill sau khi đã thêm vào dự án
- Skill đi theo từng dự án, nên mỗi dự án cần thêm skill riêng biệt

### `heraspec skill update <skill-name>`

Cập nhật một skill đã có bằng phiên bản mới nhất từ HeraSpec templates.

```bash
heraspec skill update ux-element --project-type wordpress
```

**Chức năng:**
- Xóa phiên bản skill cũ trong dự án của bạn
- Copy lại các template, script và `skill.md` mới nhất từ HeraSpec core
- **Lưu ý**: Lệnh này sẽ ghi đè lên bất kỳ thay đổi thủ công nào bạn đã thực hiện trong thư mục `skill.md`, `templates/`, hoặc `scripts/` của skill đó.

### `heraspec skill repair`

Sửa cấu trúc skills để khớp với chuẩn HeraSpec.

```bash
heraspec skill repair
```

**Chức năng:**
- Kiểm tra cấu trúc thư mục skills
- Tạo `skill.md` nếu thiếu
- Tạo các thư mục chuẩn (templates/, scripts/, examples/)
- Đảm bảo skills tuân theo cấu trúc HeraSpec

### `heraspec restore <archive-name> [--yes]`

Khôi phục một archive về thành active change.

```bash
heraspec restore 2025-01-15-add-two-factor-auth --yes
```

**Lưu ý:**
- Archive name bao gồm date prefix (YYYY-MM-DD-change-name)
- Change sẽ được khôi phục về `changes/` với tên không có date prefix
- Spec changes đã được merge sẽ vẫn còn trong source specs (không tự động revert)
- Nếu change đã tồn tại, lệnh sẽ báo lỗi

**Ví dụ:**
```bash
# Xem danh sách archives
ls heraspec/changes/archives/
# → 2025-01-15-add-two-factor-auth
# → 2025-01-20-add-search-feature

# Khôi phục archive
heraspec restore 2025-01-15-add-two-factor-auth --yes
# → Change "add-two-factor-auth" được khôi phục về changes/
```

### `heraspec view`

Hiển thị dashboard tương tác.

```bash
heraspec view
```

Hiển thị tổng quan về changes và specs.

### `heraspec helper`

Hiển thị hướng dẫn sử dụng nhanh, các prompt mẫu, và workflow.

```bash
heraspec helper
```

Lệnh này hiển thị:
- Quick Start: Các bước khởi đầu nhanh
- Các lệnh CLI: Danh sách tất cả lệnh với mô tả
- Prompt mẫu: Các prompt ví dụ để yêu cầu AI tạo changes
- Workflow: Quy trình làm việc 5 bước
- Tips & Best Practices: Các mẹo và thực hành tốt nhất

**Ví dụ output:**
```
📚 HeraSpec Helper - Hướng Dẫn Sử Dụng

🚀 Quick Start
1. Khởi tạo dự án mới:
   cd my-project
   heraspec init

2. Cấu hình project.md:
   Chỉnh sửa heraspec/project.md với thông tin dự án của bạn

...

💬 Prompt Mẫu Cho AI
1. Tạo Change Đơn Giản:
   "Tạo một HeraSpec change để thêm tính năng xác thực 2FA"
   
...
```

## Định Dạng Spec

Spec mô tả yêu cầu của hệ thống. Cấu trúc cơ bản:

```markdown
# Spec: Web Backend – Core API

## Meta
- Project type: web-backend
- Domain: api-core
- Stack: Laravel|Node|PHP

## Purpose
Mục đích của spec này. Mô tả ngắn gọn chức năng cần xây dựng.

## Requirements

### Requirement: User Authentication
Hệ thống PHẢI cấp token khi đăng nhập thành công.

#### Scenario: Credentials hợp lệ
- GIVEN một user đã đăng ký
- WHEN họ submit credentials hợp lệ
- THEN một JWT token được trả về

#### Scenario: Credentials không hợp lệ
- GIVEN một user đã đăng ký
- WHEN họ submit credentials sai
- THEN trả về lỗi 401 Unauthorized
```

### Quy Tắc

1. **Meta Section**: Bắt buộc phải có
   - Project type: Loại dự án
   - Domain: Lĩnh vực (tùy chọn)
   - Stack: Công nghệ sử dụng (tùy chọn)

2. **Purpose**: Mô tả ngắn gọn mục đích

3. **Requirements**: 
   - Mỗi requirement phải có tên và mô tả
   - Nên có ít nhất một scenario
   - Sử dụng MUST/SHALL trong mô tả

4. **Scenarios**: 
   - Sử dụng GIVEN/WHEN/THEN
   - Mô tả rõ ràng các bước

## Định Dạng Delta Spec

Delta spec mô tả thay đổi so với spec gốc. Cấu trúc:

```markdown
# Delta: Web Backend – Core API (add-two-factor-auth)

## ADDED Requirements

### Requirement: Two-Factor Authentication
Hệ thống PHẢI yêu cầu yếu tố thứ hai khi đăng nhập.

#### Scenario: OTP được yêu cầu
- WHEN user submit credentials hợp lệ
- THEN một OTP challenge được yêu cầu
- AND user phải nhập OTP để hoàn tất đăng nhập

## MODIFIED Requirements

### Requirement: User Authentication
**Trước đây**: Hệ thống chỉ yêu cầu username/password.

**Bây giờ**: Hệ thống yêu cầu username/password và OTP.

#### Scenario: Đăng nhập với 2FA
- GIVEN user đã bật 2FA
- WHEN user submit credentials hợp lệ
- THEN OTP được gửi đến email/phone
- AND user phải nhập OTP để đăng nhập

## REMOVED Requirements

### Requirement: Basic Authentication Only
Tính năng đăng nhập chỉ bằng username/password đã bị loại bỏ.
```

### Các Loại Delta

- **ADDED**: Thêm requirement mới
- **MODIFIED**: Sửa đổi requirement hiện có (phải có đầy đủ nội dung mới)
- **REMOVED**: Xóa requirement

## Định Dạng Tasks

Tasks được nhóm theo project type và skill:

```markdown
# Tasks

## 1. WordPress plugin – 2FA Settings (projectType: wordpress-plugin, skill: admin-settings-page)
- [ ] 1.1 Tạo trang settings trong admin
- [ ] 1.2 Thêm option để bật/tắt 2FA
- [ ] 1.3 Lưu cấu hình vào database
- [x] 1.4 Test trang settings

## 2. WordPress plugin – OTP Generation (projectType: wordpress-plugin, skill: rest-endpoint)
- [ ] 2.1 Tạo REST endpoint để generate OTP
- [ ] 2.2 Validate OTP khi user submit
- [ ] 2.3 Gửi OTP qua email

## 3. Perfex module – Category Management (projectType: perfex-module, skill: module-codebase)
- [ ] 3.1 Tạo cấu trúc module
- [ ] 3.2 Cấu hình module registration
- [ ] 3.3 Tạo database tables

## 4. UI/UX – Admin Interface (skill: ui-ux)
- [ ] 4.1 Thiết kế color palette
- [ ] 4.2 Tạo component styles
- [ ] 4.3 Implement responsive design

## 5. Documents – User Guide (skill: documents)
- [ ] 5.1 Viết technical documentation
- [ ] 5.2 Tạo user guide
- [ ] 5.3 Generate API docs
```

### Quy Tắc Tasks

1. **Nhóm theo project type và skill**: Mỗi nhóm có tiêu đề rõ ràng
2. **Skill tag bắt buộc**: Mỗi task group phải có skill tag để agent biết cách implement
3. **Đánh số**: Sử dụng số thứ tự (1.1, 1.2, 2.1, v.v.)
4. **Checkbox**: 
   - `- [ ]` = chưa làm
   - `- [x]` = đã hoàn thành
5. **Mô tả rõ ràng**: Mỗi task phải có mô tả cụ thể

### Skills System

**Lưu ý về Skills:**
- `heraspec init` chỉ tạo thư mục `heraspec/skills/` và `README.md`
- Skills **KHÔNG được tự động copy** vào project từ HeraSpec core
- Bạn cần **tự tạo hoặc copy** skills vào `heraspec/skills/` khi cần sử dụng
- Skills templates có sẵn trong HeraSpec core (`src/core/templates/skills/`) nhưng cần được copy thủ công vào project

**Cách thêm Skills vào project:**

1. **Copy từ HeraSpec core templates** (nếu đang phát triển HeraSpec):
   ```bash
   # Copy skill template vào project
   cp -r /path/to/HeraSpec/src/core/templates/skills/ui-ux-skill.md \
         heraspec/skills/ui-ux/skill.md
   
   # Copy scripts và templates nếu có
   cp -r /path/to/HeraSpec/src/core/templates/skills/scripts \
         heraspec/skills/ui-ux/
   ```

2. **Tạo skill mới** theo cấu trúc:
   ```
   heraspec/skills/
   ├── <project-type>/          # Cho project-specific skills
   │   └── <skill-name>/
   │       ├── skill.md
   │       ├── templates/
   │       ├── scripts/
   │       └── examples/
   └── <skill-name>/            # Cho cross-cutting skills
       ├── skill.md
       ├── templates/
       ├── scripts/
       └── examples/
   ```

3. **Xem skills có sẵn**:
   ```bash
   heraspec skill list              # Liệt kê skills trong project
   heraspec skill show <skill-name> # Xem chi tiết skill
   ```

**Quan trọng**: Khi task có skill tag, AI agent sẽ tự động:

1. **Tìm skill folder**:
   - Project-specific: `heraspec/skills/<project-type>/<skill-name>/`
   - Cross-cutting: `heraspec/skills/<skill-name>/`

2. **Đọc skill.md**:
   - Hiểu mục đích và quy trình
   - Biết input/output cần thiết
   - Tuân theo giọng điệu và quy tắc

3. **Sử dụng resources**:
   - Chạy scripts từ `scripts/` folder
   - Sử dụng templates từ `templates/` folder
   - Tham khảo examples từ `examples/` folder

4. **Implement theo skill.md**:
   - Follow step-by-step process
   - Apply naming conventions
   - Respect limitations

**Ví dụ**:
- Task: `(projectType: perfex-module, skill: module-codebase)`
- Agent đọc: `heraspec/skills/perfex-module/module-codebase/skill.md`
- Agent làm theo: Quy trình 5 bước trong skill.md
- Agent sử dụng: Templates và scripts trong skill folder

**Ví dụ đặc biệt - UI/UX skill**:
- Task: `(skill: ui-ux)`
- Agent đọc: `heraspec/skills/ui-ux/skill.md`
- Agent PHẢI chạy search scripts trước khi implement:
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa" --domain product
  python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal" --domain style
  python3 heraspec/skills/ui-ux/scripts/search.py "layout responsive" --stack html-tailwind
  ```
- Agent tổng hợp kết quả search
- Agent implement với colors, fonts, styles từ search results
- Agent verify với pre-delivery checklist

**Lưu ý**: `heraspec skill list` và `heraspec skill show` chỉ hiển thị skills **đã có trong project** (`heraspec/skills/`), không phải tất cả skills có sẵn trong HeraSpec core. Để sử dụng skills, bạn cần thêm chúng vào project bằng `heraspec skill add <skill-name>`.

**Các skills có sẵn trong HeraSpec core:**
- **Cross-cutting**: `ui-ux`, `documents`, `content-optimization`, `unit-test`, `integration-test`, `e2e-test`, `suggestion`
- **Project-specific**: `module-codebase` (perfex-module), và nhiều skills khác cho từng project type

**Thêm skills vào project:**
```bash
# Thêm cross-cutting skills
heraspec skill add ui-ux
heraspec skill add unit-test
heraspec skill add integration-test
heraspec skill add e2e-test
heraspec skill add suggestion

# Thêm project-specific skills
heraspec skill add module-codebase --project-type perfex-module
```

**Setup UI/UX skill**: Xem [UI_UX_SKILL_SETUP.md](../docs/UI_UX_SKILL_SETUP.md) để setup UI/UX skill với search scripts.

## Ví Dụ Thực Tế

### Ví Dụ 1: Thêm Tính Năng Tìm Kiếm

**1. Tạo Change:**

```bash
# AI tạo hoặc bạn tạo thủ công
mkdir -p heraspec/changes/add-search-feature
mkdir -p heraspec/specs/add-search-feature  # Delta specs ở đây
```

**2. Viết Proposal (`proposal.md`):**

```markdown
# Change Proposal: add-search-feature

## Purpose
Thêm tính năng tìm kiếm cho WordPress plugin, cho phép user tìm kiếm posts theo từ khóa, category, và date range.

## Scope
- WordPress plugin: Thêm search form và results page
- Backend API: Thêm search endpoint

## Project Types
- wordpress-plugin
- backend-api

## Impact
- Ảnh hưởng đến: plugin core, admin UI, API routes
```

**3. Viết Delta Spec:**

```markdown
# Delta: WordPress Plugin Core (add-search-feature)

## ADDED Requirements

### Requirement: Search Functionality
Plugin PHẢI cung cấp tính năng tìm kiếm posts.

#### Scenario: Tìm kiếm theo từ khóa
- GIVEN user đang ở trang tìm kiếm
- WHEN họ nhập từ khóa "hello" và click Search
- THEN hiển thị tất cả posts có chứa "hello" trong title hoặc content

#### Scenario: Tìm kiếm theo category
- GIVEN user đang ở trang tìm kiếm
- WHEN họ chọn category "News" và click Search
- THEN hiển thị tất cả posts trong category "News"
```

**4. Viết Tasks:**

```markdown
## 1. WordPress plugin – Search Form (projectType: wordpress-plugin, skill: shortcode)
- [ ] 1.1 Tạo shortcode [search_form]
- [ ] 1.2 Thiết kế UI cho form (input, dropdown, button)
- [ ] 1.3 Xử lý form submission

## 2. WordPress plugin – Search Results (projectType: wordpress-plugin, skill: template-part)
- [ ] 2.1 Tạo template để hiển thị results
- [ ] 2.2 Pagination cho results
- [ ] 2.3 Empty state khi không có kết quả
```

**5. Implement và Archive:**

```bash
# Sau khi hoàn thành
heraspec archive add-search-feature --yes
```

### Ví Dụ 2: Tạo Changes Tự Động Từ project.md

Giả sử bạn có file `heraspec/project.md` mô tả dự án:

```markdown
# HeraSpec Project

## Overview
Xây dựng hệ thống quản lý đơn hàng với WordPress plugin và Perfex CRM module.

## Project Types
- wordpress-plugin
- perfex-module

## Tech Stack
- PHP 8.1
- WordPress 6.0
- Perfex CRM 3.0
- MySQL 8.0

## Features cần xây dựng
1. Quản lý đơn hàng (WordPress plugin)
2. Tích hợp thanh toán (Perfex module)
3. Báo cáo doanh thu (WordPress plugin)
4. Đồng bộ dữ liệu giữa WordPress và Perfex
```

**Yêu cầu AI:**

```
Đọc heraspec/project.md và tạo các HeraSpec changes cho tất cả tính năng 
được liệt kê trong phần Features. Mỗi tính năng là một change riêng.
```

**AI sẽ tự động:**

1. **Đọc project.md** và hiểu context
2. **Phân tích** project types, tech stack
3. **Tạo 4 changes:**
   - `add-order-management` (WordPress plugin)
   - `add-payment-integration` (Perfex module)
   - `add-revenue-reports` (WordPress plugin)
   - `add-data-sync` (Multi-stack)

4. **Mỗi change có:**
   - `proposal.md` - Mô tả tính năng dựa trên project.md
   - `tasks.md` - Tasks với đúng project type và skills
   - `specs/` - Delta specs với Meta section đúng

**Kết quả:**

```
heraspec/
├── project.md
└── changes/
    ├── add-order-management/
    │   ├── proposal.md  # Dựa trên Features #1 từ project.md
    │   ├── tasks.md
    │   └── specs/wordpress/plugin-core.md
    ├── add-payment-integration/
    │   ├── proposal.md  # Dựa trên Features #2
    │   ├── tasks.md
    │   └── specs/crm/perfex/modules-core.md
    └── ...
```

## Tích Hợp AI

### Cách AI Tự Động Tạo Changes Dựa Trên project.md

Khi bạn có một file `project.md` mô tả chi tiết dự án, AI có thể tự động phân tích và tạo các changes cần thiết. Đây là cách yêu cầu:

#### Prompt Cơ Bản

```
Đọc heraspec/project.md và tạo các HeraSpec change cho tất cả tính năng 
được mô tả trong đó.
```

#### Prompt Chi Tiết (Khuyên Dùng)

```
Hãy làm theo quy trình sau để tạo HeraSpec changes dựa trên project.md:

1. **Đọc và phân tích project.md:**
   - Đọc file heraspec/project.md
   - Xác định các project types (WordPress plugin, Perfex module, etc.)
   - Xác định tech stack được sử dụng
   - Xác định conventions và standards

2. **Phân tích tính năng:**
   - Liệt kê tất cả tính năng/chức năng cần xây dựng
   - Xác định tính năng nào thuộc project type nào
   - Xác định tính năng nào liên quan đến nhau (có thể gom vào 1 change)

3. **Tạo changes:**
   - Với mỗi tính năng (hoặc nhóm tính năng liên quan), tạo một change riêng
   - Tên change: dùng format kebab-case, verb-led (add-, create-, implement-)
   - Ví dụ: add-user-authentication, create-payment-gateway, implement-api-endpoints

4. **Mỗi change cần có:**
   - **proposal.md:**
     * Purpose: Mục đích của tính năng
     * Scope: Phạm vi (project types nào sẽ bị ảnh hưởng)
     * Project Types: Liệt kê project types liên quan
     * Impact: Các phần của hệ thống sẽ bị ảnh hưởng
   
   - **tasks.md:**
     * Nhóm tasks theo project type và skill
     * Mỗi task phải có format: (projectType: xxx, skill: xxx)
     * Đánh số rõ ràng (1.1, 1.2, 2.1, etc.)
   
   - **specs/**: Delta specs
     * Tạo spec files trong cấu trúc phù hợp với project type
     * Mỗi spec phải có Meta section với project type, domain, stack
     * Sử dụng format: ADDED Requirements

5. **Tuân theo conventions:**
   - Áp dụng coding standards từ project.md
   - Sử dụng đúng project types và skills
   - Đảm bảo consistency với tech stack đã định

Bắt đầu bằng cách đọc heraspec/project.md và tạo changes.
```

#### Prompt Cho Từng Phase/Roadmap

Nếu project.md có roadmap chia theo phase:

```
Dựa trên heraspec/project.md, hãy tạo HeraSpec changes cho Phase 1 
(theo roadmap trong file). Mỗi tính năng trong Phase 1 là một change riêng.
```

#### Ví Dụ Prompt Cụ Thể

```
Hãy đọc heraspec/project.md và:

1. Xác định tất cả tính năng cần xây dựng
2. Tạo một change proposal cho mỗi tính năng chính
3. Đối với tính năng lớn, chia thành nhiều changes nhỏ hơn
4. Đảm bảo mỗi change có đầy đủ proposal, tasks, và delta specs

Tính năng ưu tiên cao nên được tạo trước.
```

#### Lưu Ý Quan Trọng

- **AI sẽ tự động đọc project.md** nếu bạn yêu cầu
- **AI sẽ phân tích** project types, tech stack, và conventions
- **AI sẽ tạo changes** phù hợp với structure và format
- **Bạn nên review** changes trước khi approve để implement

### Cursor / Windsurf / Copilot Chat

Các công cụ này tự động đọc `AGENTS.heraspec.md`. Bạn chỉ cần:

1. Yêu cầu AI: "Tạo một HeraSpec change để..."
2. AI tự động tạo change folder và files
3. Refine: "Thêm scenario cho requirement X"
4. Implement: "Apply the HeraSpec change add-feature-name"
5. Archive: "Archive the change add-feature-name"

### Claude Desktop / Antigravity

Các công cụ này cũng hỗ trợ AGENTS.md:

1. Đảm bảo file `AGENTS.heraspec.md` đã tồn tại ở thư mục gốc.
2. Đặt câu hỏi cho AI theo đúng định dạng.
3. AI sẽ tuân theo workflow được định nghĩa trong file `AGENTS.heraspec.md`.

### Soft Slash Commands (Agent Triggers)

Mặc dù HeraSpec không can thiệp trực tiếp vào giao diện (UI dropdown) của IDE để tạo các lệnh có sẵn (như `/goal` hay `/schedule`), bạn vẫn có thể cấu hình để AI Agent hiểu các lệnh slash commands này như những tác vụ chạy terminal.

Trong file `AGENTS.heraspec.md`, đã có sẵn phần `## ⚡ Slash Commands (Agent Triggers)`. Khi bạn gõ các lệnh như `/heraspec validate ...`, `/sync`, hoặc `/skill ui-ux` vào khung chat, AI Agent sẽ đọc quy tắc này và ngay lập tức chạy lệnh terminal tương ứng thay vì trả lời theo kiểu giao tiếp thông thường.

Bạn hoàn toàn có thể tự bổ sung thêm các lệnh tắt (shortcut commands) mới vào `AGENTS.heraspec.md` để phù hợp với dự án của mình!

### Cách Gửi Prompt Cho AI Kèm Skill

Để có kết quả tốt nhất khi yêu cầu AI triển khai một tính năng cụ thể bằng cách sử dụng một skill, hãy cung cấp các yêu cầu chi tiết và nêu rõ tên skill.

**Ví dụ về UX Builder Element:**

Prompt:
```
Dựa vào skill `ux-element`, hãy tạo một element 'Countdown' cho plugin `PolyUtilities`.

Yêu cầu:
1. Cho phép thiết lập thời điểm countdown (Countdown To).
2. Tùy chọn định dạng hiển thị (ví dụ: Ngày:Giờ:Phút:Giây).
3. Bao gồm trường Heading (Tiêu đề) tùy chỉnh.
4. Bao gồm trường 'Expired Message' (Thông điệp khi hết hạn) để hiển thị khi thời gian kết thúc.

Task: `(projectType: wordpress, skill: ux-element)`
```

AI sẽ tự động tìm skill trong thư mục `heraspec/skills/wordpress/ux-element/`, đọc file `skill.md`, và sử dụng các template có sẵn để đảm bảo element tuân theo các tiêu chuẩn kỹ thuật và hỗ trợ xem trước thời gian thực.

### Workflow Mẫu

**Bước 1 - Tạo Change:**

```
Bạn: Tạo một HeraSpec change để thêm tính năng export data cho Perfex module.

AI: Tôi sẽ tạo change proposal cho export data.
     *Tạo heraspec/changes/add-export-data/*
```

**Bước 2 - Refine:**

```
Bạn: Thêm requirement về export PDF format.

AI: Tôi sẽ cập nhật delta spec với requirement export PDF.
     *Cập nhật heraspec/changes/add-export-data/specs/perfex/modules-core.md*
```

**Bước 3 - Validate:**

```bash
heraspec validate add-export-data
```

**Bước 4 - Approve:**

```
Bạn: Specs đã được phê duyệt. Bắt đầu implement.
```

**Bước 5 - Implement:**

```
AI: Tôi sẽ implement các tasks trong add-export-data change.
     *Làm từng task, đánh dấu hoàn thành*
```

**Bước 6 - Archive:**

```bash
heraspec archive add-export-data --yes
```

## Lưu Ý Quan Trọng

### ✅ Nên Làm

- Luôn tạo change trước khi implement
- Delta specs nằm trong `heraspec/specs/<change-name>/` (KHÔNG trong changes folder)
- Validate specs trước khi implement
- Đánh dấu tasks đã hoàn thành
- Archive changes sau khi hoàn thành

### ❌ Không Nên

- Không sửa trực tiếp source specs (trong `specs/`, ngoại trừ delta specs trong `specs/<change-name>/`)
- Không tạo specs trong `changes/<slug>/specs/` (specs phải ở `specs/<slug>/`)
- Không bỏ qua bước refine specs
- Không archive khi chưa hoàn thành tasks
- Không tạo change mà không có proposal

## Xử Lý Lỗi

### Lỗi: "No HeraSpec changes directory found"

```bash
# Chạy init
heraspec init
```

### Lỗi: "Change not found"

```bash
# Kiểm tra tên change
heraspec list

# Hoặc xem tất cả folders trong changes/
ls heraspec/changes/
```

### Lỗi Validation

```bash
# Xem chi tiết lỗi
heraspec validate <change-name>

# Sửa lỗi trong files
# Validate lại
heraspec validate <change-name>
```

## Best Practices

1. **Specs First**: Luôn viết specs trước khi code
2. **Small Changes**: Chia nhỏ changes thành các phần có thể quản lý
3. **Clear Proposals**: Viết proposal rõ ràng, mô tả đầy đủ
4. **Complete Tasks**: Mỗi task nên hoàn thành một mục tiêu cụ thể
5. **Regular Validation**: Validate thường xuyên để phát hiện lỗi sớm
6. **Generate Tests**: Sử dụng `heraspec make test` để tạo test cases từ specs
7. **Use Test Skills**: Implement tests theo hướng dẫn trong skills (unit-test, integration-test, e2e-test)
8. **Generate Documentation**: Sử dụng `heraspec make docs` để tạo tài liệu sản phẩm
9. **Feature Suggestions**: Sử dụng `heraspec suggest` để tìm cơ hội cải thiện project

## Tài Liệu Tham Khảo

- [ARCHITECTURE.md](ARCHITECTURE.md) - Kiến trúc kỹ thuật
- [PROJECT_TYPES_AND_SKILLS.md](PROJECT_TYPES_AND_SKILLS.md) - Danh sách project types và skills
- [UPDATE_CHECKLIST.md](UPDATE_CHECKLIST.md) - Checklist khi cập nhật HeraSpec source code
- [MEMORY_SYSTEM.md](MEMORY_SYSTEM.md) - Tài liệu chi tiết về Memory System

## Hệ Thống Memory

HeraSpec cung cấp Hệ Thống Memory (Bộ nhớ dự án) để duy trì ngữ cảnh cho AI Agents qua nhiều phiên làm việc.

Tính năng nổi bật:
- **Tự động Index**: Khi chạy `heraspec init`, hệ thống tự động quét và lưu lại bản đồ kiến trúc của dự án.
- **Tối Ưu Token**: Lưu trữ quan sát (observations) để tiết kiệm token khi truy vấn ngữ cảnh dự án.
- **Tính Toán Chi Phí Thực Tế**: Cờ `--discovery-tokens` cho phép theo dõi chính xác lượng Token tiết kiệm được.

Tham khảo đầy đủ tại: [MEMORY_SYSTEM.md](MEMORY_SYSTEM.md)

## Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra lại hướng dẫn này
2. Xem các ví dụ trong tài liệu
3. Validate changes/specs để tìm lỗi
4. Tạo issue trên GitHub repository

---

**Chúc bạn sử dụng HeraSpec hiệu quả!** 🚀

