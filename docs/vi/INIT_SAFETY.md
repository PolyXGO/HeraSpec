# Khởi tạo HeraSpec (HeraSpec Init) - Hướng Dẫn An Toàn

## Tổng Quan

Khi chạy lệnh `heraspec init` trên một dự án đã được khởi tạo trước đó, HeraSpec sẽ **AN TOÀN** đối với dữ liệu hiện có và sẽ chỉ **THÊM** các tính năng mới.

## Dữ Liệu Được Bảo Vệ (KHÔNG BỊ THAY ĐỔI)

### ✅ Changes (Các Thay Đổi Đang Thực Hiện)
- **Vị trí**: `heraspec/changes/`
- **Trạng thái**: **AN TOÀN 100%**
- **Hành vi**: Chỉ tạo thư mục nếu chưa tồn tại, không xóa hay chỉnh sửa nội dung bên trong.

### ✅ Specs (Thông Số Kỹ Thuật)
- **Vị trí**: `heraspec/specs/`
- **Trạng thái**: **AN TOÀN 100%**
- **Hành vi**: Chỉ tạo thư mục nếu chưa tồn tại, không xóa hay chỉnh sửa nội dung bên trong.

### ✅ Archives (Lưu Trữ)
- **Vị trí**: `heraspec/archives/`
- **Trạng thái**: **AN TOÀN 100%**
- **Hành vi**: Chỉ tạo thư mục nếu chưa tồn tại, không xóa hay chỉnh sửa nội dung bên trong.

### ✅ project.md
- **Vị trí**: `heraspec/project.md`
- **Trạng thái**: **AN TOÀN** (nếu đã tồn tại)
- **Hành vi**: 
  - Nếu file đã tồn tại: **KHÔNG ghi đè**, giữ nguyên nội dung cũ.
  - Nếu file chưa tồn tại: Tạo file mới từ template.

### ✅ config.yaml
- **Vị trí**: `heraspec/config.yaml`
- **Trạng thái**: **AN TOÀN** (nếu đã tồn tại)
- **Hành vi**:
  - Nếu file đã tồn tại: **KHÔNG ghi đè**, giữ nguyên nội dung cũ.
  - Nếu file chưa tồn tại: Tạo file mới từ template.

## Dữ Liệu Được Thêm Mới (BỔ SUNG MỚI)

### ✅ Thư mục Skills
- **Vị trí**: `heraspec/skills/`
- **Trạng thái**: **MỚI** (chỉ tạo cấu trúc thư mục, không tự động copy các skill)
- **Hành vi**:
  - Tạo thư mục `heraspec/skills/` nếu chưa tồn tại.
  - Tạo file `heraspec/skills/README.md` nếu chưa tồn tại.
  - **KHÔNG tự động copy** các skill từ thư viện gốc của HeraSpec vào dự án.
  - **KHÔNG xóa** các skill hiện có (nếu bạn đã tự tạo hoặc copy trước đó).
- **Lưu ý**: Các skill cần được **tạo thủ công** hoặc **copy từ template** trong core của HeraSpec (`src/core/templates/skills/`) vào dự án khi cần thiết. Xem [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) để biết cách thêm skill.

### ✅ AGENTS.heraspec.md (Merge thông minh, không ghi đè)
- **Vị trí**: `AGENTS.heraspec.md` (ở thư mục gốc của dự án)
- **Trạng thái**: **MERGE THÔNG MINH**
- **Hành vi**: 
  - **Dự án mới**: Tạo file mới với đầy đủ template.
  - **Dự án đã tồn tại**: 
    - Giữ nguyên toàn bộ nội dung tùy chỉnh hiện có.
    - Nếu phần "## Skills System" chưa tồn tại: **Thêm phần mới này** vào trước phần "## Rules".
    - Nếu phần "## Skills System" đã tồn tại: **Cập nhật** phần đó với nội dung mới nhất.
    - **KHÔNG xóa** các tùy chỉnh khác của bạn.
- **Lý do**: Đảm bảo các AI agent có hướng dẫn mới nhất về hệ thống Skills mà không làm mất đi các tùy chỉnh khác của bạn.

## Tóm Tắt

| Thành phần | Trạng thái | Hành vi |
|------|--------|----------|
| `heraspec/changes/` | ✅ An toàn | Chỉ tạo thư mục, không xóa/sửa đổi |
| `heraspec/specs/` | ✅ An toàn | Chỉ tạo thư mục, không xóa/sửa đổi |
| `heraspec/archives/` | ✅ An toàn | Chỉ tạo thư mục, không xóa/sửa đổi |
| `heraspec/project.md` | ✅ An toàn | Không ghi đè nếu đã tồn tại |
| `heraspec/config.yaml` | ✅ An toàn | Không ghi đè nếu đã tồn tại |
| `heraspec/skills/` | ✅ Mới | Tạo thư mục và file README nếu chưa tồn tại |
| `AGENTS.heraspec.md` | ✅ Merge thông minh | **Thêm/Cập nhật** phần Skills, giữ nguyên phần còn lại |

## Khuyến Nghị

### Trước khi chạy `heraspec init`:

1. **Backup (không bắt buộc, nhưng khuyến nghị)**:
   ```bash
   cp AGENTS.heraspec.md AGENTS.heraspec.md.backup
   ```

2. **Kiểm tra git status** (nếu sử dụng git):
   ```bash
   git status
   git add -A
   git commit -m "Backup before heraspec init update"
   ```

**Lưu ý**: Với logic merge mới, bạn không cần phải backup vì nội dung cũ sẽ được giữ nguyên, chỉ có phần Skills là được thêm vào hoặc cập nhật.

### Sau khi chạy `heraspec init`:

1. **Kiểm tra file AGENTS.heraspec.md**:
   - Kiểm tra xem phần "## Skills System" đã được thêm hoặc cập nhật chưa.
   - Xác nhận các tùy chỉnh khác của bạn vẫn còn nguyên vẹn.
   - Nếu có vấn đề, bạn có thể khôi phục lại từ bản backup.

2. **Kiểm tra thư mục skills**:
   ```bash
   ls -la heraspec/skills/
   # Sẽ thấy file README.md
   ```

3. **Xác minh dữ liệu**:
   ```bash
   heraspec list              # Kiểm tra các thay đổi (changes)
   heraspec list --specs      # Kiểm tra các thông số kỹ thuật (specs)
   ```

## Các Kịch Bản Thử Nghiệm

### Kịch bản 1: Dự án mới hoàn toàn
```bash
heraspec init
# → Tạo toàn bộ cấu trúc mới
# → Tạo project.md, config.yaml, AGENTS.heraspec.md
# → Tạo thư mục skills/
```

### Kịch bản 2: Dự án đã có sẵn changes và specs
```bash
heraspec init
# → Giữ nguyên heraspec/changes/ (các thay đổi đang thực hiện)
# → Giữ nguyên heraspec/specs/ (các specs hiện tại)
# → Giữ nguyên heraspec/project.md (nếu đã có)
# → Thêm thư mục heraspec/skills/
# → Cập nhật AGENTS.heraspec.md với hướng dẫn mới
```

### Kịch bản 3: Dự án đã có sẵn thư mục skills
```bash
heraspec init
# → Giữ nguyên heraspec/skills/ (các skill hiện có)
# → Chỉ tạo README.md nếu chưa có
# → Cập nhật AGENTS.heraspec.md
```

## Kết Luận

**✅ AN TOÀN**: Tất cả dữ liệu của dự án (changes, specs, archives, project.md, config.yaml) đều được bảo vệ.

**✅ BỔ SUNG**: Hệ thống Skills được thêm vào mà không ảnh hưởng đến dữ liệu hiện có.

**✅ MERGE THÔNG MINH**: File `AGENTS.heraspec.md` được gộp một cách thông minh:
- Giữ nguyên toàn bộ nội dung cũ.
- Chỉ thêm/cập nhật phần "## Skills System".
- Không xóa các tùy chỉnh của bạn.

**📝 LƯU Ý VỀ SKILLS**:
- `heraspec init` chỉ tạo thư mục `heraspec/skills/` và file `README.md`.
- Các skill **KHÔNG tự động được copy** vào dự án.
- Bạn cần **tạo hoặc copy** các skill vào thư mục `heraspec/skills/` khi cần sử dụng.
- Các skill mẫu có sẵn trong core của HeraSpec nhưng cần được copy thủ công.
- Xem [SKILLS_SYSTEM.md](SKILLS_SYSTEM.md) để biết cách thêm skill vào dự án.
