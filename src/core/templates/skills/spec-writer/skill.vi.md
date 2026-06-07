# Kỹ năng: Viết Đặc tả (Specification Writing) (Cross-Cutting)

## Mục đích

Viết và tinh chỉnh các đặc tả chức năng/kỹ thuật chất lượng cao, các user stories và các delta specs để các AI agent có thể đọc hiểu và thực thi hiệu quả.

## Khi nào sử dụng

- Khi bắt đầu tạo một Change mới (Bước 1 của quy trình HeraSpec)
- Khi chuyển đổi các ý tưởng nghiệp vụ mức cao thành tài liệu spec có cấu trúc kỹ thuật
- Khi tinh chỉnh delta specs trong quá trình giải quyết xung đột song song (parallel merge)

## Quy trình từng bước

### Bước 1: Định nghĩa User Story & Scenarios
- Cấu trúc yêu cầu cốt lõi dưới dạng User Story (Với vai trò là... Tôi muốn... Để...)
- Xây dựng các kịch bản hành vi (scenarios) sử dụng cú pháp GIVEN-WHEN-THEN (phong cách Gherkin)
- Định nghĩa rõ luồng xử lý thành công (happy path), luồng lỗi (error path) và trường hợp biên (edge cases)

### Bước 2: Cấu trúc phần Meta
- Chỉ định rõ các component mục tiêu, domain và technical stack
- Xác minh các yêu cầu phải khớp với quy ước kiến trúc được định nghĩa trong `project.md`

### Bước 3: Viết Delta Spec
- Phân đoạn rõ ràng các yêu cầu mới, sửa đổi và loại bỏ:
  - `## ADDED Requirements`
  - `## MODIFIED Requirements` (phải nêu rõ trạng thái Trước đây (Before) vs. Bây giờ (After))
  - `## REMOVED Requirements`

## Input yêu cầu

- Mô tả yêu cầu nghiệp vụ hoặc prompt yêu cầu từ người dùng
- Thông tin về tech stack lấy từ `project.md`

## Output mong đợi

- File đặc tả markdown sạch sẽ tuân thủ đúng định dạng của HeraSpec
- File Delta Spec hoàn chỉnh với các kịch bản GIVEN-WHEN-THEN

## Giọng điệu & Quy tắc

- Cực kỳ chính xác. Tránh các từ ngữ mơ hồ như "thân thiện với người dùng" hoặc "nhanh chóng".
- Luôn định nghĩa rõ các trạng thái lỗi cụ thể (ví dụ: "trả về lỗi 401 Unauthorized" thay vị "hiển thị lỗi").
- Các kịch bản (scenarios) BẮT BUỘC phải kiểm thử được và có thể triển khai được.

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **documents**: Dùng để định dạng các đặc tả kỹ thuật thành hướng dẫn sản phẩm.
- **suggestion**: Dùng để phát hiện các lỗ hổng trong các spec hiện có.
