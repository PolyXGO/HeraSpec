## Executive Summary
- [Observed | High] WordPress 6.9.x is a monolithic PHP CMS with a deeply hook-driven architecture. The core runtime lives in `wp-includes/` (~250 files, ~4MB+ of PHP), administration in `wp-admin/` (~100 files), and all user extensions in `wp-content/` (plugins, themes, uploads, mu-plugins).
  Evidence: `wp-settings.php` (bootstrap sequence), `wp-includes/version.php:19` (`$wp_version = '6.9.4'`), directory listings.
- [Observed | High] Extensibility is built on two primitives: **Actions** (`do_action`/`add_action`) for side-effects and **Filters** (`apply_filters`/`add_filter`) for data transformation. Nearly every behavior in WordPress can be intercepted, modified, or extended via these hooks.
  Evidence: `wp-includes/plugin.php:121` (`add_filter`), `:173` (`apply_filters`), `:446` (`add_action`), `:487` (`do_action`); `wp-includes/default-filters.php` (~37KB of hook registrations).
- [Observed | High] WordPress provides a full REST API (prefix `/wp-json/wp/v2/`) with 40+ endpoint controllers for posts, pages, users, taxonomies, blocks, templates, menus, widgets, fonts, and more.
  Evidence: `wp-settings.php:294-341` (REST API class loading), `wp-includes/rest-api/endpoints/` directory (40+ controller classes).

## Technology Profile
- [Observed | High] Runtime: PHP >= 7.2.24; recommended 8.0+.
  Evidence: `wp-includes/version.php:40` (`$required_php_version = '7.2.24'`).
- [Observed | High] Required PHP extensions: `json`, `hash`.
  Evidence: `wp-includes/version.php:47-49`.
- [Observed | High] Database: MySQL >= 5.5.5 (also supports MariaDB). Data access via the `wpdb` class (custom query builder, not an ORM).
  Evidence: `wp-includes/version.php:57`, `wp-includes/class-wpdb.php` (~118KB).
- [Observed | High] Frontend: Block Editor (Gutenberg) uses React/JSX for editor UI. Classic themes use PHP template hierarchy. Full Site Editing themes use `theme.json` + block templates.
  Evidence: `wp-includes/blocks/` directory, `wp-includes/class-wp-block.php`, `wp-includes/class-wp-theme-json.php` (~164KB).
- [Observed | High] HTTP layer: `WP_Http` class with cURL and PHP streams transports. External requests via `Requests` library.
  Evidence: `wp-includes/class-wp-http.php`, `wp-includes/class-wp-http-curl.php`, `wp-includes/Requests/` directory.

## Repository Topology
- [Observed | High] Root directory structure:
  ```
  wordpress/
  ├── wp-admin/              # Administration backend (93 PHP files, 7 subdirs)
  │   ├── includes/          # Admin-only helper classes and functions
  │   ├── css/               # Admin stylesheets
  │   ├── js/                # Admin JavaScript
  │   └── network/           # Multisite network admin
  ├── wp-content/            # User-managed content
  │   ├── plugins/           # Plugin installations
  │   ├── themes/            # Theme installations
  │   ├── uploads/           # Media uploads (created at runtime)
  │   ├── mu-plugins/        # Must-use plugins (auto-loaded, no activation)
  │   └── languages/         # Translation files
  ├── wp-includes/           # Core library (249 PHP files, 29 subdirs)
  │   ├── rest-api/          # REST API framework + 40+ endpoint controllers
  │   ├── blocks/            # Core block type definitions
  │   ├── html-api/          # HTML parser/processor
  │   ├── block-supports/    # Block feature support handlers
  │   ├── block-bindings/    # Block binding sources
  │   ├── sitemaps/          # XML sitemap providers
  │   ├── style-engine/      # CSS generation engine
  │   ├── fonts/             # Font library management
  │   ├── interactivity-api/  # Frontend interactivity framework
  │   └── widgets/           # Core widget classes
  ├── wp-config.php          # Site configuration (user-created)
  ├── wp-settings.php        # Bootstrap loader (orchestrates entire load sequence)
  ├── wp-load.php            # Environment setup + config loading
  ├── wp-blog-header.php     # Front-end entry point
  ├── wp-login.php           # Authentication UI
  ├── wp-cron.php            # Pseudo-cron runner
  └── xmlrpc.php             # XML-RPC endpoint
  ```
  Evidence: filesystem listing of WordPress 6.9.4 source.

## Architecture and Dependency Flow
- [Observed | High] Bootstrap sequence (wp-settings.php):
  1. Load `version.php`, `compat.php`, `load.php`
  2. Initialize error/recovery handlers
  3. Load `plugin.php` (hook system)
  4. Set constants, start object cache
  5. Load `default-filters.php` (attach core hooks)
  6. Initialize multisite if enabled
  7. Load mu-plugins → fire `muplugins_loaded`
  8. Load active plugins → fire `plugins_loaded`
  9. Load pluggable functions
  10. Create WP_Query, WP_Rewrite, WP objects
  11. Load active theme's `functions.php` → fire `after_setup_theme`
  12. `$wp->init()` → fire `init`
  13. Fire `wp_loaded`
  Evidence: `wp-settings.php:1-765` (entire file, sequential require chain).
- [Observed | High] Request lifecycle (front-end):
  `index.php` → `wp-blog-header.php` → `wp-load.php` (config) → `wp-settings.php` (bootstrap) → `WP::main()` → `WP::parse_request()` → `WP::query_posts()` → `WP::handle_404()` → `WP::register_globals()` → `template-loader.php` → selected template file.
  Evidence: `wp-blog-header.php:14`, `wp-includes/class-wp.php`, `wp-includes/template-loader.php`.
- [Observed | High] Admin request lifecycle:
  `wp-admin/*.php` → `wp-admin/admin.php` → `wp-load.php` → `wp-settings.php` → admin-specific includes → fire `admin_init`.
  Evidence: `wp-admin/admin.php`.
- [Observed | High] AJAX lifecycle:
  `wp-admin/admin-ajax.php` → validates nonce/auth → fires `wp_ajax_{action}` (logged-in) or `wp_ajax_nopriv_{action}` (public).
  Evidence: `wp-admin/admin-ajax.php`.

## Coding Style and Conventions
- [Observed | High] Naming: snake_case for functions and variables, `WP_` prefix for classes (e.g., `WP_Query`, `WP_Hook`, `WP_REST_Controller`), `wp_` prefix for global functions.
  Evidence: throughout `wp-includes/*.php`.
- [Observed | High] Procedural + OOP hybrid: Core utility functions are global/procedural (`get_post()`, `wp_insert_post()`). Major subsystems are class-based (`WP_Query`, `WP_REST_Server`, `WP_Hook`, `wpdb`).
  Evidence: `wp-includes/post.php` (procedural), `wp-includes/class-wp-query.php` (OOP).
- [Observed | High] Template Hierarchy: Front-end rendering follows a priority chain (`single-{post_type}.php` → `single.php` → `singular.php` → `index.php`). Functions: `locate_template()`, `get_template_part()`.
  Evidence: `wp-includes/template-loader.php`, `wp-includes/template.php`.
- [Observed | High] WordPress Coding Standards (WPCS): enforced via phpcs with WordPress-specific sniffs. Tab indentation, Yoda conditions, `esc_*` output escaping, `wp_kses` input sanitization.
  Evidence: inline phpcs annotations throughout core, `wp-includes/kses.php` (~83KB).
- [Observed | Medium] No `declare(strict_types=1)` in core. PHP type hints are used inconsistently; newer code uses typed parameters and return types, legacy code does not.
  Evidence: comparison of `wp-includes/plugin.php` (no types) vs `wp-includes/class-wp-block-metadata-registry.php` (has types).

## Extension Points (Modules/Themes/Plugins/Hooks)
- [Observed | High] **Plugin API**: Plugins reside in `wp-content/plugins/{plugin-name}/`. Main file requires a standard header comment (`Plugin Name`, `Version`, `Description`, etc.). Lifecycle hooks: `register_activation_hook()`, `register_deactivation_hook()`, `register_uninstall_hook()`.
  Evidence: `wp-includes/plugin.php:763-1022`.
- [Observed | High] **Hook System**: `WP_Hook` class manages callbacks with priority ordering. Core functions: `add_action()`, `do_action()`, `add_filter()`, `apply_filters()`, `remove_action()`, `remove_filter()`, `has_action()`, `has_filter()`.
  Evidence: `wp-includes/plugin.php`, `wp-includes/class-wp-hook.php` (~16KB).
- [Observed | High] **Must-Use Plugins**: Files in `wp-content/mu-plugins/` are auto-loaded before regular plugins. No activation needed. Loaded in alphabetical order.
  Evidence: `wp-settings.php:468-482`.
- [Observed | High] **Theme System**: Themes in `wp-content/themes/{theme-name}/`. Required files: `style.css` (with header), `index.php`. Optional: `functions.php`, `template-parts/`, `patterns/`, `parts/`, `templates/`. Child themes inherit from parent via `Template:` header.
  Evidence: `wp-includes/class-wp-theme.php` (~65KB), `wp-includes/theme.php` (~135KB).
- [Observed | High] **Block Registration**: Blocks registered via `register_block_type()` with `block.json` manifest. Supports server-side rendering, editor/front-end scripts, styles, and attributes schema.
  Evidence: `wp-includes/blocks.php` (~114KB), `wp-includes/class-wp-block-type.php`.
- [Observed | High] **Shortcode API**: `add_shortcode()`, `do_shortcode()`. Used for embedding dynamic content in post content via `[shortcode]` syntax.
  Evidence: `wp-includes/shortcodes.php` (~24KB).
- [Observed | High] **Widget System**: `WP_Widget` base class. Register via `register_widget()`. Displayed in sidebars/widget areas registered with `register_sidebar()`.
  Evidence: `wp-includes/class-wp-widget.php`, `wp-includes/widgets.php` (~71KB).
- [Observed | High] **Customizer API**: `WP_Customize_Manager` provides live-preview theme options. Panels, sections, settings, controls. Register via `customize_register` action.
  Evidence: `wp-includes/class-wp-customize-manager.php` (~203KB).
- [Observed | High] **Drop-in replacements**: Special files in `wp-content/` that replace core components: `advanced-cache.php`, `db.php`, `object-cache.php`, `sunrise.php`, `maintenance.php`.
  Evidence: `wp-settings.php:98-100` (advanced-cache), `:136` (db.php via `require_wp_db()`).

## API and Interaction Surfaces
- [Observed | High] **REST API**: Prefix `/wp-json/wp/v2/`. 40+ built-in endpoint controllers covering posts, pages, media, users, comments, taxonomies, terms, menus, blocks, templates, widgets, settings, fonts, search, and more. Custom endpoints via `register_rest_route()`.
  Evidence: `wp-settings.php:294-341`, `wp-includes/rest-api.php` (~100KB).
- [Observed | High] **AJAX API**: `admin-ajax.php` endpoint. Hooks: `wp_ajax_{action}` (authenticated), `wp_ajax_nopriv_{action}` (public). Nonce verification via `check_ajax_referer()`.
  Evidence: `wp-admin/admin-ajax.php`.
- [Observed | High] **XML-RPC**: Legacy remote API at `xmlrpc.php`. `WP_XMLRPC_Server` class (~215KB). Can be disabled via `xmlrpc_enabled` filter.
  Evidence: `xmlrpc.php`, `wp-includes/class-wp-xmlrpc-server.php`.
- [Observed | High] **WP-CLI**: External tool (not bundled) but widely used. Commands follow `wp {command} {subcommand}` pattern. Custom commands via `WP_CLI::add_command()`.
- [Observed | High] **WP-Cron**: Pseudo-cron system triggered by page loads. Schedule events via `wp_schedule_event()`, `wp_schedule_single_event()`. Hook callbacks via `add_action()`.
  Evidence: `wp-cron.php`, `wp-includes/cron.php` (~42KB).
- [Observed | High] **Application Passwords**: Built-in API authentication. Users can create application-specific passwords for REST API/XML-RPC access.
  Evidence: `wp-includes/class-wp-application-passwords.php` (~17KB).
- [Observed | High] **Sitemap API**: Built-in XML sitemaps. Providers for posts, taxonomies, users. Custom providers via `wp_sitemaps_add_provider()`.
  Evidence: `wp-includes/sitemaps/` directory (10 files).

## Data Model and State Management
- [Observed | High] **Database abstraction**: `wpdb` class. Direct SQL via `$wpdb->query()`, `$wpdb->get_results()`, `$wpdb->prepare()` (parameterized queries). Not an ORM — manual SQL with helper methods.
  Evidence: `wp-includes/class-wpdb.php` (~118KB).
- [Observed | High] **Core tables** (default prefix `wp_`): `posts`, `postmeta`, `comments`, `commentmeta`, `terms`, `term_taxonomy`, `term_relationships`, `termmeta`, `users`, `usermeta`, `options`, `links`. Multisite adds: `blogs`, `site`, `sitemeta`, `blogmeta`, `signups`, `registration_log`.
  Evidence: `wp-admin/includes/schema.php`, `wp-includes/class-wpdb.php`.
- [Observed | High] **EAV pattern for metadata**: `postmeta`, `usermeta`, `commentmeta`, `termmeta` tables store arbitrary key-value pairs. API: `get_post_meta()`, `update_post_meta()`, `add_post_meta()`, `delete_post_meta()` (and equivalents for other meta types).
  Evidence: `wp-includes/meta.php` (~66KB).
- [Observed | High] **Options API**: Site-wide key-value store in `options` table. `get_option()`, `update_option()`, `add_option()`, `delete_option()`. Autoloaded options cached in memory.
  Evidence: `wp-includes/option.php` (~105KB).
- [Observed | High] **Transients API**: Cached key-value with expiration. Uses object cache if available, falls back to `options` table. `get_transient()`, `set_transient()`, `delete_transient()`.
  Evidence: `wp-includes/option.php`.
- [Observed | High] **Object Cache**: In-memory per-request cache via `WP_Object_Cache`. Can be replaced with persistent backends (Redis, Memcached) via `wp-content/object-cache.php` drop-in.
  Evidence: `wp-includes/class-wp-object-cache.php`, `wp-includes/cache.php`.
- [Observed | High] **DB schema upgrades**: `wp-admin/includes/upgrade.php` runs `dbDelta()` to diff and apply schema changes. Version tracked via `db_version` option vs `$wp_db_version` constant.
  Evidence: `wp-includes/version.php:26`, `wp-admin/includes/upgrade.php`.

## Security Posture
- [Observed | High] **Nonce system**: CSRF protection via `wp_create_nonce()`, `wp_verify_nonce()`, `check_admin_referer()`, `check_ajax_referer()`. Nonces are tied to user session and action string.
  Evidence: `wp-includes/pluggable.php` (nonce functions).
- [Observed | High] **Output escaping**: `esc_html()`, `esc_attr()`, `esc_url()`, `esc_js()`, `esc_textarea()`, `wp_kses()`, `wp_kses_post()`. Late escaping pattern recommended.
  Evidence: `wp-includes/formatting.php` (~354KB), `wp-includes/kses.php` (~83KB).
- [Observed | High] **Input sanitization**: `sanitize_text_field()`, `sanitize_email()`, `sanitize_file_name()`, `absint()`, `intval()`. All database queries should use `$wpdb->prepare()`.
  Evidence: `wp-includes/formatting.php`.
- [Observed | High] **Capabilities system**: Role-based access control. `current_user_can()`, `user_can()`. Built-in roles: `administrator`, `editor`, `author`, `contributor`, `subscriber`. Custom capabilities via `add_cap()`.
  Evidence: `wp-includes/capabilities.php` (~43KB), `wp-includes/class-wp-roles.php`.
- [Observed | High] **File upload validation**: MIME type checking, file extension whitelist. `wp_check_filetype()`, `wp_handle_upload()`.
  Evidence: `wp-includes/functions.php`.
- [Observed | High] **Password hashing**: Uses `phpass` library. `wp_hash_password()`, `wp_check_password()`.
  Evidence: `wp-includes/class-phpass.php`, `wp-includes/pluggable.php`.

## Integration Capability Matrix
| Domain | Entry Points | Required Adapters | Complexity | Risks | Confidence |
|---|---|---|---|---|---|
| External APIs | REST API `/wp-json/wp/v2/`, `register_rest_route()` for custom endpoints | OAuth/Application Passwords for auth, custom controller classes | Low-Medium | API exposure if not properly permissioned | High |
| Authentication/SSO | `wp_authenticate` filter, `authenticate` filter chain, Application Passwords, pluggable auth functions | SSO plugin or custom `authenticate` filter | Medium | Session handling complexity, pluggable function conflicts | High |
| Payment | No built-in payment system | WooCommerce or custom plugin with payment gateway SDK | High | PCI compliance, plugin dependency | High |
| Messaging/Queue | WP-Cron for scheduling, `wp_mail()` for email, Action Scheduler (plugin) for async jobs | Queue plugin (Action Scheduler), SMTP plugin for reliable email | Medium | WP-Cron depends on traffic, no true async queue in core | High |
| Storage/CDN | `wp_upload_dir()`, `wp_get_attachment_url()` filters, media upload hooks | CDN plugin or custom `upload_dir` / `wp_get_attachment_url` filter | Low | URL rewriting, cache invalidation | High |
| Observability | `WP_DEBUG_LOG`, `error_log()`, `do_action('shutdown')`, Query Monitor plugin | Logging plugin or custom error handler via `set_error_handler` | Low-Medium | No structured logging in core, debug log is flat file | Medium |
| Admin/UI customization | `admin_menu`, `add_meta_box()`, `admin_enqueue_scripts`, Settings API, Custom admin pages | Standard WordPress admin hooks | Low | Hook conflicts with other plugins, admin UI consistency | High |
| Content/data migration | WXR export/import, REST API bulk operations, `wp_insert_post()`, `wpdb` direct queries | WP-CLI for bulk operations, custom importer plugin | Medium | Post meta mapping, attachment migration, serialized data | High |
| Theme/template | Template hierarchy, `get_template_part()`, child themes, `theme.json`, block templates | Standard theme development patterns | Low | Theme switching breaks customizations, widget areas differ | High |

## Strengths, Weaknesses, Risks
- [Observed | High] **Strength**: Unmatched extensibility via hooks/filters — virtually every behavior can be modified without touching core.
  Evidence: `wp-includes/default-filters.php` (~37KB of hook registrations), `wp-includes/plugin.php`.
- [Observed | High] **Strength**: Massive ecosystem — 60,000+ plugins, 10,000+ themes, extensive documentation, huge community.
- [Observed | High] **Strength**: Built-in REST API with comprehensive coverage of all content types.
  Evidence: `wp-includes/rest-api/endpoints/` (40+ controllers).
- [Observed | Medium] **Weakness**: No true dependency injection or service container — relies on global state (`$wpdb`, `$wp_query`, `$wp_filter`, etc.).
  Evidence: `wp-settings.php` (extensive use of `$GLOBALS`).
- [Observed | Medium] **Weakness**: WP-Cron is pseudo-cron triggered by page loads — unreliable for time-critical scheduled tasks without external cron trigger.
  Evidence: `wp-cron.php`.
- [Observed | Medium] **Weakness**: EAV metadata pattern (postmeta/usermeta) causes performance issues at scale due to JOIN-heavy queries.
  Evidence: `wp-includes/class-wp-meta-query.php`.
- [Observed | High] **Risk**: Plugin/theme conflicts via shared hook namespace. No isolation between extensions.
  Mitigation: Unique function/class prefixes, namespace usage in modern plugins.
- [Observed | High] **Risk**: `wp-config.php` contains database credentials and auth keys in plain PHP.
  Mitigation: Restrict file permissions, move above web root if possible.

## Top 10 Evidence Items
1. [Observed | High] Hook System Core
   File: `wp-includes/plugin.php`, `wp-includes/class-wp-hook.php`
   Summary: `add_filter`, `apply_filters`, `add_action`, `do_action` — the foundation of ALL WordPress extensibility.
2. [Observed | High] Bootstrap Sequence
   File: `wp-settings.php` (765 lines)
   Summary: Orchestrates entire WordPress load: constants → error handling → hook system → cache → mu-plugins → plugins → theme → init.
3. [Observed | High] REST API Surface
   File: `wp-includes/rest-api/endpoints/` (40+ controller classes)
   Summary: Full CRUD API for posts, media, users, terms, menus, blocks, templates, widgets, fonts, settings.
4. [Observed | High] Database Abstraction
   File: `wp-includes/class-wpdb.php` (~118KB)
   Summary: `wpdb` class — prepare(), query(), get_results(), insert(), update(), delete(). MySQL/MariaDB only.
5. [Observed | High] Query Engine
   File: `wp-includes/class-wp-query.php` (~163KB)
   Summary: `WP_Query` — THE content retrieval engine. Handles posts, pages, CPTs, taxonomies, meta queries, date queries, pagination.
6. [Observed | High] Theme System
   File: `wp-includes/class-wp-theme.php` (~65KB), `wp-includes/theme.php` (~135KB)
   Summary: Template hierarchy resolution, child theme inheritance, theme.json support, block template discovery.
7. [Observed | High] Block System
   File: `wp-includes/blocks.php` (~114KB), `wp-includes/class-wp-block-type.php`
   Summary: `register_block_type()`, block.json parsing, server-side rendering, block supports, block patterns/categories.
8. [Observed | High] Default Filters
   File: `wp-includes/default-filters.php` (~37KB)
   Summary: All core hook registrations — content filters, sanitization, formatting, REST API init, widget init, cron schedules.
9. [Observed | High] Security Functions
   File: `wp-includes/pluggable.php` (~127KB), `wp-includes/kses.php` (~83KB)
   Summary: Nonces, password hashing, auth cookies, email, user authentication — all overridable via pluggable pattern.
10. [Observed | High] Rewrite System
    File: `wp-includes/class-wp-rewrite.php` (~63KB)
    Summary: Pretty permalink generation, custom rewrite rules, endpoint registration, flush_rewrite_rules().

## Plugin Development Quick Reference
### Minimum Plugin Structure
```
my-plugin/
├── my-plugin.php          # Main file with plugin header
├── includes/              # PHP classes and functions
├── admin/                 # Admin-specific code
├── public/                # Front-end code
├── languages/             # Translation files (.pot, .po, .mo)
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── templates/             # Template files
├── readme.txt             # WordPress.org plugin directory readme
└── uninstall.php          # Cleanup on uninstall
```

### Essential Plugin Header
```php
<?php
/**
 * Plugin Name: My Plugin
 * Plugin URI:  https://example.com/my-plugin
 * Description: A brief description.
 * Version:     1.0.0
 * Author:      Author Name
 * Author URI:  https://example.com
 * License:     GPL-2.0+
 * Text Domain: my-plugin
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */
```

### Key Plugin Patterns
```php
// Hook into WordPress
add_action('init', 'myplugin_init');
add_filter('the_content', 'myplugin_filter_content');

// Register Custom Post Type
register_post_type('book', [...]);

// Register REST API endpoint
add_action('rest_api_init', function() {
    register_rest_route('myplugin/v1', '/data', [...]);
});

// Enqueue scripts/styles
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style('myplugin-style', plugins_url('css/style.css', __FILE__));
    wp_enqueue_script('myplugin-script', plugins_url('js/script.js', __FILE__), ['jquery'], '1.0', true);
});

// Admin menu
add_action('admin_menu', function() {
    add_menu_page('My Plugin', 'My Plugin', 'manage_options', 'my-plugin', 'myplugin_admin_page');
});

// Activation/Deactivation
register_activation_hook(__FILE__, 'myplugin_activate');
register_deactivation_hook(__FILE__, 'myplugin_deactivate');
```

## Theme Development Quick Reference
### Classic Theme Structure
```
my-theme/
├── style.css              # Theme header + styles
├── index.php              # Fallback template
├── functions.php          # Theme setup, hooks, enqueues
├── header.php             # <head> and opening body
├── footer.php             # Footer and closing body
├── sidebar.php            # Sidebar widget area
├── single.php             # Single post template
├── page.php               # Page template
├── archive.php            # Archive listing
├── search.php             # Search results
├── 404.php                # Not found page
├── comments.php           # Comment display
├── screenshot.png         # Theme preview (1200x900)
└── template-parts/        # Reusable template partials
```

### Block Theme (FSE) Structure
```
my-block-theme/
├── style.css              # Theme header
├── theme.json             # Design tokens, settings, styles
├── templates/             # Block-based templates (HTML)
│   ├── index.html
│   ├── single.html
│   ├── page.html
│   └── archive.html
├── parts/                 # Template parts
│   ├── header.html
│   └── footer.html
├── patterns/              # Block patterns
├── assets/
│   ├── fonts/
│   └── images/
└── functions.php          # Optional: enqueues, registrations
```

## WordPress Lifecycle Hooks (Execution Order)
```
muplugins_loaded     → After must-use plugins load
plugins_loaded       → After all active plugins load
setup_theme          → Before theme functions.php loads
after_setup_theme    → After theme functions.php loads
init                 → WordPress fully initialized (register CPT/taxonomy here)
wp_loaded            → Everything loaded, before headers sent
admin_init           → Admin-only init (after init)
admin_menu           → Register admin menu items
wp                   → After WP object setup, before template
template_redirect    → Before template selection (redirects here)
wp_enqueue_scripts   → Enqueue front-end scripts/styles
wp_head              → Inside <head> tag
wp_footer            → Before </body> tag
shutdown             → PHP shutdown handler
```

## Unknowns and Verification Plan
- [Assumed | Medium] Plugin compatibility with specific PHP 8.x strict mode features varies widely per plugin.
  Verification: Test with `WP_DEBUG=true` and PHP 8.x in staging.
- [Assumed | Medium] WP-Cron reliability depends on traffic volume and hosting configuration.
  Verification: Set up system cron (`wget -q -O - https://example.com/wp-cron.php`) and disable `DISABLE_WP_CRON`.
- [Assumed | Low] Multisite-specific behaviors may differ significantly from single-site installations.
  Verification: Test in multisite environment if cross-site features are needed.

## Recommended Next Actions (30/60/90 day)
- [30 days | High priority]
  - Identify which hooks your plugin/theme needs and document them.
  - Set up local development with `WP_DEBUG`, `WP_DEBUG_LOG`, `SCRIPT_DEBUG` enabled.
  - Review WordPress Coding Standards (WPCS) and install phpcs with WordPress sniffs.
  - Register Custom Post Types and Taxonomies using `init` hook.
- [60 days | Medium priority]
  - Implement REST API custom endpoints for any AJAX functionality.
  - Set up i18n: wrap strings with `__()`, `_e()`, `esc_html__()`, generate `.pot` file.
  - Create block patterns or custom blocks with `block.json` if using Block Editor.
  - Implement proper uninstall cleanup (database tables, options, transients).
- [90 days | Medium priority]
  - Performance optimization: implement object caching, review query efficiency.
  - Security audit: verify nonce usage, capability checks, escaping, and sanitization.
  - Create automated tests with `WP_UnitTestCase` and `wp-env`.
  - Submit to WordPress.org Plugin Directory if applicable (follow Plugin Guidelines).
