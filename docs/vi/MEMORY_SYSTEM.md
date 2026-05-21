# Hệ Thống Bộ Nhớ Dự Án (Memory System)

Hệ thống Memory cung cấp **ngữ cảnh dự án bền vững** cho AI agents làm việc qua nhiều phiên. Nó ghi lại các quan sát, quyết định, và tóm tắt phiên — giúp agent duy trì nhận thức về những gì đã làm, tại sao, và còn gì cần làm.

## Tổng Quan

### Vấn Đề Giải Quyết
Khi AI agents làm việc trên dự án trong nhiều tuần hoặc tháng:
- Mất ngữ cảnh giữa các phiên làm việc
- Phải đọc lại toàn bộ codebase để hiểu (tốn tokens)
- Duplicate work — implement tính năng đã có
- Quyết định không nhất quán — mâu thuẫn với kiến trúc đã chọn

### Giải Pháp: Bộ Nhớ Bổ Trợ (Complementary)
HeraSpec Memory dùng cách tiếp cận **bổ trợ** — agent dùng memory **khi hữu ích**, không phải mọi lúc:
- Task đơn giản → Bỏ qua memory → 0 token overhead
- Task phức tạp → Dùng memory → Tiết kiệm 10-30x tokens

## Bắt Đầu Nhanh

### 1. Cài đặt skill
```bash
heraspec skill add project-memory
heraspec skill add smart-explore   # Tùy chọn: khám phá code hiệu quả
```

### 2. Các Lệnh Chính

#### Bản Đồ Kiến Trúc (Architecture Index)
```bash
heraspec memory index           # Quét thư mục và tạo bản đồ kiến trúc
heraspec memory index --depth 2 # Quét với độ sâu giới hạn
```
*Lưu ý: Lệnh này được chạy tự động ngầm khi bạn gõ `heraspec init`.*

#### Ghi Nhận Quan Sát (Observation)
```bash
heraspec memory log \
  --type bugfix \
  --title "Fix auth middleware" \
  --discovery-tokens 15000 \
  --narrative "Triển khai JWT auth với refresh tokens..."

```
> **Lưu ý Tự động Log:** Bạn KHÔNG CẦN gọi lệnh này thủ công nếu dùng quy trình chuẩn. Khi bạn chạy `heraspec archive <change-name>`, hệ thống tự động đọc `proposal.md` và chạy ngầm lệnh log này! Cờ `--discovery-tokens` cũng tự động được tính toán để xem bạn tiết kiệm được bao nhiêu token.

#### Ghi nhận lỗi nhanh (Hotfix)
Đối với các lỗi (bug) nhỏ không đáng để viết toàn bộ Spec, bạn có thể log trực tiếp vào bộ nhớ:
```bash
heraspec hotfix "Sửa lỗi timeout khi đăng nhập" -n "Đã tăng thời hạn JWT lên 2h trong file auth.ts"
```

#### Tìm kiếm Bộ nhớ (Semantic & Full-text)

**Tìm kiếm theo Ngữ nghĩa (Semantic Vector Search - Khuyên dùng):**
```bash
heraspec memory query "cơ chế xác thực (auth) hoạt động ra sao?"
```
*(Sử dụng model AI tích hợp cục bộ để hiểu câu hỏi và tìm các context liên quan)*

**Tìm kiếm theo từ khóa (Full-text Search):**
```bash
heraspec memory search "authentication"
heraspec memory search --type decision --concepts "database"
heraspec memory search --id 42   # Chi tiết đầy đủ observation #42
```

#### Tạo Ngữ Cảnh (Context)
```bash
heraspec memory context                 # In ra stdout
heraspec memory context --output file   # Ghi vào heraspec/memory/context.md
```
*Lưu ý: Lệnh `heraspec memory context` sẽ tự động ghim Bản Đồ Kiến Trúc (Architecture Map) lên đầu file nếu có.*

#### Thống Kê & Phân Tích (Analytics)
```bash
heraspec memory analytics  # Thống kê số lượng Token thực tế tiết kiệm được
heraspec memory status     # Trạng thái DB
heraspec memory timeline   # Xem theo thời gian
```

#### Tự Động Tối Ưu Config
HeraSpec tự phát hiện quy mô dự án và đề xuất config tối ưu:
```bash
heraspec memory optimize        # Interactive — hiển thay đổi, hỏi xác nhận
heraspec memory optimize --yes  # Tự động áp dụng không hỏi
```

Optimizer phân tích:
- Số lượng observations → xác định quy mô (small/medium/large/enterprise)
- Config hiện tại vs config tối ưu cho quy mô đó
- Context có bị cắt bớt vì `maxTokens` thấp không
- Có nên dọn observations cũ không

#### Bảo Trì
```bash
heraspec memory prune 90   # Xóa observations cũ hơn 90 ngày
```

## Loại Observation

| Loại | Icon | Khi Nào Dùng |
|------|------|-------------|
| `decision` | ⚖️ | Quyết định kiến trúc/thiết kế kèm lý do |
| `bugfix` | 🔴 | Sửa lỗi kèm phân tích nguyên nhân |
| `feature` | 🟢 | Triển khai tính năng mới |
| `refactor` | 🔄 | Tái cấu trúc hoặc tối ưu code |
| `discovery` | 🔵 | Phát hiện quan trọng về codebase |
| `change` | ✅ | Thay đổi code chung |

## Tiết Lộ Tiến Bộ (Progressive Disclosure)

Hệ thống tìm kiếm dùng **quy trình 3 lớp** để tối thiểu token:

| Lớp | Nhận Được | Token Cost | Dùng Khi |
|-----|----------|-----------|----------|
| **1. Index** | ID, type, title, date | ~50-100/kết quả | Quét lịch sử |
| **2. Timeline** | Ngữ cảnh theo thời gian | ~200-500/kết quả | Hiểu trình tự |
| **3. Chi tiết** | Toàn bộ narrative, files, concepts | ~500-1,000/kết quả | Điều tra sâu |

## Smart Explore (Khám Phá Code Thông Minh)

Khám phá code hiệu quả token mà không cần đọc toàn bộ file:

```bash
# Xem cấu trúc file (~1K tokens vs ~12K+ đọc toàn bộ)
heraspec explore outline src/auth/middleware.ts

# Tìm symbols trong codebase
heraspec explore search "AuthMiddleware" src/

# Đọc chỉ 1 function
heraspec explore unfold src/auth/middleware.ts validateToken
```

### Ngôn Ngữ Hỗ Trợ
TypeScript, JavaScript, Python, PHP, Go, Rust, Java, C#, Vue, Svelte

## Cấu Hình

Chỉnh sửa `heraspec/memory/config.json`:

```json
{
  "totalObservationCount": 50,
  "fullObservationCount": 5,
  "sessionCount": 5,
  "maxTokens": 6000,
  "showLastSummary": true
}
```

| Cài đặt | Mặc định | Mô tả |
|---------|---------|-------|
| `totalObservationCount` | 50 | Số observations tối đa trong context |
| `fullObservationCount` | 5 | Bao nhiêu hiện narrative đầy đủ |
| `sessionCount` | 5 | Số session summaries tối đa |
| `maxTokens` | 6000 | Giới hạn token cho context |
| `showLastSummary` | true | Bao gồm tóm tắt phiên gần nhất |

### Hướng Dẫn Tinh Chỉnh Cấu Hình

Các giá trị mặc định được tối ưu cho AI agents hiện đại với context window lớn.

#### `totalObservationCount: 50` — Tại sao không phải 30 hay 100?

Với progressive disclosure, chỉ 5 observations gần nhất hiện narrative đầy đủ (~200-500 tokens mỗi cái). 45 còn lại hiện dạng index table ~15 tokens/dòng.

| Giá trị | Chi phí index | Kết quả |
|---------|-------------|--------|
| 30 | ~375 tokens | Lịch sử hẹp — có thể bỏ lỡ công việc liên quan |
| **50** | **~675 tokens** | **Cân bằng tốt — tầm nhìn rộng, chi phí thấp** |
| 100 | ~1,425 tokens | Hiệu quả giảm dần — observations cũ ít giá trị |

#### `fullObservationCount: 5` — Điểm tối ưu

| Giá trị | Chi phí token | Kết quả |
|---------|-------------|--------|
| 3 | ~600-1,500 | Quá ít — thiếu context quan trọng |
| **5** | **~1,000-2,500** | **Đủ context gần nhất mà không tràn** |
| 10 | ~2,000-5,000 | Nhiều cái không liên quan, lãng phí |

#### `sessionCount: 5` — Lịch sử đủ dùng

- 1 phiên gần nhất → hiện đầy đủ (~200-400 tokens)
- 4 phiên trước → hiện gọn 1 dòng (~50-100 tokens tổng)
- Trên 5 phiên → context quá cũ, ít giá trị

#### `maxTokens: 6000` — Cân bằng cho context window hiện đại

| AI Agent | Context window | 6,000 tokens = | % budget |
|----------|---------------|----------------|----------|
| Gemini 2.5 Pro | 1,000,000 | 0.6% | Không đáng kể |
| Claude 4 | 200,000 | 3% | Rất nhỏ |
| GPT-4.1 | 128,000 | 4.7% | Nhỏ |

6,000 tokens đủ cho: 50 index rows + 5 full observations + 5 session summaries — bản chụp toàn cảnh dự án chỉ chiếm < 5% context window.

> **Nguyên tắc:** Dự án > 500 observations → tăng `maxTokens` lên 8,000. Dự án nhỏ < 100 observations → 4,000 là đủ.

#### `showLastSummary: true` — Luôn giữ bật

Tóm tắt phiên gần nhất cho agent biết:
- User yêu cầu gì lần trước
- Đã hoàn thành gì
- Còn gì chưa xong (next steps)

Chi phí: ~200-400 tokens. Giá trị: **ngăn lãng phí #1** — làm lại công việc đã hoàn thành.

## Database

Memory dùng **SQLite** với FTS5 full-text search qua `better-sqlite3`:

- **Vị trí**: `heraspec/memory/heraspec-memory.db`
- **Bảng**: `observations`, `session_summaries`, `sessions`
- **FTS5 Indexes**: `observations_fts`, `summaries_fts`
- **Hiệu suất**: WAL mode, indexed queries

## Cách Tiếp Cận Bổ Trợ vs Bắt Buộc

| Khía cạnh | Bắt buộc (❌) | Bổ trợ (✅) |
|-----------|--------------|------------|
| Token overhead | 4,000-8,000/phiên luôn | 0 cho task đơn giản |
| Xung đột IDE | Xung đột với tính năng có sẵn | Hoạt động song song |
| Friction | Cần approve mỗi command | Agent tự quyết định |
| Tiết kiệm token | Tốt cho task phức tạp | Cùng mức tiết kiệm, không lãng phí |

Agent đọc skill `project-memory` và **tự quyết định khi nào memory đáng dùng**, thay vì bị ép dùng mọi lúc.

## Khi Nào Điều Chỉnh Config

| Tình huống | Thay đổi không nghị |
|----------|---------------------|
| Dự án nhỏ (< 50 observations) | `maxTokens: 4000`, `totalObservationCount: 30` |
| Dự án trung bình (50-500) | **Mặc định là tối ưu** |
| Dự án lớn (500+) | `maxTokens: 8000`, `totalObservationCount: 80` |
| Agent context window nhỏ | `maxTokens: 3000`, `fullObservationCount: 3` |
| Team chia sẻ context | `maxTokens: 8000` — nhiều context hơn cho onboarding |

> **Không cần nhớ các quy tắc này.** Chỉ cần chạy `heraspec memory optimize` và hệ thống sẽ phân tích dự án và đề xuất giá trị phù hợp. Bạn chỉ cần xác nhận.
