## Executive Summary
- [Inferred | High] Codebase nay la mot modular monolith tren Laravel + Botble, trong do `app/` giu vai tro shell mong va phan lon nghiep vu nam o `platform/core`, `platform/packages`, `platform/plugins`, `platform/themes`.
  Evidence: `composer.json:14`, `composer.json:32`, `bootstrap/app.php:8`, `routes/web.php`.
- [Observed | High] Kha nang mo rong va tich hop cao nhờ plugin/theme architecture, hook/filter, API package, Social Login, media driver da cloud va data synchronization tooling.
  Evidence: `platform/core/base/helpers/action-filter.php:8`, `platform/packages/plugin-management/src/Providers/PluginManagementServiceProvider.php:28`, `vendor/botble/api/routes/api.php:6`, `platform/core/media/src/Providers/MediaServiceProvider.php:159`, `vendor/botble/data-synchronize/src/Providers/DataSynchronizeServiceProvider.php:44`.
- [Observed | High] Rui ro chinh can uu tien: logic vo hieu hoa CSRF trong admin o production, `APP_DEBUG=true` khi `APP_ENV=production`, va tin hieu test coverage o root con mong.
  Evidence: `platform/core/base/src/Providers/EventServiceProvider.php:197`, `.env:3`, `.env:4`, `phpunit.xml:17`, `tests/Feature/ExampleTest.php`.

## Technology Profile
- [Observed | High] Backend: PHP `^8.3|^8.4`, Laravel `^13.0`, Botble API `^2.1`, Sanctum `^4.0`.
  Evidence: `composer.json:8`, `composer.json:14`, `composer.json:32`, `composer.json:33`.
- [Observed | High] Plugin/theme dependency composition dung `wikimedia/composer-merge-plugin`, merge plugin/theme `composer.json` vao runtime.
  Evidence: `composer.json:36`, `composer.json:98`, `composer.json:99`.
- [Observed | High] Frontend build theo `laravel-mix`, monorepo NPM workspaces cho core/packages/plugins/themes; co su dung Vue 3.
  Evidence: `package.json:3`, `package.json:5`, `package.json:6`, `package.json:7`, `package.json:8`, `package.json:28`, `package.json:47`.
- [Observed | Medium] Tooling quality gate duoc khai bao o dependency (`larastan`, `pint`, `rector`, `phpunit`) nhung chua thay root config rieng cho phpstan/pint/rector.
  Evidence: `composer.json:44`, `composer.json:47`, `composer.json:51`, `composer.json:52`.
- [Observed | Medium] Deployment local/dev co `docker-compose` theo Laravel Sail runtime 8.2 + MySQL 8.0; chua thay GitHub workflow o repo.
  Evidence: `docker-compose.yml`, `__NO_GITHUB_WORKFLOWS__` (filesystem check).

## Repository Topology
- [Observed | High] Root co cac nhom thu muc chinh: `app`, `config`, `routes`, `platform`, `resources`, `tests`, `vendor`, `_analytics`.
  Evidence: root directory listing.
- [Observed | High] `platform` duoc to chuc theo 4 nhom lon:
  - `core` (10 subdirs)
  - `packages` (13 subdirs)
  - `plugins` (17 subdirs)
  - `themes` (1 subdir: `ripple`)
  Evidence: `platform/` directory stats.
- [Observed | High] Plugins hien dien: `analytics`, `audit-log`, `backup`, `block`, `blog`, `captcha`, `contact`, `cookie-consent`, `custom-field`, `fob-comment`, `gallery`, `language`, `language-advanced`, `member`, `request-log`, `social-login`, `translation`.
  Evidence: `platform/plugins/*` directory listing.
- [Observed | High] Surface route theo module rat lon: 44 route files trong `platform/**/routes` (34 `web.php`, 5 `api.php`) va 97 `*ServiceProvider.php`.
  Evidence: recursive file counts.

## Architecture and Dependency Flow
- [Observed | High] Bootstrap app-level chi tro route web/console va healthcheck; nghiep vu duoc delegated vao providers/module routes.
  Evidence: `bootstrap/app.php:8-11`, `routes/web.php`.
- [Observed | High] Luong nap plugin:
  1. Lay manifest (`PluginManifest::getManifest`)
  2. Set PSR-4 namespace cho plugin active
  3. Register providers cua plugin active
  Evidence: `platform/packages/plugin-management/src/Providers/PluginManagementServiceProvider.php:28`, `:33`, `:38`, `:43`.
- [Observed | High] Plugin manifest cache nam o `bootstrap/cache/plugins.php`, co co che regenerate khi mismatch.
  Evidence: `platform/packages/plugin-management/src/PluginManifest.php:16`, `:24`, `:42`, `:50`.
- [Observed | High] Dependency direction theo mo hinh: Laravel shell -> Botble core/packages -> plugin/theme provider + routes + hooks.
  Evidence: `bootstrap/cache/packages.php:22`, `:143`, `:198`, `platform/core/base/src/Traits/LoadAndPublishDataTrait.php:80`.
- [Observed | Medium] Su dung DI repository interface-to-implementation trong nhieu module (blog, media, contact, acl, ...), giam coupling truc tiep.
  Evidence: `platform/plugins/blog/src/Providers/BlogServiceProvider.php:44`, `platform/core/media/src/Providers/MediaServiceProvider.php:50`, `platform/core/acl/src/Providers/AclServiceProvider.php:36`.

## Coding Style and Conventions
- [Observed | High] Naming convention va namespace theo PSR-4, cau truc thu muc theo bounded module (`Http/Controllers`, `Models`, `Providers`, `Repositories`, `Tables`, `Forms`).
  Evidence: `platform/plugins/blog/src/Http/Controllers/PostController.php`, `platform/plugins/blog/src/Models/Post.php`, `platform/plugins/blog/src/Repositories/Eloquent/PostRepository.php`.
- [Observed | Medium] Pattern su dung nhieu: ServiceProvider, Facade, Repository, trait-based module bootstrap (`LoadAndPublishDataTrait`).
  Evidence: `platform/core/base/src/Traits/LoadAndPublishDataTrait.php:20`, `:80`.
- [Observed | Medium] Typed method signatures va typed properties duoc ap dung rong, nhung khong thay `declare(strict_types=1)` trong `app` va `platform`.
  Evidence: strict-types scan result `__NONE__`.
- [Observed | Medium] Root PHPUnit chi include `tests/Unit`, `tests/Feature` va source `app`; 2 test root de dang, trong khi test trong `platform` co 28 files.
  Evidence: `phpunit.xml:8-17`, `tests/Feature/ExampleTest.php`, recursive test counts.
- [Inferred | Medium] Quality tooling co kha nang manh tren ly thuyet, nhung co the chua enforce day du neu khong co config/CI pipeline dong bo.
  Evidence: `composer.json:44`, `:47`, `:52`, `__NO_GITHUB_WORKFLOWS__`.

## Extension Points (Modules/Themes/Plugins/Hooks)
- [Observed | High] Hook system kieu WordPress duoc implement native: `add_filter`, `add_action`, `apply_filters`, `do_action`.
  Evidence: `platform/core/base/helpers/action-filter.php:8`, `:26`, `:37`, `:44`.
- [Observed | High] Hook usage rong trong he thong (dem scan): `add_filter` 153, `add_action` 45, `apply_filters` 247, `do_action` 85.
  Evidence: recursive grep counts tren `platform`.
- [Observed | High] Lifecycle plugin day du: activate/deactivate/remove, dependency check, migration/assets/translations publish, manifest regen.
  Evidence: `platform/packages/plugin-management/src/Services/PluginService.php:41`, `:228`, `:295`, `:409`, `:414`.
- [Observed | High] Theme extension point: route registration qua `Theme::registerRoutes`, `Theme::routes`; `theme.json` khai bao `required_plugins`.
  Evidence: `platform/themes/ripple/routes/web.php:8`, `:20`, `platform/themes/ripple/theme.json:9`.
- [Observed | High] Admin extension point: da so module dang ky admin routes qua `AdminHelper::registerRoutes`.
  Evidence: `platform/core/base/src/Helpers/AdminHelper.php:15`, multiple route files under `platform/**/routes/web.php`.

## API and Interaction Surfaces
- [Observed | High] REST API core o `vendor/botble/api` voi prefix `api/v1`; auth layer su dung `auth:sanctum` cho protected endpoints.
  Evidence: `vendor/botble/api/routes/api.php:6`, `:23`.
- [Observed | High] API middleware stack duoc push dong vao group `api`: `ApiEnabledMiddleware`, `ForceJsonResponseMiddleware`, optional `ApiKeyMiddleware`.
  Evidence: `vendor/botble/api/src/Providers/ApiServiceProvider.php:62`, `:65`, `:69`.
- [Observed | High] Plugin APIs da mo san:
  - Blog content API (`posts`, `categories`, `tags`)
  - Contact API (`contacts`) + throttle `5,1`
  - Social Login API (`api/v1/auth/*`)
  Evidence: `platform/plugins/blog/routes/api.php`, `platform/plugins/contact/routes/api.php:10`, `platform/plugins/social-login/routes/api.php`.
- [Observed | High] CLI surface lon (82 command classes scan), nhieu command namespace `cms:*` cho maintenance/integration.
  Evidence: command class scan; `platform/core/base/src/Commands/UpdateCommand.php`, `platform/packages/plugin-management/src/Commands/PluginDiscoverCommand.php`, `vendor/botble/api/src/Commands/GenerateDocumentationCommand.php`.
- [Observed | High] Async va schedule surfaces co san: ShouldQueue listeners/jobs + scheduled prune/cleanup/refresh.
  Evidence: `platform/plugins/request-log/src/Providers/CommandServiceProvider.php:24`, `platform/plugins/audit-log/src/Providers/AuditLogServiceProvider.php:65`, `platform/core/media/src/Providers/MediaServiceProvider.php:259`.
- [Observed | High] Khong thay GraphQL/webhook route footprint trong quet source hien tai.
  Evidence: grep result `__NONE__` cho patterns `graphql|lighthouse|rebing` va `webhook` tren `app/platform/vendor/botble/api`.

## Data Model and State Management
- [Observed | High] Data layer chinh su dung Eloquent + migration theo module/plugin.
  Evidence: `platform/plugins/blog/src/Models/Post.php`, `platform/plugins/blog/database/migrations/2015_06_18_033822_create_blog_table.php`.
- [Observed | High] So luong migration da dang ky: root `7`, platform `83`, vendor API `5`.
  Evidence: migration file counts.
- [Observed | High] Trang thai plugin/theme/API duoc luu trong `settings` table (`activated_plugins`, `theme`, `api_enabled`).
  Evidence: `database.sql:1798`.
- [Observed | Medium] Runtime drivers trong `.env` hien tai: cache/file, queue/sync, session/file, db/mysql.
  Evidence: `.env:11`, `.env:12`, `.env:13`, `.env:36`.
- [Observed | Medium] Data migration/import-export capability da co package rieng (`data-synchronize`) voi route UI + command import/export/chunk cleanup.
  Evidence: `vendor/botble/data-synchronize/routes/web.php:11`, `vendor/botble/data-synchronize/src/Providers/DataSynchronizeServiceProvider.php:44`.

## Security Posture
- [Observed | High] AuthN API dua tren Sanctum, co `auth:sanctum` gate cho protected endpoints.
  Evidence: `vendor/botble/api/routes/api.php:23`, `bootstrap/cache/packages.php:225`.
- [Observed | High] API gate bo sung: co the tat API toan cuc (`ApiEnabledMiddleware`) va bat buoc `X-API-KEY` khi cau hinh.
  Evidence: `vendor/botble/api/src/Http/Middleware/ApiEnabledMiddleware.php:14`, `vendor/botble/api/src/Http/Middleware/ApiKeyMiddleware.php:19`.
- [Observed | High] XSS sanitation co su dung purifier qua `BaseHelper::clean` (co the bypass neu bat `enable_less_secure_web`).
  Evidence: `platform/core/base/src/Helpers/BaseHelper.php:373`, `:375`, `:390`, `platform/core/base/config/general.php:462`.
- [Observed | High] HTTP security headers duoc set qua middleware (`nosniff`, `SAMEORIGIN`, `X-XSS-Protection`, `Referrer-Policy`).
  Evidence: `platform/core/base/src/Http/Middleware/HttpSecurityHeaders.php:18-21`.
- [Observed | High] Co rate-limit muc tieu cho endpoint tiep xuc public (`throttle:5,1`).
  Evidence: `platform/plugins/contact/routes/api.php:10`.
- [Observed | High] Rui ro lon: CSRF verification co the bi disable trong admin khi moi truong la production.
  Evidence: `platform/core/base/src/Providers/EventServiceProvider.php:197`, `:199`; `platform/core/base/src/Helpers/AdminHelper.php:23`.
- [Observed | High] Rui ro cau hinh: `.env` hien tai de `APP_ENV=production` va `APP_DEBUG=true`.
  Evidence: `.env:4`, `.env:3`.
- [Inferred | Medium] Co observability su co qua hook site error -> request-log event, va audit event listeners cho login/content.
  Evidence: `platform/core/base/src/Exceptions/Handler.php:45`, `platform/plugins/request-log/src/Providers/HookServiceProvider.php:25`, `platform/plugins/audit-log/src/Providers/EventServiceProvider.php`.

## Integration Capability Matrix
| Domain | Entry Points | Required Adapters | Complexity | Risks | Confidence |
|---|---|---|---|---|---|
| External APIs | `api/v1` core + plugin APIs (`blog`, `contact`, `social-login`) | API gateway/versioning, request signing, client SDK wrappers | Medium | API co the dang tat (`api_enabled=0`), can governance versioning | High |
| Authentication/SSO | Sanctum (`auth:sanctum`), Social Login web/api routes | IdP config mapping, token lifecycle, callback domain hardening | Medium | Misconfig callback/provider secret, token refresh drift | High |
| Payment | Khong thay payment module active trong `platform/plugins` | Can plugin payment moi + domain model order/transaction | High | Scope tang nhanh, compliance (PCI/chargeback) | Medium |
| Messaging/Queue | ShouldQueue listeners/jobs, scheduler commands | Queue backend (Redis/SQS), worker orchestration, retries/DLQ | Medium | `.env` dang `QUEUE_CONNECTION=sync` lam giam async throughput | High |
| Storage/CDN | Media driver support `s3/r2/wasabi/bunnycdn/do_spaces/backblaze` | Credential/secret manager, CDN URL/signing, lifecycle policies | Medium | Sai config disk/ACL/public URL, chi phi egress | High |
| Observability | Request-log + Audit-log + logger channel hooks | Central log pipeline, metrics/tracing, alert routing | Medium | Log noise, thieu correlation-id va SLO metrics | Medium |
| Admin/UI customization | `AdminHelper::registerRoutes`, hooks/filters, panel sections, theme routes | Internal extension conventions, review checklist, plugin quality gates | Low-Medium | Hook overuse dan den kho truy vet side-effects | High |
| Content/data migration | `data-synchronize` routes/commands + migration system | Mapping schema, transform rules, validation + rollback tooling | Medium | Data quality drift, rollback strategy chua ro | High |

## Strengths, Weaknesses, Risks
- [Observed | High] Strength: Kien truc module/plugin/theme rat ro rang, extension points phong phu, de mo rong ma khong phai fork core.
  Evidence: `platform/packages/plugin-management/src/Providers/PluginManagementServiceProvider.php`, `platform/core/base/helpers/action-filter.php`.
- [Observed | High] Strength: Integration surface da da dang (REST API, social auth, media cloud drivers, import/export tooling).
  Evidence: `vendor/botble/api/routes/api.php`, `platform/plugins/social-login/routes/api.php`, `platform/core/media/src/Providers/MediaServiceProvider.php`, `vendor/botble/data-synchronize/src/Providers/DataSynchronizeServiceProvider.php`.
- [Observed | Medium] Weakness: Root test scope chua phan anh day du plugin/platform domain; CI workflow chua thay trong repo.
  Evidence: `phpunit.xml:17`, `__NO_GITHUB_WORKFLOWS__`.
- [Observed | High] Weakness: App shell (`app/`) rat mong, kien thuc he thong tap trung trong platform/vendor, onboarding de bi tai.
  Evidence: `routes/web.php`, `app/Providers/*.php`.
- [Observed | High] Risk: CSRF bypass trong admin production co the mo rong attack surface neu khong co compensating controls.
  Mitigation: tat condition bypass mac dinh, gioi han theo route can thiet, bat buoc CSRF regression tests.
  Evidence: `platform/core/base/src/Providers/EventServiceProvider.php:197-199`.
- [Observed | High] Risk: `APP_DEBUG=true` trong moi truong danh dau production.
  Mitigation: set `APP_DEBUG=false`, review error rendering + log redaction.
  Evidence: `.env:3-4`.
- [Inferred | Medium] Risk: Queue dang `sync` gay han che throughput va retries cho email/notifications/jobs.
  Mitigation: chuyen queue backend async, them supervisor + retry policy.
  Evidence: `.env:12`, `platform/plugins/contact/src/Listeners/SendContactEmailListener.php:11`.

## Top 10 Evidence Items
1. [Observed | High] Stack versions va merge plugin.
   File/Symbol: `composer.json` (`require`, `extra.merge-plugin`).
   Snippet summary: PHP 8.3/8.4, Laravel 13, Botble API, merge plugin/theme composer files.
2. [Observed | High] Frontend monorepo workspace.
   File/Symbol: `package.json` (`workspaces`, `dependencies`, `devDependencies`).
   Snippet summary: workspace split theo `platform/*`, build voi Laravel Mix, Vue 3.
3. [Observed | High] App bootstrap va entry routing.
   File/Symbol: `bootstrap/app.php` (`withRouting`), `routes/web.php`.
   Snippet summary: app shell route map don gian; web route root trong app de trong.
4. [Observed | High] Plugin dynamic loading by manifest.
   File/Symbol: `PluginManagementServiceProvider::boot`, `PluginManifest::getManifest`.
   Snippet summary: doc manifest, set PSR-4 plugin, register providers active.
5. [Observed | High] Hook/filter engine.
   File/Symbol: `action-filter.php` (`add_filter`, `add_action`, `apply_filters`, `do_action`).
   Snippet summary: co che extension runtime dung xuyen module.
6. [Observed | High] API auth/middleware orchestration.
   File/Symbol: `ApiServiceProvider::boot`, `vendor/botble/api/routes/api.php`.
   Snippet summary: push API middleware, prefix `api/v1`, auth sanctum cho protected routes.
7. [Observed | High] Security headers + CSRF bypass condition.
   File/Symbol: `HttpSecurityHeaders::handle`, `EventServiceProvider::disableCsrfProtection`.
   Snippet summary: set secure headers; condition co the replace CSRF middleware trong admin production.
8. [Observed | High] Input sanitization pivot.
   File/Symbol: `BaseHelper::clean`, `core/base/config/general.php`.
   Snippet summary: purifier active by default, co flag `enable_less_secure_web` de bypass.
9. [Observed | High] Multi-cloud media integration.
   File/Symbol: `MediaServiceProvider::boot` switch media driver.
   Snippet summary: support `s3`, `r2`, `wasabi`, `bunnycdn`, `do_spaces`, `backblaze`.
10. [Observed | High] Data migration/import-export tooling.
    File/Symbol: `DataSynchronizeServiceProvider`, `vendor/botble/data-synchronize/routes/web.php`.
    Snippet summary: co UI route + commands import/export + scheduled chunk cleanup.

## Unknowns and Verification Plan
- [Assumed | Medium] Chua xac nhan policy production thuc te cho CSRF bypass admin.
  Verification: grep config override theo environment + pen-test luong form admin quan trong.
- [Assumed | Medium] Chua xac nhan tinh trang queue workers thuc te (supervisor/systemd).
  Verification: check process/runtime metrics, chay test end-to-end cho queued jobs.
- [Assumed | Medium] Chua xac nhan API dang bat o moi truong production.
  Verification: doc `settings` production (`api_enabled`), smoke test endpoint.
- [Assumed | Medium] Chua do duoc real test coverage theo plugin/module.
  Verification: thiet lap pipeline test matrix (core + plugin critical suites) va coverage report.
- [Assumed | Low] Khong thay webhook/GraphQL footprint trong source hien tai, nhung co the ton tai o private plugins chua import.
  Verification: inventory them plugin private/private repo + runtime route dump.

## Recommended Next Actions (30/60/90 day)
- [30 days | High priority]
  - Dong hardening gap: tat `APP_DEBUG` tren production, review/rang buoc lai CSRF logic admin.
  - Chuan hoa baseline architecture doc: route map, provider map, plugin dependency map.
  - Tao smoke tests cho auth, API, plugin activation/deactivation, contact submission.
- [60 days | Medium priority]
  - Chuyen queue sang async backend (Redis/SQS), bo sung retry policy + dead-letter strategy.
  - Dung CI pipeline cho lint/static/test (pint + larastan + phpunit selective suites).
  - Chuan hoa integration contracts cho API versioning va plugin hook governance.
- [90 days | Medium priority]
  - Xay integration playbook (SSO, storage/CDN, data migration) kem template adapters.
  - Bo sung observability stack: correlation-id, dashboard error budget, alert routing.
  - Thiet lap regression/security test set cho cac extension points quan trong (hooks/routes/policies).
