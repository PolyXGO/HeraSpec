<?php
/**
 * Admin Dashboard Template
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<div class="wrap {{plugin_slug}}-dashboard">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
	
	<div class="welcome-panel">
		<div class="welcome-panel-content">
			<h2><?php esc_html_e( 'Welcome to {{plugin_name}}', '{{text_domain}}' ); ?></h2>
			<p class="about-description"><?php esc_html_e( 'Thank you for using our plugin. This dashboard provides an overview of your activity.', '{{text_domain}}' ); ?></p>
			
			<div class="welcome-panel-column-container">
				<div class="welcome-panel-column">
					<h3><?php esc_html_e( 'Get Started', '{{text_domain}}' ); ?></h3>
					<a class="button button-primary button-hero" href="<?php echo esc_url( admin_url( 'admin.php?page={{plugin_slug}}-settings' ) ); ?>"><?php esc_html_e( 'Configure Settings', '{{text_domain}}' ); ?></a>
				</div>
				<div class="welcome-panel-column">
					<h3><?php esc_html_e( 'Next Steps', '{{text_domain}}' ); ?></h3>
					<ul>
						<li><a href="#" class="welcome-icon welcome-view-site"><?php esc_html_e( 'Check Features', '{{text_domain}}' ); ?></a></li>
						<li><a href="#" class="welcome-icon welcome-edit-page"><?php esc_html_e( 'Documentation', '{{text_domain}}' ); ?></a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<div class="postbox-container">
		<div class="postbox">
			<div class="postbox-header">
				<h2 class="hndle"><?php esc_html_e( 'Overview Stats', '{{text_domain}}' ); ?></h2>
			</div>
			<div class="inside">
				<p><?php esc_html_e( 'Summary of your plugin usage will appear here.', '{{text_domain}}' ); ?></p>
			</div>
		</div>
	</div>
</div>
