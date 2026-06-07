<?php

namespace {{namespace_prefix}}\Controllers\Elements;

use polyxgo\PolyUtilities\Core\Helper;

class Element{{ElementName}}Controller
{
    public function register_hooks()
    {
        // 1. Frontend Shortcode
        add_shortcode('{{shortcode_prefix}}{{element_slug}}', [$this, 'render_element']);

        // 2. UX Builder Integration (Flatsome only)
        if (Helper::is_flatsome_theme_activated()) {
            add_action('ux_builder_setup', [$this, 'register_ux_builder_element']);
        }
    }

    public function register_ux_builder_element()
    {
        if (function_exists('add_ux_builder_shortcode')) {
            // Include the UI registration file
            require_once Helper::get_poly_ux_builder_shortcode('{{element_slug}}');
        }
    }

    public function render_element($atts, $content = null)
    {
        $atts = shortcode_atts([
            '_id' => '{{element_slug}}-' . rand(),
            'title' => '',
            'class' => '',
            'visibility' => '',
            // Add more attributes here
        ], $atts, '{{shortcode_prefix}}{{element_slug}}');

        ob_start();
        $view_path = plugin_dir_path({{plugin_dir_const}}) . '/inc/Views/elements/{{element_slug}}.php';
        
        if (file_exists($view_path)) {
            include $view_path;
        } else {
            // Fallback inline rendering
            echo '<div class="' . esc_attr($atts['class']) . '">' . esc_html($atts['title']) . '</div>';
        }
        
        return ob_get_clean();
    }
}
