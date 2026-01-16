<?php

use polyxgo\PolyUtilities\Core\Helper;
use polyxgo\PolyUtilities\Core\Options;

add_ux_builder_shortcode('{{shortcode_prefix}}{{element_slug}}', array(
    'name'      => __('{{ElementName}}', 'polyutilities'),
    'category'  => __('PolyUtilities', 'polyutilities'),
    'template'  => Helper::get_poly_ux_builder_template('{{element_slug}}'),
    'thumbnail' => Helper::get_poly_ux_builder_thumbnail('{{element_slug}}'),
    'info'      => '{{ title }}',
    'priority'  => 10,
    'options'   => array(
        'title' => array(
            'type'        => 'textfield',
            'heading'     => __('Title', 'polyutilities'),
            'default'     => 'Element Title',
            'auto_focus'  => true,
        ),
        // Add more options here (colorpicker, slider, select, etc.)
        'advanced_options' => require Helper::get_poly_ux_builder_element('commons', 'advanced'),
    ),
));
