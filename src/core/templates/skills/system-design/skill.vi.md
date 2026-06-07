# Kỹ năng: Thiết kế Hệ thống (System Design) (Cross-Cutting)

## Mục đích

Đánh giá các quyết định kiến trúc, thiết kế các API endpoint, mô hình hóa lược đồ dữ liệu (database schemas) và phân tích các yếu tố đánh đổi (trade-offs).

## Khi nào sử dụng

- Khi thiết kế một microservice, hệ thống, hoặc mô hình cơ sở dữ liệu mới
- Khi định nghĩa các ranh giới API và hợp đồng tích hợp (integration contracts) giữa các component
- Khi mở rộng quy mô hệ thống và phác thảo các yếu tố đánh đổi giữa mở rộng theo chiều dọc và chiều ngang

## Quy trình từng bước

### Bước 1: Thu thập Yêu cầu & Ràng buộc
- Liệt kê các yêu cầu chức năng (hệ thống phải làm gì)
- Liệt kê các yêu cầu phi chức năng (throughput, quy mô, độ trễ, tính sẵn sàng)
- Xác định các ràng buộc kỹ thuật (năng lực của team, ngân sách, thời gian, công nghệ hiện có)

### Bước 2: Thiết kế Mức Cao (High-Level Design)
- Phác thảo sơ đồ các component (services, clients, data stores)
- Phác thảo luồng dữ liệu và vòng đời của request/response
- Lựa chọn giải pháp lưu trữ (SQL, NoSQL, Cache, Document store)

### Bước 3: Thiết kế Chi tiết & Hợp đồng API
- Định nghĩa các mô hình schema database và chiến lược đánh index
- Thiết kế hợp đồng API cụ thể (REST endpoints, cấu trúc GraphQL, đặc tả gRPC)
- Thiết kế cơ chế xử lý lỗi, chiến lược lưu cache và định nghĩa hàng đợi sự kiện (event queue)

### Bước 4: Phân tích Đánh đổi (Trade-off Analysis)
- Tài liệu hóa rõ ràng các lựa chọn kiến trúc kèm phân tích đánh đổi (ví dụ: Tối ưu đọc vs. Tối ưu ghi)
- Xây dựng chiến lược mở rộng (sharding, replication, cơ chế failover)

## Input yêu cầu

- Mục tiêu kiến trúc, đặc tả kỹ thuật hoặc user stories
- Tải trọng dự kiến (requests mỗi giây, kích thước dữ liệu)
- Ràng buộc về công nghệ hiện có của dự án

## Output mong đợi

- Tài liệu thiết kế hệ thống bao gồm:
  - Sơ đồ kiến trúc (ASCII hoặc Mermaid)
  - Mô hình dữ liệu và DB schema
  - Đặc tả kỹ thuật các API endpoint
  - Chiến lược Cache/Queue
  - Phân tích đánh đổi rõ ràng

## Giọng điệu & Quy tắc

- Mọi quyết định thiết kế đều phải kèm theo phân tích đánh đổi tương ứng.
- Đảm bảo tính mô-đun của thiết kế và giải thích rõ ranh giới giữa các service.
- Tránh over-engineering (thiết kế quá phức tạp). Hãy thiết kế cho quy mô 10x nhưng xây dựng cho quy mô 1.5x trước.

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **documents**: Dùng để tạo tài liệu đặc tả kỹ thuật và sản phẩm.
- **suggestion**: Dùng để phân tích hệ thống hiện tại và đề xuất cải tiến kiến trúc.
