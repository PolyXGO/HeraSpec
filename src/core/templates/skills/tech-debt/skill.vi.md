# Kỹ năng: Quản lý Nợ Kỹ thuật (Technical Debt Management) (Cross-Cutting)

## Mục đích

Nhận diện, phân loại và ưu tiên hóa nợ kỹ thuật (technical debt) một cách hệ thống để quản lý việc bảo trì và tái cấu trúc (refactoring) mã nguồn.

## Khi nào sử dụng

- Khi thực hiện kiểm toán sức khỏe/chất lượng mã nguồn (code health audits)
- Khi chuẩn bị các đề xuất tái cấu trúc code (refactoring proposals)
- Khi quản lý danh sách bảo trì hoặc ưu tiên các nhiệm vụ chất lượng code song song với phát triển tính năng mới

## Quy trình từng bước

### Bước 1: Nhận diện và Phân loại
- **Code debt**: Trùng lặp logic, trừu tượng hóa kém, magic numbers, thiếu an toàn kiểu dữ liệu (type safety)
- **Architecture debt**: Các thành phần bị phụ thuộc chặt chẽ (tight coupling), cần chia nhỏ monolith, lựa chọn sai database
- **Test debt**: Độ bao phủ test thấp, test không ổn định (flaky tests), thiếu luồng test tích hợp/E2E
- **Dependency debt**: Các thư viện bị lỗi thời, gói package không được duy trì, lỗ hổng bảo mật
- **Documentation debt**: Tài liệu README cũ, thiếu hướng dẫn vận hành (runbooks), API không được viết tài liệu

### Bước 2: Đánh giá và Chấm điểm
Chấm điểm cho từng mục nợ kỹ thuật theo thang điểm từ 1-5:
- **Ảnh hưởng (Impact)**: Nó làm chậm tốc độ phát triển của team đi bao nhiêu? (1-5)
- **Rủi ro (Risk)**: Khả năng xảy ra và tác động của sự cố nếu không xử lý là gì? (1-5)
- **Công sức (Effort)**: Độ khó/chi phí để sửa lỗi là bao nhiêu? (1-5)

### Bước 3: Ưu tiên hóa
Tính điểm ưu tiên (Priority Score) theo công thức:
`Priority = (Impact + Risk) x (6 - Effort)`
*(Lưu ý: Công sức càng nhỏ sẽ giúp tăng điểm ưu tiên).*

### Bước 4: Lập Kế hoạch Khắc phục
- Sắp xếp các mục nợ kỹ thuật đã được ưu tiên vào danh sách xử lý (remediation backlog) theo từng giai đoạn
- Đề xuất các giai đoạn refactor tăng dần, có thể triển khai xen kẽ với các tác vụ phát triển tính năng thông thường

## Input yêu cầu

- Quyền truy cập mã nguồn hoặc tài liệu mô tả kiến trúc
- Lịch sử các đợt sập hệ thống gần đây, lỗi deploy hoặc khó khăn từ đội ngũ lập trình viên

## Output mong đợi

- Báo cáo phân loại nợ kỹ thuật bao gồm:
  - Phân loại và mô tả chi tiết nợ kỹ thuật
  - Điểm số Ảnh hưởng, Rủi ro, Công sức và điểm Ưu tiên tương ứng
  - Lý do thuyết phục về mặt nghiệp vụ/kinh doanh (business justification) để refactor
  - Kế hoạch khắc phục theo từng giai đoạn

## Giọng điệu & Quy tắc

- Tránh các lời phàn nàn chủ quan. Tập trung vào các chỉ số định lượng được (tốc độ code của lập trình viên, tỷ lệ test lỗi).
- Định hình hoạt động refactoring dựa trên giá trị nghiệp vụ mang lại (giảm độ trễ, onboarding lập trình viên mới nhanh hơn, giảm tỷ lệ crash ứng dụng).

## Templates có sẵn

- Không có

## Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **suggestion**: Dùng để chuyển đổi phát hiện nợ kỹ thuật thành các đề xuất tính năng thực thi được.
- **sourcecode-analyzer**: Dùng để tự động tìm kiếm code trùng lặp và các vi phạm chất lượng code.
