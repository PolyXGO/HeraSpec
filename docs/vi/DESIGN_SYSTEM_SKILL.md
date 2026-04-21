# Hướng Dẫn Sử Dụng Design System Skill

## Tổng Quan

Skill `design-system` là một bản nâng cấp mạnh mẽ cho bộ quy trình thiết kế UI/UX của HeraSpec. Nó tích hợp sẵn bộ dữ liệu của **54 design systems thực tế** từ các thương hiệu công nghệ hàng đầu (Stripe, Vercel, Apple, Supabase, Linear, v.v...) được định dạng lại theo chuẩn `DESIGN.md` của Google Stitch.

Nếu skill `ui-ux` thông thường chỉ đưa ra các gợi ý chung chung (ví dụ: "chọn style tối giản", "hiệu ứng kính mờ"), thì skill `design-system` sẽ cung cấp cho Agent của bạn các **thông số chính xác tuyệt đối của một thương hiệu** (ví dụ: mã Hex, độ bo góc, hay phong cách "đổ bóng ngả xanh" đặc trưng tạo nên giao diện của Stripe).

## Cài Đặt Nhanh

### 1. Thêm skill vào dự án
Để sử dụng skill, hãy cài đặt vào thư mục dự án của bạn (yêu cầu Agent thực thi hoặc tự chạy tay):
```bash
heraspec skill add design-system
```

### 2. Tìm kiếm tham chiếu giao diện (Brand reference)
Sử dụng công cụ search để chọn ra một design system phù hợp với định hướng thiết kế của bạn:
```bash
# Tìm cụ thể một thương hiệu
python3 heraspec/skills/design-system/scripts/search.py "stripe" --domain design-system

# Tìm theo tên ngành hoặc phong cách
python3 heraspec/skills/design-system/scripts/search.py "dark developer tools" --domain design-system
python3 heraspec/skills/design-system/scripts/search.py "fintech premium shadow" --domain design-system
```

### 3. Tham chiếu tệp DESIGN.md gốc
Engine search sẽ trả về bảng tóm tắt kèm theo một `Agent_Quick_Prompt`. Để nắm bắt triết lý thiết kế chi tiết (bao gồm Color Palette, Typography rules, Layout và đặc biệt là cơ chế Shadow), bạn hãy truy cập trực tiếp tệp `DESIGN.md` ở đường dẫn sau:
```
heraspec/skills/design-system/knowledge/design-systems/<folder>/DESIGN.md
```

## Luồng Hoạt Động (Workflow) Cho Agent

Khi giao việc thiết kế UI, hãy yêu cầu tác vụ bằng spec (hoặc nhắc nhở theo form) kèm references:

**Prompt Mẫu Khuyên Dùng:**
> "Hãy tạo cho tôi trang bảng giá Pricing. `(skill: design-system)`. Cậu hãy search keywords 'Vercel' để lấy phong cách shadow-as-border, typography (dùng Geist), và bảng màu monochrome ngầu lạnh của họ. Sau đó implement mã nguồn bằng HTML + Tailwind nhé."

**Quy trình Agent sẽ thực hiện:**
1. Khởi động luồng làm việc của quy trình skill `design-system`.
2. Trích xuất thông tin qua `search.py` trong kho `design-system` với từ khoá "Vercel".
3. Mở tệp `vercel/DESIGN.md`, tiến hành đọc và tổng hợp lý thuyết của 9 section chuẩn.
4. Triển khai code UI/UX sát với thông số thực (chuẩn từng mã Hex màu, cỡ chữ, và cấu trúc boxShadow). Điều này đem lại sản phẩm xịn hơn rất nhiều so với dùng Tailwind config thủ công cơ bản.

## Kiến Trúc chuẩn 9-Section (Google Stitch format)

Mỗi thư mục thương hiệu luôn có một tệp `DESIGN.md` thống nhất chuẩn 9 phần:
1. **Visual Theme & Atmosphere** — Triết lý và tinh thần chủ đạo
2. **Color Palette & Roles** — Mã hex và gán ngữ nghĩa logic
3. **Typography Rules** — Gia đình font chữ, phông, và tỉ lệ thu phóng
4. **Component Stylings** — Thiết kế cho thẻ, nút bấm, input fields 
5. **Layout Principles** — Quy ước cấu trúc khung, padding và khoảng trắng
6. **Depth & Elevation** — Các lớp bóng (metrics quan trọng nhất của UI hiện đại)
7. **Do's and Don'ts** — Ranh giới vi phạm nguyên tắc của brand
8. **Responsive Behavior** — Cách hiển thị trên đa thiết bị
9. **Agent Prompt Guide** — Gợi ý tóm gọn cho prompt khởi tạo AI

## Sức mạnh kết hợp

Để sản phẩm đạt ngưỡng hoàn thiện cao nhất, hãy hướng dẫn Agent kết hợp linh hoạt `design-system` và `ui-ux` skill lại với nhau:
- Nhánh **`design-system` (domain):** quyết định **Look & Feel** (màu sắc, hệ số bóng, góc bo cạnh, font typography).
- Nhánh **`pages` (domain nằm ở ui-ux):** định hướng form **Structure** (trang Home bao gồm gì, trang Pricing sắp xếp ra sao).
- Nhánh **`ux` (domain nằm ở ui-ux):** quy định hành vi **Behavior** (tính tiện dụng a11y, hover animation, scroll effects).
