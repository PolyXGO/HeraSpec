# Checklist Cập Nhật HeraSpec

Tài liệu này đóng vai trò như một lời nhắc nhở cho các nhà phát triển khi cập nhật mã nguồn của HeraSpec. Khi thêm các tính năng, lệnh mới hoặc các khả năng mới, hãy đảm bảo tất cả tài liệu và hướng dẫn đi kèm đều được cập nhật tương ứng.

## Khi Thêm Lệnh CLI Mới

### ✅ Các Cập Nhật Bắt Buộc

1. **Lệnh Trợ Giúp** (`src/commands/helper.ts`):
   - [ ] Thêm lệnh mới vào phương thức `showCommands()`
   - [ ] Thêm các ví dụ prompt trong `showExamplePrompts()` nếu có
   - [ ] Thêm các bước quy trình trong `showWorkflow()` nếu lệnh đó là một phần của quy trình chính
   - [ ] Thêm các mẹo hữu ích trong `showTips()` nếu có các thực hành tốt nhất (best practices)

2. **Hướng Dẫn Sử Dụng** (`docs/vi/USER_GUIDE.md`):
   - [ ] Thêm lệnh mới vào phần Các lệnh CLI
   - [ ] Thêm các ví dụ sử dụng thực tế
   - [ ] Thêm vào phần quy trình làm việc nếu áp dụng
   - [ ] Thêm bất kỳ lưu ý quan trọng hoặc hạn chế nào

3. **README** (`README.md`):
   - [ ] Cập nhật phần CLI Commands (Các lệnh CLI)
   - [ ] Thêm vào danh sách tính năng nếu đó là tính năng quan trọng

4. **Quy Trình Build** (`build.js`):
   - [ ] Đảm bảo các template/tài nguyên mới được sao chép vào `dist/` nếu cần
   - [ ] Xác minh lệnh hoạt động bình thường sau khi build

### 📝 Ví dụ: Thêm lệnh `heraspec make test`

**Cập nhật Helper:**
- Đã thêm vào danh sách lệnh
- Đã thêm phần ví dụ prompt mẫu
- Đã thêm bước quy trình làm việc
- Đã thêm các mẹo về các loại test

**Cập nhật Docs:**
- Đã thêm vào phần các lệnh CLI
- Đã thêm các ví dụ sử dụng
- Đã tích hợp vào quy trình làm việc

## Khi Thêm Skill Mới

### ✅ Các Cập Nhật Bắt Buộc

1. **Bản Đồ Template Skill** (`src/core/templates/skills-template-map.ts`):
   - [ ] Đăng ký skill mới vào `SKILL_TEMPLATE_MAP`
   - [ ] Xác định rõ skill đó là dùng chung (cross-cutting) hay theo dự án (project-specific)
   - [ ] Bao gồm các thư mục tài nguyên đi kèm nếu cần thiết

2. **File Template Skill** (`src/core/templates/skills/<skill-name>-skill.md`):
   - [ ] Tạo template `skill.md`
   - [ ] Viết đầy đủ các phần bắt buộc (Mục đích, Khi nào sử dụng, Quy trình từng bước, v.v...)
   - [ ] Thêm các templates/scripts/examples nếu áp dụng

3. **Quy Trình Build** (`build.js`):
   - [ ] Đảm bảo các template skill được copy vào thư mục `dist/core/templates/skills/`
   - [ ] Xác minh lệnh `heraspec skill add <skill-name>` hoạt động tốt

4. **Tài Liệu**:
   - [ ] Cập nhật `docs/vi/SKILLS_SYSTEM.md` nếu cấu trúc skill thay đổi
   - [ ] Thêm skill vào các ví dụ trong hướng dẫn sử dụng nếu quan trọng

### 📝 Ví dụ: Thêm các Skill Kiểm Thử (Test Skills)

**Cập nhật Template Map:**
- Đăng ký `unit-test`, `integration-test`, `e2e-test` vào bản đồ template map
- Đánh dấu chúng là các skill dùng chung (cross-cutting)

**Các File Template:**
- Đã tạo `unit-test-skill.md`
- Đã tạo `integration-test-skill.md`
- Đã tạo `e2e-test-skill.md`

**Build:**
- Các template tự động được sao chép qua quy trình build hiện tại

## Khi Chỉnh Sửa Các Chức Năng Cốt Lõi

### ✅ Các Cập Nhật Bắt Buộc

1. **Thay Đổi Gây Lỗi (Breaking Changes)**:
   - [ ] Cập nhật phiên bản (version) trong `package.json`
   - [ ] Thêm hướng dẫn migration nếu cần
   - [ ] Cập nhật `docs/vi/INIT_SAFETY.md` nếu hành vi khởi tạo (init) thay đổi

2. **Dependencies Mới**:
   - [ ] Thêm vào `dependencies` hoặc `devDependencies` trong `package.json`
   - [ ] Cập nhật `docs/vi/DEVELOPMENT_SETUP.md` nếu cần
   - [ ] Ghi lại tài liệu trong README nếu người dùng cần biết

3. **Thay Đổi Cấu Hình**:
   - [ ] Cập nhật `src/core/config.ts` nếu thêm hằng số mới
   - [ ] Cập nhật templates nếu cấu trúc file config thay đổi
   - [ ] Ghi lại tài liệu trong hướng dẫn sử dụng

## Template Checklist

Khi thêm tính năng mới, hãy sử dụng checklist này:

```
## Tính năng: [Tên tính năng]

### Thay Đổi Code
- [ ] Triển khai phần cốt lõi (core)
- [ ] Lệnh CLI (nếu áp dụng)
- [ ] Viết test (nếu áp dụng)

### Tài Liệu
- [ ] Cập nhật lệnh helper
- [ ] Cập nhật hướng dẫn sử dụng (User Guide)
- [ ] Cập nhật README (nếu quan trọng)
- [ ] Cập nhật tài liệu API (nếu áp dụng)

### Tích Hợp
- [ ] Xác minh quy trình build
- [ ] Sao chép templates (nếu áp dụng)
- [ ] Đăng ký skills (nếu áp dụng)

### Kiểm Thử
- [ ] Hoàn thành kiểm thử thủ công
- [ ] Hoạt động tốt sau khi chạy `npm run build`
- [ ] Hoạt động tốt khi sử dụng `npm link`
```

## Lưu Ý Quan Trọng

1. **Luôn cập nhật helper đầu tiên**: Lệnh trợ giúp (helper) là điểm tham khảo đầu tiên của người dùng.
2. **Đồng bộ hóa tài liệu**: Hướng dẫn sử dụng phải phản ánh chính xác tất cả khả năng của CLI.
3. **Kiểm thử sau khi build**: Luôn xác minh các tính năng hoạt động tốt sau khi build.
4. **Cập nhật ví dụ**: Nếu thêm lệnh mới, hãy thêm các ví dụ vào helper và tài liệu.
5. **Xem xét tính tương thích ngược**: Ghi lại các thay đổi gây lỗi (breaking changes) một cách rõ ràng.

## Các Cập Nhật Gần Đây

### Test Skills & Commands (2026-01-03)
- ✅ Thêm các skill unit-test, integration-test, e2e-test
- ✅ Thêm lệnh `heraspec make test`
- ✅ Thêm lệnh `heraspec suggest`
- ✅ Cập nhật lệnh helper
- ✅ Cập nhật hướng dẫn sử dụng (User Guide)

### Tự Động Tạo Tài Liệu (2026-01-03)
- ✅ Thêm lệnh `heraspec make docs`
- ✅ Thêm tùy chọn `--agent`
- ✅ Cập nhật lệnh helper
- ✅ Cập nhật hướng dẫn sử dụng (User Guide)
