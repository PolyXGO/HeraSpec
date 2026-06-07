# Hướng Dẫn Thiết Lập Kỹ Năng UI/UX

## Tổng Quan

Kỹ năng UI/UX tích hợp với công cụ tìm kiếm **UI/UX Builder** (được xây dựng dựa trên [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) để cung cấp kiến thức thiết kế thông minh cho việc xây dựng UI/UX chuyên nghiệp. Nó bao gồm:

- **57 Phong Cách UI** - Glassmorphism, Claymorphism, Tối giản (Minimalism), Brutalism, v.v...
- **95 Bảng Màu** - Các bảng màu đặc thù theo từng ngành công nghiệp
- **56 Cặp Font Chữ** - Các tổ hợp typography được chọn lọc kĩ càng
- **24 Loại Biểu Đồ** - Các khuyến nghị cho dashboard và phân tích số liệu
- **9+ Loại Trang** - Home, About, Chi tiết bài viết, Danh mục, Bảng giá (Pricing), FAQ, Liên hệ, Danh mục sản phẩm, Chi tiết sản phẩm, và nhiều hơn nữa
- **8 Tech Stacks** - React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, HTML+Tailwind
- **98 Hướng Dẫn UX** - Các thực hành tốt nhất (best practices) và các mẫu phản thiết kế (anti-patterns)

## Điều Kiện Tiên Quyết

**Yêu cầu cài đặt Python 3.x:**

```bash
# Kiểm tra xem Python đã được cài đặt chưa
python3 --version || python --version

# macOS
brew install python3

# Ubuntu/Debian
sudo apt update && sudo apt install python3

# Windows
winget install Python.Python.3.12
```

## Thiết Lập Kỹ Năng UI/UX

### Lựa chọn 1: Sử dụng HeraSpec CLI (Khuyến nghị)

Cách đơn giản nhất để thêm kỹ năng UI/UX vào dự án của bạn:

```bash
heraspec skill add ui-ux
```

Lệnh này sẽ thực hiện:
- Sao chép template kỹ năng, các scripts, dữ liệu và templates vào dự án của bạn.
- Nếu kỹ năng này đã tồn tại, nó sẽ tự động xóa phiên bản cũ và cập nhật phiên bản mới nhất.
- Thiết lập tất cả các file và phân quyền cần thiết.

### Lựa chọn 2: Thiết lập thủ công

Nếu bạn muốn thiết lập thủ công:

1. **Sao chép thư mục skill UI/UX:**
   ```bash
   cp -r HeraSpec/src/core/templates/skills/ui-ux heraspec/skills/
   ```

## Hướng Dẫn Sử Dụng

### Trong File Tasks

Khi tạo các tác vụ yêu cầu công việc UI/UX, hãy gán kỹ năng `ui-ux` cho chúng:

```markdown
## 1. Thiết Kế Trang Landing Page (skill: ui-ux)
- [ ] 1.1 Thiết kế phần hero section
- [ ] 1.2 Thiết lập bảng màu
- [ ] 1.3 Triển khai layout responsive
```

### Luồng Công Việc Của Agent

Khi một agent gặp một task có gắn `skill: ui-ux`, nó sẽ:

1. **Đọc file skill.md** để hiểu rõ luồng công việc.
2. **Sử dụng các scripts tìm kiếm** để tìm kiếm thông số thiết kế phù hợp:
   ```bash
   # Chế độ BM25 (mặc định, nhanh, không cần cài thư viện ngoài)
   python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness" --domain product
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal" --domain style
   
   # Chế độ Vector (tìm kiếm ngữ nghĩa - semantic, cho kết quả tốt hơn)
   python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
   
   # Chế độ Hybrid (kết hợp tốt nhất, gộp BM25 + Vector)
   python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
   
   # Tìm kiếm cấu trúc loại trang cho các website nhiều trang (multi-page)
   python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
   python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans" --domain pages
   ```
3. **Tổng hợp kết quả** để xây dựng một design system hoàn chỉnh.
4. **Triển khai code** tuân theo design system và các thực hành tốt nhất.
5. **Xác minh** sản phẩm sử dụng danh sách kiểm tra (pre-delivery checklist) trước khi bàn giao.

## Các Chế Độ Tìm Kiếm

UI/UX Builder hỗ trợ ba chế độ tìm kiếm:

### BM25 (Mặc định)
- **Tìm kiếm nhanh dựa trên từ khóa**
- **Không cần dependencies** - hoạt động ngay lập tức
- **Phù hợp nhất cho**: So khớp từ khóa chính xác
- **Cách dùng:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "minimalism" --domain style
  ```

### Vector (Semantic - Ngữ nghĩa)
- **Tìm kiếm ngữ nghĩa** sử dụng mô hình sentence transformers
- **Cho kết quả tốt hơn từ 15-20%** so với BM25
- **Hiểu được ý nghĩa và các từ đồng nghĩa**
- **Yêu cầu cài đặt**: `pip install sentence-transformers scikit-learn`
- **Cách dùng:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "elegant dark theme" --domain style --mode vector
  ```

### Hybrid (Tối ưu nhất)
- **Kết hợp BM25 + Vector** để cho kết quả tối ưu
- **Cho kết quả tốt hơn khoảng 25%** so với việc chỉ dùng BM25
- **Tích hợp ưu điểm cả hai**: So khớp từ khóa chính xác + hiểu ngữ nghĩa của prompt
- **Yêu cầu cài đặt**: `pip install sentence-transformers scikit-learn`
- **Cách dùng:**
  ```bash
  python3 heraspec/skills/ui-ux/scripts/search.py "modern minimal design" --domain style --mode hybrid
  ```

**Lưu ý**: Nếu các thư viện để chạy chế độ Vector/Hybrid chưa được cài đặt, hệ thống sẽ tự động chuyển về chế độ BM25.

## Các Phân Vùng Tìm Kiếm (Search Domains)

| Domain | Dùng cho | Ví dụ |
|--------|---------|---------|
| `product` | Khuyến nghị theo loại sản phẩm | `--domain product` |
| `style` | Phong cách UI, màu sắc, hiệu ứng bóng | `--domain style` |
| `typography` | Các cặp font chữ, Google Fonts | `--domain typography` |
| `color` | Bảng màu theo loại sản phẩm | `--domain color` |
| `landing` | Cấu trúc trang, chiến lược CTA | `--domain landing` |
| `pages` | Các loại trang cho website nhiều trang | `--domain pages` |
| `chart` | Loại biểu đồ, thư viện biểu đồ khuyên dùng | `--domain chart` |
| `ux` | Thực hành tốt nhất, các lỗi thiết kế nên tránh | `--domain ux` |
| `prompt` | Gợi ý prompt cho AI, các từ khóa CSS | `--domain prompt` |

## Các Tech Stacks Có Sẵn

| Stack | Mô tả |
|-------|-------------|
| `html-tailwind` | Các class tiện ích Tailwind, responsive, a11y (MẶC ĐỊNH) |
| `react` | Quản lý state, hooks, tối ưu hiệu năng, design patterns |
| `nextjs` | SSR, định tuyến (routing), tối ưu ảnh (next/image), API routes |
| `vue` | Composition API, Pinia, Vue Router |
| `svelte` | Runes, stores, SvelteKit |
| `swiftui` | Views, State, Navigation, Animation |
| `react-native` | Native Components, Navigation, Lists |
| `flutter` | Widgets, State, Layout, Theming |

## Hỗ Trợ Thiết Kế Website Nhiều Trang (Multi-Page)

UI/UX Builder hỗ trợ tạo ra các gói thiết kế toàn diện cho website nhiều trang, chứ không chỉ giới hạn ở trang landing page đơn lẻ.

### Gói Trang Mặc Định

Khi tạo một "gói website hoàn chỉnh", bộ trang mặc định bao gồm 9 trang:

1. **Home** - Trang chủ chính
2. **About** - Trang giới thiệu công ty/câu chuyện thương hiệu
3. **Post Details** - Chi tiết bài viết tin tức/blog
4. **Category** - Danh sách bài viết theo danh mục
5. **Pricing** - Bảng giá dịch vụ
6. **FAQ** - Các câu hỏi thường gặp
7. **Contact** - Trang liên hệ và biểu mẫu
8. **Product Category** - Trang danh mục sản phẩm (nếu là e-commerce)
9. **Product Details** - Trang chi tiết sản phẩm (nếu là e-commerce)

### Tìm Kiếm Theo Loại Trang

Sử dụng domain `pages` để tìm kiếm các khuyến nghị về thiết kế cho từng loại trang cụ thể:

```bash
# Trang chủ
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages

# Trang giới thiệu (About)
python3 heraspec/skills/ui-ux/scripts/search.py "about company story" --domain pages

# Trang bảng giá (Pricing)
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# Các trang thương mại điện tử (E-commerce)
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
```

### Các Template Prompt Cho Website Nhiều Trang

Tham khảo các template prompt chi tiết tại:
- `heraspec/skills/ui-ux/templates/example-prompt-full-theme.md` - Các ví dụ prompt chi tiết
- `heraspec/skills/ui-ux/templates/prompt-template-full-theme.md` - Template sẵn sàng copy-paste

**Mẫu Prompt Cơ Bản Cho Website Nhiều Trang:**

```
Tạo một gói website hoàn chỉnh cho [PRODUCT_TYPE] với các yêu cầu sau:

**Thông tin dự án:**
- Loại sản phẩm: [SaaS / E-commerce / Dịch vụ / Portfolio / v.v...]
- Phong cách: [tối giản / thanh lịch / hiện đại / táo bạo / v.v...]
- Ngành nghề: [Y tế / Fintech / Làm đẹp / v.v...]
- Tech Stack: [html-tailwind / react / nextjs / v.v...]
- Các trang cần tạo: home, about, [thêm trang khác nếu cần]

**Quy trình thực hiện:**
1. Sử dụng kỹ năng ui-ux để tìm kiếm thông số thiết kế bằng chế độ hybrid
2. Xây dựng các component dùng chung trước (Header, Footer, Button, Card)
3. Triển khai thiết kế các trang theo thứ tự
4. Đảm bảo tính nhất quán về màu sắc, typography và khoảng cách (spacing)
5. Xác minh bằng danh sách pre-delivery checklist

**Yêu cầu chất lượng:**
- ✅ Hệ thống thiết kế (design system) nhất quán
- ✅ Thiết kế responsive hoàn chỉnh (320px, 768px, 1024px, 1440px)
- ✅ Đảm bảo khả năng tiếp cận (tối thiểu chuẩn WCAG AA)
- ✅ Tối ưu hiệu năng tải trang
```

## Các Quy Trình Ví Dụ

### Ví dụ 1: Một Trang Landing Page Đơn Lẻ

**Yêu cầu từ người dùng:** "Tạo một trang landing page cho dịch vụ chăm sóc da chuyên nghiệp"

**Luồng xử lý của Agent:**

```bash
# 1. Tìm kiếm theo loại sản phẩm
python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness service" --domain product

# 2. Tìm phong cách (sử dụng chế độ hybrid để có kết quả tốt nhất)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant minimal soft" --domain style --mode hybrid

# 3. Tìm cặp font chữ phù hợp
python3 heraspec/skills/ui-ux/scripts/search.py "elegant luxury" --domain typography

# 4. Tìm bảng màu
python3 heraspec/skills/ui-ux/scripts/search.py "beauty spa wellness" --domain color

# 5. Tìm cấu trúc landing page
python3 heraspec/skills/ui-ux/scripts/search.py "hero-centric social-proof" --domain landing

# 6. Tìm các tiêu chuẩn UX
python3 heraspec/skills/ui-ux/scripts/search.py "animation" --domain ux
python3 heraspec/skills/ui-ux/scripts/search.py "accessibility" --domain ux

# 7. Tìm các chỉ dẫn theo stack (mặc định: html-tailwind)
python3 heraspec/skills/ui-ux/scripts/search.py "layout responsive" --stack html-tailwind
```

**Sau đó:** Tổng hợp các kết quả tìm kiếm được và bắt đầu triển khai code giao diện.

### Ví dụ 2: Gói Thiết Kế Website Nhiều Trang

**Yêu cầu từ người dùng:** "Tạo gói website đầy đủ cho một cửa hàng thời trang trực tuyến cao cấp"

**Luồng xử lý của Agent:**

```bash
# 1. Tìm loại sản phẩm e-commerce
python3 heraspec/skills/ui-ux/scripts/search.py "e-commerce luxury fashion" --domain product

# 2. Tìm phong cách phù hợp (chế độ hybrid)
python3 heraspec/skills/ui-ux/scripts/search.py "elegant premium sophisticated" --domain style --mode hybrid

# 3. Tìm kiếm cấu trúc cho từng loại trang cụ thể
python3 heraspec/skills/ui-ux/scripts/search.py "home homepage" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-category shop catalog" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "product-detail single-product" --domain pages
python3 heraspec/skills/ui-ux/scripts/search.py "pricing plans tiers" --domain pages

# 4. Tìm cặp font chữ và bảng màu phù hợp
python3 heraspec/skills/ui-ux/scripts/search.py "elegant luxury" --domain typography
python3 heraspec/skills/ui-ux/scripts/search.py "e-commerce luxury" --domain color

# 5. Tìm các nguyên tắc UX nâng cao
python3 heraspec/skills/ui-ux/scripts/search.py "conversion optimization" --domain ux
```

**Sau đó:**
1. Tạo các component dùng chung (Header, Footer, Button, Card).
2. Xây dựng từng trang dựa trên các cấu trúc trang đã tìm kiếm được.
3. Đảm bảo giao diện đồng bộ xuyên suốt tất cả các trang.
4. Kiểm tra kỹ lưỡng sản phẩm bằng checklist pre-delivery.

## Xác Minh Giao Diện

Trước khi bàn giao mã nguồn giao diện UI/UX, hãy kiểm tra lại bằng danh sách kiểm tra:

```bash
# Xem checklist
cat heraspec/skills/ui-ux/templates/pre-delivery-checklist.md
```

Hoặc sử dụng bảng checklist có sẵn trong tệp `skill.md`.

## Hướng Dẫn Sửa Lỗi

### Không tìm thấy lệnh Python

Nếu bạn nhận được thông báo lỗi `python3: command not found`:

```bash
# Kiểm tra xem Python đã được cài đặt ở đường dẫn khác chưa
which python3 || which python

# Tiến hành cài đặt Python nếu chưa có (Xem mục Điều Kiện Tiên Quyết)
```

### Script báo lỗi phân quyền (Permission denied)

Chạy lệnh phân quyền thực thi cho script:

```bash
chmod +x heraspec/skills/ui-ux/scripts/search.py
```

### Không tìm thấy file dữ liệu (Data files not found)

Đảm bảo bạn đã sao chép đầy đủ thư mục `data/`:

```bash
ls heraspec/skills/ui-ux/data/
# Sẽ hiển thị: charts.csv, colors.csv, landing.csv, products.csv, v.v...
```

## Cài Đặt Thư Viện Bổ Sung Cho Vector/Hybrid Search

Để có thể sử dụng chế độ tìm kiếm Vector hoặc Hybrid, hãy cài đặt các thư viện Python bổ sung sau:

```bash
pip install sentence-transformers scikit-learn
```

**Lưu ý**: Đây là bước không bắt buộc. Chế độ tìm kiếm mặc định BM25 hoạt động tốt mà không yêu cầu thêm bất kỳ thư viện nào khác.

## Tài Liệu Tham Khảo

- [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) - Hướng dẫn chung về hệ thống skills của HeraSpec.
- [SKILLS_STRUCTURE_PROPOSAL.md](SKILLS_STRUCTURE_PROPOSAL.md) - Đề xuất cấu trúc chi tiết của các skill.
- [UI UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) - Dự án gốc là nền tảng xây dựng nên UI/UX Builder.
