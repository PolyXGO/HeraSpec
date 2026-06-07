# Kỹ năng: Truy vấn SQL (SQL Queries) (Cross-Cutting)

## Mục đích

Viết các câu truy vấn SQL chính xác, dễ đọc và đạt hiệu năng tối ưu trên các hệ thống cơ sở dữ liệu và kho dữ liệu phổ biến (PostgreSQL, Snowflake, BigQuery, Redshift, Databricks SQL).

## Khi nào sử dụng

- Khi viết các câu truy vấn phân tích phức tạp có sử dụng CTEs, hàm cửa sổ (window functions) và tính toán tỷ lệ giữ chân khách hàng (cohort retention).
- Khi tối ưu hóa các câu lệnh SQL chạy chậm hoặc chuyển đổi cú pháp truy vấn giữa các hệ quản trị cơ sở dữ liệu khác nhau.
- Khi thiết kế mô hình dữ liệu, viết mã dịch chuyển cấu trúc bảng (migrations) và lập chiến lược đánh chỉ mục (indexing).

## Quy trình từng bước

### Bước 1: Phân tích Lược đồ & Cú pháp Dialect
- Xác định hệ quản trị cơ sở dữ liệu đích (PostgreSQL, BigQuery, Snowflake, v.v...).
- Xem xét cấu trúc các bảng dữ liệu, khóa chính/phụ, chỉ mục (indexes) và khóa phân vùng (partition keys).

### Bước 2: Cấu trúc hóa bằng CTEs
- Chia nhỏ logic phức tạp thành các biểu thức bảng chung (Common Table Expressions - CTEs) dễ đọc, đại diện cho từng bước xử lý dữ liệu tuần tự.

### Bước 3: Viết Logic Đặc thù theo Dialect
- Triển khai các phép toán ngày/tháng, xử lý chuỗi văn bản, trích xuất JSON/mảng và các hàm cửa sổ sử dụng đúng cú pháp của cơ sở dữ liệu đích.

### Bước 4: Tối ưu hóa Hiệu năng (Performance Optimization)
- Áp dụng các quy tắc tối ưu đặc thù:
  - PostgreSQL: Sử dụng `EXPLAIN ANALYZE` để xem chi tiết thực thi, đánh chỉ mục các cột lọc/join, ưu tiên `EXISTS` thay vì `IN` cho truy vấn con.
  - BigQuery: Giảm thiểu dung lượng quét dữ liệu (scanned bytes), lọc theo cột phân vùng date, sử dụng `APPROX_COUNT_DISTINCT`.
  - Snowflake: Tận dụng khóa gom cụm (clustering keys), bảng tạm thời (transient tables) và tránh thay đổi kích thước warehouse không cần thiết.

### Bước 5: Kiểm thử & Sửa lỗi
- Xác minh cách xử lý các trường hợp đặc biệt (chia cho 0, giá trị null, ép kiểu dữ liệu mismatch).

## Input yêu cầu

- **Database Engine**: Loại cơ sở dữ liệu (PostgreSQL, BigQuery, Snowflake, v.v...).
- **Mục đích truy vấn**: Câu hỏi nghiệp vụ cần trả lời bằng dữ liệu.
- **Lược đồ bảng (Table Schema)**: Định nghĩa các bảng, kiểu dữ liệu, các trường khóa và chi tiết phân vùng.

## Output mong đợi

- **Mã lệnh SQL Tối ưu**: Câu lệnh SQL hoàn chỉnh được định dạng viết hoa các từ khóa chính và căn lề chuẩn mực.
- **Giải thích Hiệu năng**: Mô tả ngắn gọn về phân vùng dữ liệu, chỉ mục hoặc hàm đặc thù được dùng để tăng tốc truy vấn.
- **Giải thích Luồng truy vấn**: Giải thích rõ ràng mục đích của từng bước CTE để nhà phát triển dễ đọc hiểu.

## Giọng điệu & Quy tắc

- Viết mã SQL sạch, hiện đại bằng cách viết hoa các từ khóa chuẩn (SELECT, FROM, WHERE, v.v...).
- Luôn đặt tên viết tắt (alias) cho các bảng và gọi tên cột kèm alias khi thực hiện JOINs.
- Hạn chế viết các truy vấn con lồng nhau phức tạp; luôn ưu tiên sử dụng CTEs để giữ code sạch sẽ.

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **documents**: Sử dụng để viết tài liệu thiết kế cơ sở dữ liệu hoặc sơ đồ luồng dữ liệu kỹ thuật.
- **debug**: Sử dụng để chẩn đoán và khắc phục các lỗi cú pháp/logic do công cụ cơ sở dữ liệu trả về.
