# Skill: Flatsome UX Element

This skill guides the creation of custom UX Builder elements for the Flatsome theme within the PolyUtilities plugin.

## Purpose
Standardize the development of UX elements to ensure consistency across controllers, shortcodes, and templates, with special focus on real-time preview functionality. This skill is portable and uses dynamic prefixes for identity (Shortcode, Namespace, CSS Classes).

## Required Variables
When calling this skill, define the following identity prefixes:
- `{{namespace_prefix}}`: The root namespace (e.g., `polyxgo\PolyUtilities`).
- `{{shortcode_prefix}}`: Prefix for shortcode names (e.g., `poly_ux_`).
- `{{class_prefix}}`: Prefix for CSS classes (e.g., `poly-`).
- `{{plugin_dir_const}}`: The plugin directory constant (e.g., `__POLYUTILITIES_PLUGIN_DIR__`).

## Prerequisites
- Knowledge of PHP, WordPress Shortcodes, and AngularJS (for UX Builder templates).
- Access to `inc/Core/Helper.php` for utility functions.

## Implementation Steps

### 1. Register Shortcode Logic (The Controller)
Create a new controller class in `inc/Controllers/Elements/`.
- **Namespace**: `{{namespace_prefix}}\Controllers\Elements`
- **Method `register_hooks()`**: Add the shortcode `{{shortcode_prefix}}{{element_slug}}` and `ux_builder_setup` action.
- **Method `render_element($atts, $content)`**: Handle the frontend output.

### 2. Register UX Builder UI (The Shortcode)
Create a registration file in `inc/builder/shortcodes/`.
- Use `add_ux_builder_shortcode('{{shortcode_prefix}}{{element_slug}}', ...)`.
- Define options (textfield, select, colorpicker, slider, etc.).
- Link to the AngularJS template using `Helper::get_poly_ux_builder_template()`.

### 3. Build the Preview Template (AngularJS)
Create an HTML file in `inc/builder/shortcodes/templates/`.
- **CRITICAL**: Wrap the entire content in a `<span>` with `id="{{:: shortcode.$id }}"`.
- This ensures that clicking the element in the builder correctly selects it and shows options.
- Use `ng-style` and `style scope="scope"` for real-time CSS updates.

### 4. Create SVG Thumbnail
Create an SVG file in `inc/builder/shortcodes/thumbnails/`.
- **Naming**: Use `{{element_slug}}.svg`.
- **Dimensions**: Use `100x68px`.
- **Theme**: Use the "Pastel Red" theme (`#F87171` for accents, `#FCA5A5` for fills).

### 5. Create the Frontend View
(Optional) Extract the HTML into `inc/Views/elements/` for cleaner controllers.

## Standards and Rules

### The Wrapping Rule
Every UX Builder template MUST follow this structure:
```html
<span id="{{:: shortcode.$id }}">
    <!-- Main element (e.g., <a>, <div>, <section>) -->
    <div class="{{class_prefix}}{{element_slug}}" ng-style="{ 'color': shortcode.options.color }">
        {{ shortcode.options.text }}
    </div>
    
    <!-- Scoped styles for hover effects or complex rules -->
    <style scope="scope">
        #{{::shortcode.$id }} .{{class_prefix}}{{element_slug}}:hover {
            opacity: 0.8;
        }
    </style>
</span>
```

### Variable Naming (PHP vs AngularJS)
**CRITICAL**: When accessing shortcode options in the AngularJS template (`.html`), variables declared with underscores (`_`) in PHP MUST be accessed via **camelCase**.
- **PHP**: `bg_color` → **AngularJS**: `shortcode.options.bgColor`
- **PHP**: `pxg_clock_font` → **AngularJS**: `shortcode.options.pxgClockFont`
- **PHP**: `text_align` → **AngularJS**: `shortcode.options.textAlign`

### Color Handling
- Use HEX or RGBA strings consistently.
- Always provide default values in the shortcode registration or handle them in the template/controller.

## Templates
- [Controller.php](templates/Controller.php)
- [Shortcode.php](templates/Shortcode.php)
- [Template.html](templates/Template.html)
- [View.php](templates/View.php)
- [Thumbnail.svg](templates/Thumbnail.svg)
