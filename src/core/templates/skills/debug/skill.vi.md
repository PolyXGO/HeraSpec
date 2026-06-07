# Kỹ năng: Sửa lỗi (Debugging) (Cross-Cutting)

## Mục đích

Thực hiện một phiên debug có cấu trúc để tái dựng (reproduce), cô lập (isolate), chẩn đoán (diagnose) và sửa lỗi phần mềm một cách hệ thống.

## Khi nào sử dụng

- Khi gặp stack trace, biệt lệ thời gian chạy (runtime exception) hoặc thông báo lỗi
- Khi hành vi của hệ thống khác biệt so với đặc tả kỹ thuật (specs)
- Khi phát hiện lỗi trên môi trường staging hoặc production nhưng chưa rõ nguyên nhân

## Quy trình từng bước

### Bước 1: Tái dựng lỗi (Reproduce)
- Xác định hành vi mong đợi (Expected) vs. hành vi thực tế (Actual)
- Xác định các bước tối giản để tái dựng lỗi một cách chính xác
- Đánh giá phạm vi của lỗi (ai bị ảnh hưởng, lỗi bắt đầu từ khi nào)

### Bước 2: Cô lập lỗi (Isolate)
- Thu hẹp phạm vi tìm kiếm vào component, module hoặc luồng code gây lỗi
- Phân tích log, lỗi đầu ra hoặc lịch sử các commit gần đây
- Kiểm tra các thay đổi cấu hình hoặc cập nhật thư viện gần đây

### Bước 3: Chẩn đoán lỗi (Diagnose)
- Đưa ra giả thuyết có thể kiểm chứng và trace luồng dữ liệu/biến số
- Xác định nguyên nhân gốc rễ (root cause) thay vì chỉ xử lý triệu chứng bề nổi

### Bước 4: Sửa lỗi & Ngăn ngừa (Fix & Prevent)
- Đề xuất và triển khai giải pháp sửa lỗi code chính xác
- Phân tích các tác dụng phụ và trường hợp biên phát sinh từ bản sửa lỗi
- Xây dựng chiến lược test hồi quy (regression tests) để ngăn ngừa lỗi lặp lại

## Input yêu cầu

- Thông báo lỗi, stack trace hoặc mô tả chi tiết lỗi
- Các bước tái dựng lỗi (hoặc thông tin môi trường chạy thử)
- Quyền truy cập vào file log hoặc các component liên quan

## Output mong đợi

- Báo cáo sửa lỗi (Debug Report) bao gồm:
  - Tái dựng lỗi (Mong đợi vs. Thực tế)
  - Phân tích nguyên nhân gốc rễ (Root Cause)
  - Giải pháp sửa lỗi đã áp dụng
  - Kế hoạch ngăn ngừa (test hồi quy cần bổ sung)

## Giọng điệu & Quy tắc

- Thực hiện debug một cách hệ thống. Không đoán mò giải pháp một cách mù quáng.
- Tài liệu hóa các ràng buộc của code và lý do tại sao giải pháp sửa lỗi hoạt động hiệu quả.
- Tập trung vào bản sửa lỗi; tránh refactor các phần code không liên quan trong khi sửa lỗi.

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **unit-test**: Dùng để viết test hồi quy cho lỗi vừa sửa.
- **project-memory**: Dùng để tìm kiếm các bản sửa lỗi lịch sử hoặc vấn đề liên quan.
