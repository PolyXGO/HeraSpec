# Kỹ năng: Chuỗi Email Tự động (Email Sequence) (Cross-Cutting)

## Mục đích

Thiết kế và soạn thảo các chuỗi email tự động (drip campaigns, nurture flows, onboarding series) kèm nội dung chi tiết, thời gian giãn cách giữa các email, logic rẽ nhánh, điều kiện dừng và các chỉ số đo lường hiệu năng.

## Khi nào sử dụng

- Khi xây dựng chuỗi email chào mừng (onboarding), nuôi dưỡng leads (lead nurture), tương tác lại (re-engagement), kéo khách hàng quay lại (win-back) hoặc ra mắt sản phẩm.
- Khi cần sơ đồ hóa toàn bộ luồng gửi email kèm các điều kiện rẽ nhánh và điểm dừng.
- Khi thiết lập các chiến dịch tự động hóa trên các nền tảng như Klaviyo, HubSpot, Mailchimp hoặc Customer.io.

## Quy trình từng bước

### Bước 1: Chiến lược Chuỗi Email
- Xác định mục tiêu cốt lõi của chuỗi (ví dụ: chuyển đổi từ dùng thử sang trả phí) và điều kiện thoát khỏi luồng (khi người nhận hoàn thành mục tiêu, tự động dừng gửi).
- Thiết lập cốt truyện (narrative arc) xuyên suốt và logic tiến trình giữa các email.

### Bước 2: Cấu trúc Chuỗi & Thời gian chờ (Delays)
- Lên sơ đồ số lượng email và khoảng cách thời gian gửi (ví dụ: Email 1 gửi ngay ngày 0, Email 2 sau 3 ngày, v.v...).
- Thiết lập logic rẽ nhánh dựa trên hành động của người nhận (ví dụ: đã mở nhưng chưa click vs. đã click link).

### Bước 3: Soạn thảo Nội dung Email
- Với mỗi email, cung cấp 2-3 phương án dòng tiêu đề (subject lines) và mô tả preview text hấp dẫn (40-90 ký tự).
- Viết thân bài dễ đọc, ngắn gọn, đi thẳng vào lợi ích của khách hàng và chỉ chứa duy nhất một CTA chính.

### Bước 4: Định nghĩa Điều kiện Dừng & Loại trừ
- Chỉ rõ các đối tượng cần loại trừ (suppression rules) và thời điểm họ tự động thoát khỏi luồng để tránh spam.

### Bước 5: Thiết lập Chỉ số Đo lường (Benchmarks)
- Đưa ra các chỉ số tiêu chuẩn của ngành (Tỷ lệ Mở - Open Rate, Tỷ lệ Click - CTR, Tỷ lệ Chuyển đổi) để theo dõi và tối ưu.

## Input yêu cầu

- **Loại chuỗi**: Chào mừng (onboarding), nuôi dưỡng leads, re-engagement, win-back, v.v...
- **Mục tiêu**: Hành động duy nhất để hoàn thành chuỗi email.
- **Đối tượng**: Chi tiết phân khúc, chân dung khách hàng, giai đoạn vòng đời.
- **Thời gian chờ/Giãn cách**: Khoảng cách mong muốn giữa các email.

## Output mong đợi

- **Bảng tóm tắt chuỗi**: Tóm tắt các email, thời gian chờ, và CTAs.
- **Bản thảo chi tiết**: Bài viết hoàn chỉnh sẵn sàng copy-paste, bao gồm các phương án tiêu đề, preview text, thân bài và CTAs.
- **Sơ đồ luồng rẽ nhánh**: Sơ đồ ASCII mô tả trực quan các luồng gửi và điểm dừng.
- **Bảng mục tiêu hiệu năng**: Tỷ lệ mở, tỷ lệ click và tỷ lệ chuyển đổi kỳ vọng.

## Giọng điệu & Quy tắc

- Viết bằng giọng điệu thân thiện, mang tính đối thoại nhưng vẫn giữ sự chuyên nghiệp và luôn trao giá trị trước.
- Tránh chèn quá nhiều CTAs cạnh tranh nhau trong một email. Tập trung cao độ vào một hành động tiếp theo duy nhất.
- Sử dụng các token cá nhân hóa (ví dụ: `{{first_name}}`, `{{company}}`) trong văn bản.

## Templates có sẵn

- Không có

## Templates Scripts có sẵn

- Không có

## Ví dụ

Xem thư mục `examples/`.

## Liên kết với các kỹ năng khác

- **content-creation**: Áp dụng các nguyên tắc viết tiêu đề và viết mở bài thu hút để soạn thảo email.
- **documents**: Dùng để phác thảo các hướng dẫn kỹ thuật chi tiết được đính kèm trong link email.
