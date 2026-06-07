---
name: deploy-documentation
description: Tự động hoá quy trình chụp screenshot và cập nhật documentation sau mỗi lần build & deploy — discover routes, generate manifest, capture screenshots, update HTML. Hoạt động với mọi loại web application.
projectType: all
---

# Deploy Documentation — Auto Screenshot & Docs Generator

## Purpose

Skill này tự động hoá quy trình chụp ảnh màn hình và cập nhật documentation sau mỗi lần build & deploy sản phẩm. Thay vì developer phải truy cập thủ công từng trang, chụp ảnh, rồi cập nhật landing page — skill này thực hiện toàn bộ quy trình một cách tự động và nhất quán.

**Vấn đề giải quyết:**
- Sau khi build xong plugin/module/software, developer phải truy cập từng trang tính năng trên site
- Chụp ảnh thủ công, dễ sai sót (quên cập nhật mô tả)
- Tốn thời gian khi có nhiều route, lặp lại mỗi version

## When to Use

- Sau mỗi lần release / deploy phiên bản mới
- Khi cần sync documentation screenshots với UI thực tế
- Khi thêm tính năng mới chưa có trong manifest
- Khi cần chụp ảnh từ nhiều site khác nhau (local, demo, client)

---

## Architecture: 2 Phases

```
Phase 1: DISCOVER — Quét codebase → Suggest manifest entries
Phase 2: CAPTURE  — Đọc manifest → Login → Navigate → Screenshot → Update HTML
```

---

## Phase 1: Route Discovery & Manifest Generation

### Mục đích
Tự động quét codebase để phát hiện routes/pages, sau đó suggest thêm entries vào `deploy_manifest.json`.

### Cách hoạt động

**1. Quét routes — tìm tất cả route definitions trong codebase:**

| Project Type | Source files |
|---|---|
| Perfex CRM Module | `config/my_routes.php` + controller method names |
| Laravel App | `routes/web.php`, `routes/api.php` |
| WordPress Plugin | `add_menu_page()`, `add_submenu_page()` hooks |
| Next.js / Vite SPA | `pages/` directory, router config files |
| Electron App | Window/view registrations |
| Generic | Navigation config files, sitemap |

**2. Quét menu registrations — tìm sidebar/nav menu items:**
- Perfex CRM: `$this->app_menu->add_sidebar_menu_item()` calls
- WordPress: `add_menu_page()`, `add_submenu_page()`
- Generic: tìm navigation config files

**3. Quét migration changelog:**
- Parse `logChanged()` hoặc `CHANGELOG.md` để detect features mới chưa có trong manifest

**4. Cross-reference với manifest:**
- So sánh routes discovered vs entries đã khai báo → suggest entries còn thiếu

### Discovery Scan Targets (Perfex CRM modules — example)

```
modules/{module}/config/my_routes.php       → Route definitions
modules/{module}/data_builder.php           → Menu items (add_sidebar_menu_item)
modules/{module}/controllers/*.php          → Controller methods = pages
modules/{module}/views/admin/**/*.php       → View templates
modules/{module}/migrations/*_version_*.php → Changelog (logChanged)
```

### Output Format — Suggested Entry

```json
{
  "id": "auto-discovered-{route}",
  "filename": "{Feature-Name}-{Product}.png",
  "title": "{Feature Name}",
  "route": "/admin/{module}/{controller}/{method}",
  "wait_for": "#app, .panel, .table-responsive",
  "section": "core-features",
  "actions_before": [
    { "action": "wait", "ms": 2000 }
  ],
  "_discovered_from": "controller: Builder.php → method: index()",
  "_status": "suggested"
}
```

> **IMPORTANT**: Entries có `_status: "suggested"` cần user review và confirm trước khi chạy Phase 2. Agent MUST NOT auto-proceed.

### Site Suggestion Logic (khi discover)

| Loại page | Site đề xuất | Lý do |
|---|---|---|
| Admin management pages | `local` | Không cần real data |
| Charts, runtime reports | `demo` | Cần data đẹp, trực quan |
| Public embed / iframe | `demo` | Cần public view đã setup |
| Client-specific feature | `client_x` | Cần data thực tế của client |

---

## Phase 2: Screenshot Capture & Documentation Update

### Prerequisites
- File `deploy_manifest.json` đã được review và xác nhận
- Site đang chạy và accessible tại `base_url`
- Credentials hợp lệ

### Step 1: Build Site Groups

```
1. Đọc manifest.sites{} và manifest.default_site
2. Với mỗi entry trong screenshots[]:
   - Nếu entry có "site" key → site = sites[entry.site]
   - Nếu không → site = sites[default_site]
3. Group entries by site key → { local: [...], demo: [...], client_x: [...] }
```

### Step 2: Login (một lần mỗi site)

```
Foreach unique_site in groups:
  site_config = sites[unique_site]
  1. Mở browser tab mới tại: {site_config.base_url}{site_config.login_url}
  2. Điền credentials:
       - email_selector ← site_config.login_form.email_selector
       - password_selector ← site_config.login_form.password_selector
  3. Click submit: site_config.login_form.submit_selector
  4. Chờ redirect hoặc dashboard element xuất hiện
  5. Lưu session/cookies cho site này
  Log: ✅ Logged in to {site_config.base_url} / ❌ Login failed
```

**login_form supports:**
- Perfex CRM: `input[name='email']` + `input[name='password']`
- WordPress: `input#user_login` + `input#user_pass`
- Laravel / generic: any valid CSS selector

### Step 3: Screenshot Loop

```
Foreach entry in manifest.screenshots[]:
  site_config = sites[entry.site || default_site]
  base_url    = site_config.base_url

  1. Navigate tới {base_url}{entry.route}
     Resolve dynamic tokens nếu có:
       {first_view_id}      → Scrape view list page → first row ID
       {first_view_route}   → Scrape view list page → first row route slug
       {first_public_route} → Scrape views → first with public_access indicator
       {latest_record_id}   → Scrape or sort by date → most recent ID

  2. Set viewport: entry.viewport || manifest.defaults.viewport

  3. Execute actions_before[] theo thứ tự:
       wait                → sleep(ms)
       click               → click(selector)
       click_first_visible → find first visible element → click
       scroll_down         → window.scrollBy(0, px)
       scroll_to           → element.scrollIntoView()
       type                → type text into selector (for search/filter inputs)

  4. Wait for: entry.wait_for selector to appear in DOM

  5. Capture screenshot:
       format = entry.format || manifest.defaults.format
       Save → {output.images_dir}/{entry.filename}

  Log: ✅ {entry.id} → {entry.filename} / ❌ reason
```

### Step 4: HTML Update (Optional)

```
1. Đọc index.html
2. Cập nhật version number từ source code
3. Cập nhật date (Updated: {current month year})
4. Parse changelog từ migration file → inject vào #changelog-content
5. Verify tất cả <img src="images/..."> đều có file tương ứng
6. Save index.html
```

---

## Manifest Format Reference

Tạo file `deploy_manifest.json` **cùng folder với `AGENTS.heraspec.md` và thư mục `heraspec/`** của project/module đó — không nhất thiết là root của toàn bộ monorepo:

```json
{
  "product": {
    "name": "Product Name",
    "tagline": "Short description",
    "version_source": "path/to/version_file",
    "changelog_source": "path/to/migration_or_changelog"
  },

  "sites": {
    "local": {
      "base_url": "https://localhost:PORT",
      "login_url": "/admin/authentication",
      "login_form": {
        "email_selector": "input[name='email']",
        "password_selector": "input[name='password']",
        "submit_selector": "button[type='submit']"
      },
      "credentials": {
        "email": "admin@admin.com",
        "password": "password"
      },
      "description": "Local dev"
    },
    "demo": {
      "base_url": "https://demo.example.com",
      "login_url": "/admin/authentication",
      "login_form": {
        "email_selector": "input[name='email']",
        "password_selector": "input[name='password']",
        "submit_selector": "button[type='submit']"
      },
      "credentials": {
        "email": "admin@demo.com",
        "password": "password"
      },
      "description": "Live demo site for marketing screenshots"
    }
  },

  "default_site": "local",

  "output": {
    "images_dir": "path/to/documentation/images",
    "html_file": "path/to/documentation/index.html"
  },

  "defaults": {
    "viewport": { "width": 1440, "height": 900 },
    "format": "png",
    "wait_ms": 2000
  },

  "screenshots": [
    {
      "id": "feature-overview",
      "filename": "Feature-Overview-ProductName.png",
      "title": "Feature Overview",
      "route": "/admin/module/page",
      "wait_for": "#app, .panel, .table-responsive",
      "section": "core-features",
      "actions_before": [
        { "action": "wait", "ms": 2000 }
      ]
    },
    {
      "id": "feature-on-demo",
      "site": "demo",
      "filename": "Feature-Demo-ProductName.png",
      "title": "Feature (Demo Data)",
      "route": "/admin/module/page",
      "wait_for": ".chart-container",
      "section": "core-features",
      "actions_before": [
        { "action": "wait", "ms": 3000 }
      ]
    }
  ]
}
```

### Dynamic Route Tokens

| Token | Resolution |
|-------|-----------|
| `{first_view_id}` | ID của record đầu tiên trong view list |
| `{first_view_route}` | Route slug của view đầu tiên |
| `{first_public_route}` | Route của view public đầu tiên |
| `{latest_record_id}` | ID của record mới nhất |

Agent resolves các token này bằng cách scrape trang list hoặc query database.

---

## Prompt Templates

### Full workflow (Discover + Capture):

```
Sử dụng skill deploy-documentation.
Project: {module_path}
Manifest: {manifest_path}

1. Phase 1: Quét codebase tại {module_path}, phát hiện routes/features chưa có trong manifest, suggest entries mới (đề xuất site phù hợp cho từng entry)
2. Tôi sẽ review và confirm manifest
3. Phase 2: Login vào từng site trong manifest, chụp tất cả screenshots, lưu vào images_dir
4. Cập nhật index.html với ảnh mới và changelog
```

### Chỉ chụp ảnh — tất cả sites (manifest đã sẵn):

```
Sử dụng skill deploy-documentation.
Đọc manifest tại {manifest_path}.
Login vào từng site được khai báo, chụp tất cả screenshots theo manifest, lưu vào output.images_dir.
```

### Chỉ chụp ảnh — 1 site cụ thể:

```
Sử dụng skill deploy-documentation.
Đọc manifest tại {manifest_path}.
Chỉ chụp các screenshots thuộc site "demo".
Login vào demo site, navigate và capture, lưu vào images_dir.
```

### Chỉ chụp lại 1 số ảnh cụ thể:

```
Sử dụng skill deploy-documentation.
Đọc manifest tại {manifest_path}.
Chỉ chụp lại các entries: {id1}, {id2}, {id3}.
Sử dụng site mặc định (default_site) trừ khi entry có khai báo site riêng.
```

### Chỉ discover — suggest entries mới:

```
Sử dụng skill deploy-documentation.
Quét codebase tại {module_path}, so sánh với manifest tại {manifest_path}.
Suggest entries mới cho features/routes chưa được khai báo.
Với mỗi entry mới: đề xuất site phù hợp (local nếu là admin page, demo nếu cần real-data screenshot).
Không tự thêm vào manifest — liệt kê để tôi review trước.
```

---

## Compatibility — Supported Project Types

| Project Type | Route Discovery Source |
|---|---|
| Perfex CRM Module | `my_routes.php` + controller methods |
| Laravel App | `routes/web.php` + `routes/api.php` |
| WordPress Plugin | `add_menu_page()` + `add_submenu_page()` |
| Next.js / Vite SPA | `pages/` directory + router config |
| Electron App | Window/view registrations |
| Generic Web App | Navigation config files, sitemap |

Mỗi project chỉ cần 1 file `deploy_manifest.json` riêng. Cùng skill, cùng workflow.

---

## File Structure (per project/module)

`deploy_manifest.json` nằm **cùng folder với `AGENTS.heraspec.md` và `heraspec/`** của module/project đó:

```
{heraspec_workspace_dir}/        ← Thư mục chứa AGENTS.heraspec.md
├── AGENTS.heraspec.md
├── heraspec/
├── deploy_manifest.json         ← Đặt tại đây
└── documentation/
    ├── index.html
    └── images/
```

**Ví dụ với Perfex CRM** (mỗi module là một workspace HeraSpec riêng):

```
perfex_crm/
└── modules/
    ├── data_builder/
    │   ├── AGENTS.heraspec.md
    │   ├── heraspec/
    │   ├── deploy_manifest.json    ← manifest của data_builder
    │   └── documentation/
    └── another_module/
        ├── AGENTS.heraspec.md
        ├── heraspec/
        ├── deploy_manifest.json    ← manifest riêng của another_module
        └── documentation/
```

> **Rule**: `deploy_manifest.json` luôn nằm cùng cấp với `AGENTS.heraspec.md` và `heraspec/` — dù workspace đó là module con hay project độc lập.


---

## Inputs

- `deploy_manifest.json` — manifest file của project (xem templates/deploy_manifest.template.json)
- Codebase path — để Phase 1 discover routes
- Running site — để Phase 2 capture screenshots

## Outputs

- Screenshot PNG/WebP files tại `output.images_dir`
- Updated `index.html` tại `output.html_file`
- Suggested entries (Phase 1 only) — danh sách để user review

## Limitations

- Yêu cầu browser agent có khả năng điều khiển browser (navigate, click, screenshot)
- Login session không persistent giữa các lần chạy — phải login lại mỗi session
- Dynamic tokens (`{first_view_id}`, v.v.) cần site đang có dữ liệu thực
- HTML auto-update chỉ hoạt động nếu `index.html` có structure đúng format (có `#changelog-content`, `<img>` tags với đúng src pattern)
