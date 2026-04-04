---
name: sourcecode-analyzer
description: Phân tích sâu source code theo mô hình đa agent cho kiến trúc, coding style, design pattern, ngôn ngữ, framework, thư viện, cấu trúc module, extension point và khả năng tích hợp. Sử dụng khi agent cần hiểu tối đa codebase trước khi lập kế hoạch feature, refactor, integration, migration, audit hoặc documentation.
projectType: all
---

# Source Code Analyzer (Tiếng Việt)

## Mục tiêu
Tạo báo cáo phân tích kiến trúc và khả năng tích hợp có độ tin cậy cao, dựa trên bằng chứng trực tiếp từ source code.

## Phạm vi
Phân tích:
- Ranh giới kiến trúc và phân lớp
- Stack framework/CMS/runtime và dependency
- Coding style và conventions
- Modules/themes/plugins và extension points
- API surfaces (REST/GraphQL/webhooks/events/CLI/jobs)
- Data layer và mô hình cấu hình
- Bảo mật và vận hành
- Khả năng tích hợp và các ràng buộc

Không:
- Sửa business logic
- Chạy lệnh hủy hoại
- Cài đặt hoặc nâng cấp dependency nếu chưa được yêu cầu

## Đầu ra bắt buộc
Ghi báo cáo vào `_analytics/structure.md` (hoặc đường dẫn do người dùng chỉ định), đúng thứ tự section như trong `Report Template`.

## Quy tắc bằng chứng
Mỗi nhận định quan trọng phải:
- Có bằng chứng cụ thể (đường dẫn file, symbol/class/function, tóm tắt snippet ngắn)
- Gán mức độ tin cậy `High`, `Medium` hoặc `Low`
- Gán loại nhận định:
  - `Observed`: Xác nhận trực tiếp trong source
  - `Inferred`: Suy ra từ nhiều quan sát đã xác thực
  - `Assumed`: Giả định hợp lý nhưng chưa xác thực

Không đưa ra kết luận không có cơ sở.

## Điều phối đa agent
Nếu có subagents, tách song song 4 lane:

1. `Architecture lane`
- Lập bản đồ topology thư mục, layers, modules/plugins/themes
- Xác định entry points và hướng phụ thuộc

2. `Style and design lane`
- Xác định naming conventions, folder conventions, patterns, anti-patterns
- Xác định coding standards và quality gates (lint/test/static check)

3. `Dependency and runtime lane`
- Xác định ngôn ngữ/runtime/framework versions
- Inventory thư viện quan trọng và vai trò

4. `Integration and security lane`
- Lập bản đồ APIs, events/hooks, queues, cron/jobs, webhooks, third-party SDKs
- Đánh giá authN/authZ, input validation, secrets handling và attack surface

Nhiệm vụ của coordinator:
- Chuẩn hóa output của các lane
- Xử lý mâu thuẫn giữa các lane
- Tổng hợp 1 báo cáo cuối cùng có bằng chứng và confidence

Nếu không có subagents, chạy tuần tự theo cùng quy trình lane.

## Workflow

### Step 0 — Knowledge Lookup (Tra cứu kiến thức sẵn có)
Trước khi phân tích toàn bộ, kiểm tra knowledge base đã có sẵn:

1. Kiểm tra `heraspec/knowledge/index.json` có tồn tại trong dự án không
2. Đọc tất cả entries và đối chiếu với dự án hiện tại:
   - Với signal `file-contains`: kiểm tra file tồn tại VÀ chứa chuỗi chỉ định
   - Với signal `directory-exists`: kiểm tra thư mục tồn tại
   - Mỗi signal khớp = +1 điểm match score
3. Nếu `score >= minMatchScore` cho bất kỳ entry nào:
   - Đọc `structure.md` tương ứng từ `heraspec/knowledge/<knowledgePath>/`
   - Sử dụng làm **baseline phân tích** — bỏ qua Steps 1-8 cho các section đã có
   - Chỉ tập trung vào **khác biệt riêng dự án** (custom plugins, configs, .env, custom code)
   - Đầu ra: gộp baseline knowledge + delta riêng dự án thành báo cáo cuối
4. Kiểm tra thêm `heraspec/knowledge/custom/index.json` cho knowledge riêng dự án
5. Nếu không match: tiến hành phân tích đầy đủ từ Step 1

Phân cấp knowledge: `heraspec/knowledge/<category>/<runtime>/<framework>/<cms>/`

### Step 1 - Baseline Metadata
Đọc metadata ở root trước:
- `composer.json`, `composer.lock`
- `package.json`, lockfiles
- `docker*`, `Makefile`, CI configs
- `.env.example`, config directories

Thu thập:
- Language/runtime versions
- Framework/CMS versions
- Build và deployment model

### Step 2 - Repository Topology
Lập bản đồ thư mục chính và trách nhiệm:
- Core/domain/infrastructure boundaries
- Kiến trúc plugin/module/theme
- Shared libraries và cross-cutting concerns
- Bootstrapping và entry points

### Step 3 - Architectural Patterns
Xác định và đánh giá:
- Layered/hexagonal/modular/monolith/microservice patterns
- Sử dụng service container/DI
- Event-driven flows
- Điểm nóng coupling và boundaries

### Step 4 - Coding Style and Design Conventions
Kiểm tra các file đại diện mỗi layer:
- Naming conventions (class/function/file)
- Folder và namespace strategy
- Error handling patterns
- Test style và coverage signals
- Static analysis/lint/format rules

### Step 5 - Extension Model
Lập bản đồ cơ chế mở rộng:
- Hooks/filters/events/listeners
- Đăng ký module/plugin và lifecycle
- Theme/template override model
- Custom providers, middleware, policies

### Step 6 - API and Interaction Surfaces
Thống kê interfaces nội bộ và bên ngoài:
- REST/GraphQL routes và controllers
- Command bus, queues, jobs, schedulers
- CLI commands, webhooks, callbacks
- Public SDK/service abstractions

### Step 7 - Data and State
Phân tích:
- ORM/data access strategy
- Migration và seeding patterns
- Cache/session/queue drivers
- Transaction boundaries và consistency risks

### Step 8 - Security and Compliance Signals
Kiểm tra:
- Authentication và authorization model
- CSRF/XSS/SQLi protections
- Secrets và credential handling
- Rate limiting và abuse protection
- Audit logging và trace các thao tác nhạy cảm

### Step 9 - Integration Readiness
Đánh giá khả năng tích hợp theo:
- Data integration
- API integration
- Event integration
- UI/theme integration
- Deployment/infra integration

Mỗi loại tích hợp cần tóm tắt:
- Entry points hiện có
- Adapters cần bổ sung
- Độ phức tạp ước tính (`Low`/`Medium`/`High`)
- Rủi ro chính và hướng giảm thiểu

### Step 10 - Synthesis
Tổng hợp findings vào một báo cáo, ưu tiên kết luận có bằng chứng, và liệt kê unknowns đang cần xác minh.

## Report Template

Sử dụng đúng thứ tự section sau trong `_analytics/structure.md`:

1. `Executive Summary`
2. `Technology Profile`
3. `Repository Topology`
4. `Architecture and Dependency Flow`
5. `Coding Style and Conventions`
6. `Extension Points (Modules/Themes/Plugins/Hooks)`
7. `API and Interaction Surfaces`
8. `Data Model and State Management`
9. `Security Posture`
10. `Integration Capability Matrix`
11. `Strengths, Weaknesses, Risks`
12. `Top 10 Evidence Items`
13. `Unknowns and Verification Plan`
14. `Recommended Next Actions (30/60/90 day)`

## Integration Capability Matrix Format

Mỗi integration domain là 1 dòng:

| Domain | Entry Points | Required Adapters | Complexity | Risks | Confidence |
|---|---|---|---|---|---|

Bắt buộc gồm:
- External APIs
- Authentication/SSO
- Payment
- Messaging/Queue
- Storage/CDN
- Observability
- Admin/UI customization
- Content/data migration

## Completion Checklist
Chỉ kết thúc skill khi đủ các điều kiện:
- Report tồn tại ở đường dẫn mục tiêu
- Mỗi nhận định quan trọng đều có bằng chứng
- Giả định được đánh dấu rõ ràng
- Integration matrix đầy đủ
- Top risks có hướng giảm thiểu đề xuất
