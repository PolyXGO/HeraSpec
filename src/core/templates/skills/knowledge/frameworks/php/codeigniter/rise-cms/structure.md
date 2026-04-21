## 1. Executive Summary

- [Observed | High] The codebase is a CodeIgniter 4 monolith with plugin-based extensibility. Evidence: `index.php` (`$minPhpVersion = '8.1'`, `CodeIgniter\Boot::bootWeb()`), core app in `app/`, plugins in `plugins/`.
- [Observed | High] `data_builder` is deeply integrated as a first-class plugin providing REST, GraphQL, API token management, webhooks, and public API docs/sandbox flows. Evidence: `plugins/data_builder/index.php`, `plugins/data_builder/config/Routes.php`, controllers `Db_resources`, `Db_graphql`, `Public_api_docs`, `Webhooks`.
- [Observed | High] Runtime coupling is high because base controllers preload many models and settings globally. Evidence: `app/Controllers/App_Controller.php` (`get_models_array()` and eager model loading), `app/Controllers/Security_Controller.php`.
- [Inferred | Medium] Integration readiness is strong for API-first extensions, but operational hardening is uneven due broad CSRF exclusions and mixed legacy compatibility layers. Evidence: `app/Config/Filters.php`, `app/Config/Rise.php`, `plugins/data_builder/Helpers/*CI3*` wrappers.
- [Assumed | Low] This repository is the Rise CRM target for migration/integration work from another stack; direct Laravel runtime artifacts are not present. Evidence: missing `artisan`, `bootstrap/app.php`, `routes/web.php` in repo root.

## 2. Technology Profile

- [Observed | High] Language/runtime: PHP with CodeIgniter 4 bootstrap, minimum PHP 8.1. Evidence: `index.php`.
- [Observed | High] Application versioning is managed in Rise config (`3.9.6`). Evidence: `app/Config/Rise.php` (`app_settings_array['app_version']`).
- [Observed | High] Default data store is MySQL via MySQLi with DB prefix `rise_`. Evidence: `app/Config/Database.php` (`DBDriver = MySQLi`, `DBPrefix = rise_`).
- [Observed | High] Session persistence uses database-backed sessions (`ci_sessions`). Evidence: `app/Config/Session.php` (`DatabaseHandler`, `savePath = ci_sessions`).
- [Observed | High] Cache defaults to filesystem handler. Evidence: `app/Config/Cache.php` (`handler = file`).
- [Observed | High] Root dependency manifests are absent; dependency management is partially embedded (core `app/ThirdParty`) and partially plugin-local. Evidence: missing root `composer.json`/`package.json`; present `plugins/data_builder/composer.json`, `plugins/data_builder/package.json`, `app/ThirdParty/*`.
- [Observed | High] Data Builder adds GraphQL runtime dependency `webonyx/graphql-php` and frontend build toolchain (webpack/babel, Chart.js). Evidence: `plugins/data_builder/composer.json`, `plugins/data_builder/package.json`.

## 3. Repository Topology

- [Observed | High] Major root directories: `app`, `assets`, `plugins`, `system`, `writable`, `install`, `updates`, `_analytics`. Evidence: root directory listing.
- [Observed | High] Core MVC footprint is large (`app/Controllers`: 92 files, `app/Models`: 95 files), indicating mature monolith breadth. Evidence: file counts collected from `app/Controllers`, `app/Models`.
- [Observed | High] Data Builder plugin is modularized by concerns (`Controllers`, `Models`, `Libraries`, `Views`, `config`, `install`, `migrations`, `vendor`, `dist`). Evidence: `plugins/data_builder/*` structure.
- [Observed | High] Embedded third-party providers include Google, Stripe, Pusher, TCPDF, PhpSpreadsheet, reCAPTCHA. Evidence: `app/ThirdParty/*` directories.

## 4. Architecture and Dependency Flow

- [Observed | High] Boot flow: front controller -> CI bootstrap -> pre-system event -> plugin loading/hooks. Evidence: `index.php`; `app/Config/Events.php` (`Events::on('pre_system', ...)`, `load_plugin_indexes()`).
- [Observed | High] Activated plugins are auto-registered into PSR-4 namespaces at startup. Evidence: `app/Config/Autoload.php` (`load_activated_plugins()`).
- [Observed | High] Routing combines explicit routes and dynamic controller scanning at core level. Evidence: `app/Config/Routes.php` (directory scan of `app/Controllers`).
- [Observed | High] Data Builder routes are registered during plugin bootstrap and include both admin and public endpoints. Evidence: `plugins/data_builder/index.php` (`data_builder_register_routes()`), `plugins/data_builder/config/Routes.php`.
- [Observed | High] API controllers inherit a compatibility base that wraps CI4 services into CI3-style interfaces for legacy module code. Evidence: `plugins/data_builder/Controllers/Base_controller.php`, `plugins/data_builder/Helpers/CI3_Instance_Compat.php`.
- [Inferred | Medium] Dependency direction is mostly top-down (controllers -> models/libraries/helpers), but global helper and hook access patterns increase hidden coupling and side effects. Evidence: `app/Helpers/plugin_helper.php`, heavy global helper usage in controllers.

## 5. Coding Style and Conventions

- [Observed | High] Naming style is mixed legacy and modern (`snake_case` model names, CI-style controllers, namespaced classes). Evidence: `App_Controller.php`, `Permission_manager.php`, plugin `Db_*` classes.
- [Observed | High] Plugin code uses dense inline documentation and defensive runtime guards, especially in API middleware and webhook components. Evidence: `Db_api_base.php`, `Db_api_middleware.php`, `WebhookEventBus.php`.
- [Observed | Medium] Error handling strategy in Data Builder is centralized around structured API responses and an error registry. Evidence: `Db_api_response.php`, `ErrorRegistry.php`.
- [Observed | Medium] Core and plugin both rely on direct `echo/json_encode` and header operations in many controllers, reducing consistency with response abstractions. Evidence: multiple controller methods in `plugins/data_builder/Controllers/*` and core controllers.
- [Observed | High] No first-party test suite is present in repository root. Evidence: missing `tests/` directory and missing root phpunit config.
- [Inferred | Medium] Maintainability risk is elevated by mixed framework idioms (CI4 + CI3 compat layer) and very large base controllers.

## 6. Extension Points (Modules/Themes/Plugins/Hooks)

- [Observed | High] Plugin lifecycle hooks are available for install/activate/deactivate/uninstall/update. Evidence: `app/Helpers/plugin_helper.php` (`register_installation_hook`, `register_activation_hook`, etc.).
- [Observed | High] Data Builder uses lifecycle hooks to install schema and register routes. Evidence: `plugins/data_builder/index.php` hook registrations.
- [Observed | High] Core supports app-wide hook/filter injection via PHP-Hooks wrapper. Evidence: `app/Config/Events.php` (loads `PHP-Hooks`), `app/Helpers/plugin_helper.php` (`app_hooks()`).
- [Observed | High] UI extension point exists for admin sidebar composition through hook filters. Evidence: `plugins/data_builder/index.php` (`app_filter_staff_left_menu`).
- [Observed | Medium] CSRF exclusion patterns are extensible through filter hook and are modified by plugin at bootstrap. Evidence: `app/Config/Rise.php` constructor filter, `plugins/data_builder/index.php` add_filter for API/docs/embed URIs.

## 7. API and Interaction Surfaces

- [Observed | High] Public docs/UI surface: `/api_docs` with endpoint registry, code samples, Postman/OpenAPI export, and webhook simulator. Evidence: `plugins/data_builder/config/Routes.php`, `Public_api_docs.php`.
- [Observed | High] REST surface: `/api/v1/*` and alias `/data_builder/api/*` with resource, report, schema, and aggregate endpoints. Evidence: `plugins/data_builder/config/Routes.php`, `Db_resources.php`, `Db_views.php`.
- [Observed | High] GraphQL surface: `/api/v1/graphql` POST-only with depth/complexity controls and optional introspection restriction. Evidence: `Db_graphql.php`, `Libraries/api/Db_graphql_schema.php`.
- [Observed | High] Outbound webhook surface: subscription CRUD, test dispatch, live simulator, delivery logs. Evidence: `Webhooks.php`, `WebhookEventBus.php`, `HttpChannel.php`.
- [Observed | High] Inbound webhook surface exists in core for external systems (GitHub/Bitbucket/Stripe subscription events). Evidence: `app/Controllers/Webhooks_listener.php`.
- [Observed | Medium] Scheduled/background execution relies on HTTP-triggered cron controller, not a dedicated queue worker architecture. Evidence: `app/Controllers/Cron.php`.

## 8. Data Model and State Management

- [Observed | High] Core DB migrations/seeds are effectively empty placeholders (`.gitkeep`), while plugin owns explicit schema SQL and versioned migrations. Evidence: `app/Database/Migrations/.gitkeep`, `app/Database/Seeds/.gitkeep`, `plugins/data_builder/install/database.sql`, `plugins/data_builder/migrations/*`.
- [Observed | High] Data Builder persists API tokens, API logs, rate counters, report metadata, relations, and webhook subscriptions/logs in dedicated tables. Evidence: `plugins/data_builder/install/database.sql` (`data_builder_api_*`, `polydb_*` tables).
- [Observed | High] API write operations in Data Builder use transaction boundaries around mutating operations. Evidence: `Db_resources.php` (`trans_start`, `trans_complete`, rollback paths).
- [Observed | Medium] Table prefix abstraction is consistently applied (`db_prefix()`), aiding multi-install portability. Evidence: plugin migration/install scripts and helper wrappers.
- [Inferred | Medium] Data consistency is generally robust within single-request CRUD paths; cross-module consistency depends on model hooks and side effects not centrally orchestrated.

## 9. Security Posture

- [Observed | High] Core authentication/authorization is session-centric with role/permission gates in `Security_Controller` and `Permission_manager`. Evidence: `app/Controllers/Security_Controller.php`, `app/Libraries/Permission_manager.php`.
- [Observed | High] Data Builder API applies an explicit middleware chain: DDoS shield, CORS, admin-session bypass, auth gate, rate limiter, scope verifier, request logger. Evidence: `Db_api_base.php`, `Db_api_middleware.php`, middleware classes.
- [Observed | High] API token security includes scopes, table/view constraints, per-table CRUD permissions, HMAC signature validation, and anti-replay timestamp window. Evidence: `AuthGateMiddleware.php`, `ScopeVerifierMiddleware.php`, token schema in migrations.
- [Observed | High] API observability includes two-phase request logging and sensitive-field redaction. Evidence: `RequestLoggerMiddleware.php`, `Api_log_finalizer.php`, `Log_redactor.php`.
- [Observed | High] Public webhook simulator includes SSRF guard against localhost/private/reserved targets. Evidence: `Public_api_docs.php` (`_validate_webhook_simulator_target`, `_is_public_ip`).
- [Observed | Medium] CSRF filter is not globally enabled and relies on exclusion lists and endpoint-specific handling. Evidence: `app/Config/Filters.php` (`'csrf'` commented), `app/Config/Rise.php` exclusions, plugin-added exclusions in `plugins/data_builder/index.php`.
- [Observed | Medium] Core payment library code contains TLS verification disabled in some cURL paths, which is a material transport-security risk if unchanged in production. Evidence: `app/Libraries/Paypal.php` (`CURLOPT_SSL_VERIFYPEER => false`).

## 10. Integration Capability Matrix

| Domain                 | Entry Points                                                                                                           | Required Adapters                                                                    | Complexity  | Risks                                                            | Confidence |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------- | ---------------------------------------------------------------- | ---------- |
| External APIs          | Core:`Google_api`, `Microsoft_api`, `Webhooks_listener`; Plugin: `/api/v1/*`, `/api_docs`, outbound webhooks | OAuth credential storage, API token issuance, endpoint-specific mappers              | Medium      | Credential sprawl, route exposure, vendor API drift              | High       |
| Authentication/SSO     | Session auth in `Security_Controller`; token auth + HMAC in `AuthGateMiddleware`                                   | Optional IdP bridge (OIDC/SAML) and token broker if enterprise SSO required          | Medium-High | Mixed session/token contexts, bypass misconfiguration            | Medium     |
| Payment                | `Paypal_redirect`, `Stripe_redirect`, `Paytm_redirect`, payment libraries                                        | Payment gateway credential hardening, webhook signature verification standardization | Medium      | TLS/cURL settings inconsistency, callback abuse if misconfigured | Medium     |
| Messaging/Queue        | Pusher integration (`Pusher_connect`), HTTP cron (`Cron`), webhook dispatch                                        | Optional queue worker (Redis/RabbitMQ/SQS) for async retries/backoff                 | Medium      | No first-class queue abstraction for heavy burst workloads       | Medium     |
| Storage/CDN            | File/cache/session paths via `writable/`, `files/`, cache config                                                   | Object storage adapter (S3-compatible), CDN URL rewriting, signed URL strategy       | Medium      | Local disk coupling and backup/retention variability             | Medium     |
| Observability          | API logs, webhook logs, activity logs, debug toolbar                                                                   | Log shipping (ELK/Loki), metrics exporter, alert rules                               | Low-Medium  | Fragmented telemetry across subsystems                           | High       |
| Admin/UI customization | Hook/filter system (`app_hooks()`), plugin menu injection, plugin routes/views                                       | Theme/view override conventions, stricter UI extension contracts                     | Low         | Hook ordering collisions and undocumented custom hooks           | High       |
| Content/data migration | Plugin SQL installer + migrations, API docs export (Postman/OpenAPI), builder/template persistence                     | ETL scripts, schema-diff tooling, migration playbooks                                | Medium-High | Limited root migration automation and weak test safety net       | Medium     |

## 11. Strengths, Weaknesses, Risks

- [Observed | High] Strength: Clear plugin extensibility model with lifecycle hooks and route/menu injection points. Mitigation leverage: continue shipping new modules as plugins to reduce core edits.
- [Observed | High] Strength: Data Builder API stack includes practical hardening features (rate limit, HMAC, scope checks, log redaction).
- [Observed | Medium] Weakness: Core controller layer is monolithic and preloads many dependencies, increasing bootstrap cost and change blast radius.
- [Observed | Medium] Weakness: Mixed CI4 + CI3 compatibility layer increases cognitive load and future upgrade complexity.
- [Observed | Medium] Risk: Broad CSRF exclusions and globally disabled csrf filter can expand attack surface if endpoint assumptions drift.
- [Observed | Medium] Risk: Dynamic route generation from controller directory can unintentionally expose actions when naming/visibility controls are inconsistent.
- [Observed | Medium] Risk: No first-party automated tests detected; regression detection relies heavily on manual QA.
- [Observed | Medium] Risk: Payment integration TLS options in legacy library code require review before production hardening.

## 12. Top 10 Evidence Items

1. [Observed | High] CI4 runtime and minimum PHP: `index.php` (`$minPhpVersion = '8.1'`, `Boot::bootWeb`).
2. [Observed | High] Application version and CSRF exclusion baseline: `app/Config/Rise.php`.
3. [Observed | High] Dynamic core route registration: `app/Config/Routes.php` (controller directory scan).
4. [Observed | High] Plugin loading at bootstrap and hook init: `app/Config/Events.php` + `app/Config/Autoload.php`.
5. [Observed | High] Hook/lifecycle extension APIs: `app/Helpers/plugin_helper.php`.
6. [Observed | High] Data Builder bootstrap and menu/CSRF integration: `plugins/data_builder/index.php`.
7. [Observed | High] Full API route map (REST/GraphQL/docs/webhooks): `plugins/data_builder/config/Routes.php`.
8. [Observed | High] Middleware security pipeline wiring: `plugins/data_builder/Controllers/Db_api_base.php` + `Libraries/api/middleware/*`.
9. [Observed | High] Webhook dispatch architecture and delivery logging: `WebhookEventBus.php`, `channels/HttpChannel.php`, `Webhooks.php`.
10. [Observed | High] Persistent schema for tokens/logs/rate/webhooks: `plugins/data_builder/install/database.sql` and `migrations/200_version_200.php`.

## 13. Unknowns and Verification Plan

- [Assumed | Medium] Production deployment topology (single node vs load-balanced) is unknown. Verify by reviewing web server/proxy configs and session stickiness behavior.
- [Assumed | Medium] Secret management policy (env vars vs DB settings) is unclear. Verify by tracing `get_setting()` storage/encryption and backup handling.
- [Assumed | Medium] Real traffic/performance envelope for `/api/v1` and GraphQL is unknown. Verify with load tests and DB slow query profiling.
- [Assumed | Medium] Permission boundary correctness for every Data Builder admin screen is not fully proven. Verify via role-matrix test plan across non-admin staff.
- [Assumed | Low] Historical Laravel source parity requirements are not represented in this repo. Verify against external migration spec/change log.

## 14. Recommended Next Actions (30/60/90 day)

- [30 days]
  - [Observed | High] Create a regression smoke suite for critical paths: login, permissions, `/api/v1` read/write, GraphQL, webhook simulate/send, payment callbacks.
  - [Observed | High] Tighten security baseline: review and minimize CSRF excludes; enable endpoint-level CSRF strategy documentation.
  - [Observed | Medium] Patch legacy transport settings (e.g., PayPal cURL TLS verification path) and validate gateway callbacks end-to-end.
- [60 days]
  - [Inferred | Medium] Refactor high-coupling controller bootstrap patterns by introducing slimmer service boundaries for new code.
  - [Observed | Medium] Standardize response/error handling across plugin controllers to reduce direct `echo/json_encode` drift.
  - [Observed | Medium] Add API contract tests from exported OpenAPI/Postman fixtures.
- [90 days]
  - [Inferred | Medium] Introduce optional async job layer for webhook retries and heavy API tasks.
  - [Inferred | Medium] Establish centralized observability pipeline (structured logs + metrics + alerts).
  - [Inferred | Medium] Define upgrade-safe extension contracts (hook catalog, route policy, compatibility guidelines) for future modules.
