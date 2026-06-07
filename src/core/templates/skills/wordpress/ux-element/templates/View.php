<?php
/**
 * Frontend view for {{ElementName}}
 * 
 * @var array $atts
 */

$classes = array('{{class_prefix}}{{element_slug}}');
if (!empty($atts['class'])) $classes[] = $atts['class'];
if (!empty($atts['visibility'])) $classes[] = $atts['visibility'];

$inline_style = '';
if (!empty($atts['textColor'])) $inline_style .= 'color: ' . esc_attr($atts['textColor']) . ';';
if (!empty($atts['bgColor'])) $inline_style .= 'background-color: ' . esc_attr($atts['bgColor']) . ';';

?>
<div id="<?php echo esc_attr($atts['_id']); ?>" 
     class="<?php echo esc_attr(implode(' ', $classes)); ?>"
     style="<?php echo esc_attr($inline_style); ?>">
    <?php echo esc_html($atts['title']); ?>
</div>
