# Skill: WordPress Plugin Standard (WP.org Compliant)

This skill guides the creation of a high-quality, secure, and WordPress.org compliant plugin. It focuses on adherence to the Plugin Check (PCP) requirements and provides a robust structure including admin interfaces.

## Purpose
Standardize WordPress plugin development to ensure acceptance into the official repository, maximize security, and promote maintainability through strict separation of concerns.

## Required Variables
- `{{plugin_name}}`: Human-readable name (e.g., My Awesome Plugin).
- `{{plugin_slug}}`: Unique slug (e.g., my-awesome-plugin).
- `{{namespace}}`: PHP Namespace (e.g., PolyXGO\MyPlugin).
- `{{prefix}}`: Unique prefix for functions/variables (e.g., pxmp_).
- `{{text_domain}}`: I18n text domain (usually same as plugin slug).

## Core Requirements (WordPress.org & PCP)

### 1. Security & Protection
- **Direct Access**: Use `if ( ! defined( 'ABSPATH' ) ) exit;` at the top of every PHP file.
- **Nonces**: Verify nonces for all form submissions and AJAX requests.
- **Validation & Sanitization**: Sanitize all inputs (`sanitize_text_field`, `absint`, etc.) and validate data before processing.
- **Escaping**: Escape all outputs strictly based on context (`esc_html`, `esc_attr`, `wp_kses`, etc.).
- **Capabilities**: Explicitly check user capabilities (`current_user_can`) for all admin actions.

### 2. Code Organization & Standards
- **Naming**: Use the `{{prefix}}` for all global functions, variables, and constants.
- **Namespace**: Use PSR-4 namespacing (`{{namespace}}`) to avoid class collisions.
- **Separation of Concerns**: Keep CSS and JS in separate files. AVOID inline styles or scripts unless dynamically generated values are required (use `wp_localize_script` or `wp_add_inline_style` only when necessary).
- **No Prohibited Constructs**: Never use `eval()`, `base64_decode()` for obfuscation, or short tags (`<?`).

### 3. Required Components
- **Main Plugin File**: Must contain the required header comment.
- **`readme.txt`**: Standard WordPress.org format.
- **Admin Interface**:
  - A top-level or sub-menu item for the **Dashboard**.
  - A dedicated **Settings** page for configuration.
- **Uninstallation**: Provide an `uninstall.php` file to clean up data (options, tables) when the plugin is deleted.

## Implementation Steps

### Step 1: Initialize Main Structure
1. Create the main plugin file `{{plugin_slug}}.php` with the correct header.
2. Initialize the main class with a singleton or static instance.
3. Hook into `plugins_loaded` to start the plugin logic.

### Step 2: Register Admin Menu
1. Hook into `admin_menu`.
2. Add a menu page and a sub-page for Settings.
3. Enqueue admin-specific assets (CSS/JS) only on plugin pages.

### Step 3: Integrate UI/UX Skill
When designing the Dashboard or Settings page:
1. **Call Skill**: Use `(skill: ui-ux)` to define the design language.
2. **Apply Styles**: Use the colors, typography, and spacing defined by the `ui-ux` skill result.
3. Write styles in `assets/admin.css`.

### Step 4: Handle Data Persistence
1. Use the Options API (`get_option`, `update_option`) for settings.
2. Ensure all data saved to the database is sanitized.
3. Ensure all data retrieved from the database is escaped on output.

## Standards and Rules

### The Prefixing Rule
Every global identifier MUST start with `{{prefix}}`.
- ✅ `{{prefix}}get_settings()`
- ❌ `get_settings()`

### The "No Inline" Rule
- CSS must be in `assets/css/admin.css`.
- JS must be in `assets/js/admin.js`.
- Use `wp_enqueue_style` and `wp_enqueue_script` correctly.

## Templates
- [plugin-main.php](templates/plugin-main.php)
- [admin-dashboard.php](templates/admin-dashboard.php)
- [admin-settings.php](templates/admin-settings.php)
- [readme.txt](templates/readme.txt)
- [uninstall.php](templates/uninstall.php)
- [assets/admin-css.css](templates/assets/admin-css.css)
- [assets/admin-js.js](templates/assets/admin-js.js)
