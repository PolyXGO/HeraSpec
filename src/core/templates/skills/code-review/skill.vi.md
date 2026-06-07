# Kỹ năng: Đánh giá Code (Code Review) (Cross-Cutting)

## Mục đích

Đánh giá các thay đổi trong mã nguồn để phát hiện lỗ hổng bảo mật, thắt nút cổ chai hiệu năng, tính chính xác và khả năng bảo trì.

## Khi nào sử dụng

- Khi đánh giá pull request hoặc code diff
- Khi kiểm tra mã nguồn trước khi merge
- Khi xác minh các tiêu chuẩn bảo mật (OWASP Top 10, SQL injection, lộ lọt secrets)
- Khi kiểm toán hiệu năng (truy vấn N+1, rò rỉ bộ nhớ, độ phức tạp thuật toán)

## Quy trình từng bước

### Bước 1: Kiểm toán Bảo mật
- Kiểm tra các lỗi bảo mật thuộc OWASP Top 10 (SQL injection, XSS, CSRF,...)
- Tìm kiếm các chuỗi khóa bí mật, API keys hoặc thông tin đăng nhập bị hardcode
- Xác minh các bước kiểm tra xác thực và phân quyền

### Bước 2: Đánh giá Hiệu năng
- Phát hiện các vấn đề truy vấn N+1 khi tương tác với database
- Tìm kiếm rò rỉ bộ nhớ hoặc các vòng lặp cấp phát bộ nhớ quá lớn
- Xác minh độ phức tạp thuật toán trong các luồng xử lý quan trọng

### Bước 3: Kiểm tra Tính chính xác
- Đánh giá các trường hợp biên (giá trị null, chuỗi rỗng, giá trị giới hạn)
- Xác minh cơ chế xử lý lỗi và truyền lỗi (error propagation)
- Phát hiện các lỗi bất đồng bộ (race conditions, concurrency)

### Bước 4: Đánh giá Khả năng bảo trì
- Kiểm tra cách đặt tên biến/hàm xem đã rõ ràng chưa
- Đảm bảo tuân thủ nguyên tắc đơn nhiệm (Single Responsibility Principle)
- Kiểm tra trùng lặp mã nguồn và độ dễ đọc của code

## Input yêu cầu

- Code diff, PR URL hoặc các file mã nguồn cần review
- Ngữ cảnh về các ràng buộc hiệu năng hoặc yêu cầu bảo mật đặc thù

## Output mong đợi

- Báo cáo review code bao gồm:
  - Tóm tắt tổng quan về chất lượng
  - Danh sách lỗi nghiêm trọng kèm mức độ nghiêm trọng
  - Đề xuất cải tiến có thể thực thi kèm code mẫu
  - Đánh giá các điểm viết tốt

## Giọng điệu & Quy tắc

- Đưa ra phản hồi mang tính xây dựng, tập trung vào code thay vì nhà phát triển.
- Cung cấp ví dụ code thực tế khi đề xuất cải tiến.
- Làm rõ các yếu tố đánh đổi (ví dụ: độ dễ đọc vs. hiệu năng tối ưu).

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **unit-test**: Dùng để viết test cases cho các trường hợp biên được phát hiện khi review.
- **sourcecode-analyzer**: Dùng để phân tích tĩnh mã nguồn tự động.
