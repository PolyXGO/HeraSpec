---
name: project-memory
description: Hệ thống bộ nhớ dự án bổ trợ cho AI agent. Ghi lại các quan sát, quyết định và tóm tắt phiên làm việc để duy trì ngữ cảnh giữa các phiên phát triển. Ngăn ngừa việc làm trùng lặp, theo dõi các quyết định kiến trúc và cho phép truy xuất ngữ cảnh tối ưu token.
projectType: all
---

# Project Memory Skill

## Mục đích

Cho phép AI agent duy trì **ngữ cảnh dự án bền vững** qua các phiên làm việc bằng cách tiếp cận bổ trợ (không can thiệp). Hệ thống bộ nhớ ghi lại những gì đã làm, đã học được và những quyết định đã đưa ra — để các phiên trong tương lai bắt đầu với ngữ cảnh có liên quan thay vì phải đọc lại toàn bộ mã nguồn (codebase).

## Khi nào nên dùng

- **Trước khi triển khai tính năng mới**: Tìm kiếm bộ nhớ xem có công việc tương tự nào đã làm trước đó không.
- **Sau khi hoàn thành một nhiệm vụ quan trọng**: Ghi lại quan sát (observation) để lưu lại những gì đã thực hiện.
- **Vào cuối một phiên làm việc (session)**: Tóm tắt phiên làm việc để tham khảo sau này.
- **Khi bắt đầu một phiên làm việc phức tạp**: Đọc ngữ cảnh để hiểu lịch sử của dự án.

## Cách tiếp cận bổ trợ (Complementary Approach)

> **Skill này mang tính BỔ TRỢ, không bắt buộc.** AI agent sử dụng bộ nhớ KHI HỮU ÍCH, không phải ở mọi bước.
> 
> - Nhiệm vụ đơn giản (sửa lỗi chính tả, format code): Bỏ qua bộ nhớ hoàn toàn → tốn 0 token.
> - Nhiệm vụ phức tạp (tính năng mới, thay đổi kiến trúc): Dùng bộ nhớ → tiết kiệm 10-30x token so với việc đọc lại codebase.

## Các Lệnh Có Sẵn

### 1. Ghi lại quan sát (Log an Observation - Post-Task)
Ghi lại những gì đã làm sau khi hoàn thành một nhiệm vụ quan trọng:

```bash
heraspec memory log \
  --type <decision|bugfix|feature|refactor|discovery|change> \
  --title "Tiêu đề mô tả ngắn gọn" \
  --narrative "Mô tả chi tiết về những gì đã làm và lý do" \
  --concepts "tag1,tag2,tag3" \
  --files-modified "src/file1.ts,src/file2.ts"
```

**Các loại quan sát (Observation types):**
| Loại (Type) | Icon | Khi nào dùng |
|------|------|------------|
| `decision` | ⚖️ | Quyết định về kiến trúc hoặc thiết kế kèm theo lý do |
| `bugfix` | 🔴 | Sửa lỗi kèm theo nguyên nhân gốc rễ |
| `feature` | 🟢 | Triển khai tính năng mới |
| `refactor` | 🔄 | Tái cấu trúc hoặc tối ưu hóa mã nguồn |
| `discovery` | 🔵 | Những phát hiện quan trọng về codebase hoặc hành vi |
| `change` | ✅ | Các thay đổi code chung chung |

### 2. Tìm kiếm trong bộ nhớ (Search Memory - Pre-Implementation)
Kiểm tra xem các công việc liên quan có tồn tại không trước khi triển khai tính năng mới:

```bash
heraspec memory search "authentication middleware"
heraspec memory search --type feature --concepts "auth,login"
heraspec memory search --id 42   # Lấy chi tiết đầy đủ của observation #42
```

### 3. Tạo ngữ cảnh (Generate Context - Session Start)
Nhận bản tóm tắt các hoạt động gần đây của dự án:

```bash
heraspec memory context           # In ra stdout
heraspec memory context --output file  # Ghi vào file heraspec/memory/context.md
```

### 4. Tóm tắt phiên làm việc (Summarize Session - Session End)
Ghi lại những thành quả đạt được trong phiên làm việc này:

```bash
heraspec memory summarize \
  --request "Người dùng đã yêu cầu gì?" \
  --completed "Những gì đã được thực hiện?" \
  --learned "Những hiểu biết (insights) quan trọng đã phát hiện" \
  --next-steps "Những việc còn lại cần làm" \
  --files-edited "src/file1.ts,src/file2.ts"
```

### 5. Xem trạng thái (View Status)
Kiểm tra số liệu thống kê bộ nhớ:

```bash
heraspec memory status    # Số lượng observation, top concepts, top files
heraspec memory timeline  # Xem hoạt động theo thứ tự thời gian
```

### 6. Báo cáo Phân tích Token (Token Analytics Report)
Xem bảng so sánh chi tiết token đã dùng và tiết kiệm theo từng dự án:

```bash
heraspec memory analytics            # Bảng + biểu đồ về hiệu quả token
heraspec memory analytics --history  # Đính kèm thêm 13 mốc thời gian file DB thay đổi kích thước
```

Kết quả bao gồm:
- **Bảng (Table)**: Tên dự án, Số thao tác, Token khi dùng Memory, Token khi không dùng Memory, % Tiết kiệm, **Kích thước DB**
- **Biểu đồ thanh (Bar Chart)**: So sánh trực quan số token đã tránh được cho mỗi dự án
- **Tổng cộng (Totals)**: Tổng hợp tiết kiệm trên tất cả dự án
- **Lịch sử (History - Tùy chọn)**: Bảng thời gian (Chronological delta chart) cho thấy file `.db` đã thay đổi kích thước ra sao qua các lần cập nhật.

### 7. Bảo trì (Maintenance)
```bash
heraspec memory prune 90  # Xóa các observation cũ hơn 90 ngày
```

## Quy trình làm việc cho AI Agent

### Khi nào nên dùng Memory (Cây Quyết Định)

```
Nhận nhiệm vụ từ user
├── Nhiệm vụ đơn giản/nhỏ lẻ? → Bỏ qua bộ nhớ, làm luôn
├── Tính năng mới hay thay đổi lớn?
│   ├── Tìm kiếm bộ nhớ: "heraspec memory search <từ khóa>"
│   ├── Tìm thấy kết quả? → Đọc observation liên quan, tránh làm lại từ đầu
│   └── Không có kết quả? → Tiến hành bình thường
├── Sau khi hoàn thành nhiệm vụ:
│   ├── Quan trọng/Lớn? → Ghi lại observation
│   └── Nhỏ lẻ? → Bỏ qua ghi log
└── Kết thúc phiên làm việc?
    └── Đã hoàn thành nhiều nhiệm vụ? → Tạo tóm tắt phiên (session summary)
```

### Các Nguyên Tắc Chính

1. **Đừng gượng ép**: Chỉ sử dụng bộ nhớ khi nó thực sự giúp tiết kiệm thời gian hoặc tránh sai sót.
2. **Chất lượng hơn số lượng**: Một observation chi tiết còn hơn mười cái hời hợt.
3. **Concept là cốt lõi**: Việc gắn thẻ concept chuẩn (`auth`, `database`, `api`, `ui`) giúp tìm kiếm hiệu quả.
4. **File cũng rất quan trọng**: Ghi lại file nào đã sửa giúp cho AI lần sau điều hướng dễ dàng hơn.

## Cấu hình

Cấu hình bộ nhớ được lưu trữ tại `heraspec/memory/config.json`:

```json
{
  "totalObservationCount": 50,
  "fullObservationCount": 5,
  "sessionCount": 5,
  "maxTokens": 6000,
  "showLastSummary": true
}
```

## Tối ưu (Token Economics)

| Hành động | Chi phí Token | Token Tiết kiệm được |
|--------|-----------|---------------|
| Đọc ngữ cảnh (context) | ~2,000-4,000 | so với ~50,000-120,000 khi đọc lại codebase |
| Tìm kiếm bộ nhớ (search)| ~500-1,000 | so với ~5,000-15,000 nếu phải làm lại mã nguồn |
| Ghi lại observation | ~200-500 | Đầu tư dài hạn cho các phiên sau |
| Smart explore (outline) | ~1,000-2,000 | so với ~12,000+ nếu đọc toàn bộ file |

Để xem bảng phân tích trực tiếp về số token đã tiết kiệm, chạy:
```bash
heraspec memory analytics
```

## Tích hợp dữ liệu cũ (Bootstrapping Existing Projects)

Nếu bạn vừa thêm skill `project-memory` vào một **dự án cũ** đã và đang làm việc theo quy trình HeraSpec (đã có thư mục `heraspec/specs/` và `heraspec/archives/`), bạn có thể "tích hợp" dữ liệu về bộ nhớ rất dễ dàng mà không cần lập trình thêm.

Chỉ cần gửi duy nhất một prompt sau cho AI Agent (MỘT LẦN VÀ DUY NHẤT):

```text
Sử dụng skill project-memory.
Bạn hãy khởi tạo memory cho dự án này từ các specs và archives đã có.
Mở thư mục: heraspec/specs/ và heraspec/archives/
Với MỖI sub-folder/file có trong đó, hãy đọc lướt để hiểu nội dung, sau đó chạy lệnh:

heraspec memory log \
  --type feature \
  --title "[Trích xuất tên spec/change]" \
  --narrative "[Tóm tắt ngắn gọn những gì đã được triển khai trong spec này]" \
  --concepts "[Trích xuất các thẻ/công nghệ chính]" \
  --files-modified "[Trích xuất hoặc suy thoái các file bị ảnh hưởng]"

Lặp lại việc này cho đến khi di chuyển (migrate) hoàn tất tất cả spec cũ vào hệ thống memory.
```

Ngoài ra, có thể sử dụng **lệnh CLI có sẵn** (nhanh hơn, không tốn AI token):
```bash
heraspec memory bootstrap        # Tương tác — hỏi xác nhận trước khi chạy
heraspec memory bootstrap --yes  # Không tương tác — tự động xác nhận
```

Lệnh này sẽ tự động quét `heraspec/specs/`, `heraspec/archives/` và `heraspec/changes/`, trích xuất tiêu đề/nội dung/file từ mỗi markdown spec, rồi chèn vào cơ sở dữ liệu memory.

> **Lưu ý:** Các tiêu đề trùng lặp sẽ tự động bị bỏ qua, nên chạy lệnh nhiều lần vẫn an toàn.

## Báo cáo do Agent kích hoạt (Agent-Triggered Reporting)

Khi user yêu cầu AI agent xem báo cáo bộ nhớ, phân tích token hoặc thống kê tiết kiệm — agent nên chạy lệnh CLI và hiển thị kết quả cho user:

```text
User: "Cho tôi xem báo cáo phân tích memory"
User: "Hệ thống memory đã tiết kiệm bao nhiêu token?"
User: "Xem báo cáo token usage"
User: "Show me the memory analytics report"
```

**Hành động của Agent:** Chạy lệnh sau và hiển thị kết quả cho user:
```bash
heraspec memory analytics
```

Để xem trạng thái nhanh:
```bash
heraspec memory status
```

Để xem dòng thời gian:
```bash
heraspec memory timeline
```

## Hạn chế (Limitations)

- Bộ nhớ chỉ mang tính cục bộ (local) của dự án (lưu trong `heraspec/memory/`).
- Yêu cầu gói npm `better-sqlite3`.
- Tìm kiếm FTS5 là tìm kiếm dựa trên từ khóa (keyword-based), không phải theo ngữ nghĩa (semantic).
- Agent phải tự quyết định thời điểm thích hợp để sử dụng bộ nhớ (cách tiếp cận bổ trợ).
