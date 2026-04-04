<?php
/**
 * Admin Settings Template
 *
 * @package {{namespace}}
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Handle form submission
if ( isset( $_POST['{{prefix}}save_settings'] ) ) {
	
	// Check nonce
	if ( ! isset( $_POST['{{prefix}}settings_nonce'] ) || ! wp_verify_nonce( $_POST['{{prefix}}settings_nonce'], '{{prefix}}settings_action' ) ) {
		wp_die( esc_html__( 'Security check failed.', '{{text_domain}}' ) );
	}

	// Check capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have sufficient permissions to access this page.', '{{text_domain}}' ) );
	}

	// Save settings (example)
	if ( isset( $_POST['{{prefix}}api_key'] ) ) {
		update_option( '{{prefix}}api_key', sanitize_text_field( wp_unslash( $_POST['{{prefix}}api_key'] ) ) );
	}

	echo '<div class="updated"><p>' . esc_html__( 'Settings saved.', '{{text_domain}}' ) . '</p></div>';
}

$api_key = get_option( '{{prefix}}api_key', '' );
?>

<div class="wrap {{plugin_slug}}-settings">
	<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

	<form method="post" action="">
		<?php wp_nonce_field( '{{prefix}}settings_action', '{{prefix}}settings_nonce' ); ?>
		
		<table class="form-table" role="presentation">
			<tbody>
				<tr>
					<th scope="row">
						<label for="{{prefix}}api_key"><?php esc_html_e( 'API Key', '{{text_domain}}' ); ?></label>
					</th>
					<td>
						<input name="{{prefix}}api_key" type="text" id="{{prefix}}api_key" value="<?php echo esc_attr( $api_key ); ?>" class="regular-text">
						<p class="description"><?php esc_html_e( 'Enter your API key here.', '{{text_domain}}' ); ?></p>
					</td>
				</tr>
			</tbody>
		</table>

		<p class="submit">
			<input type="submit" name="{{prefix}}save_settings" id="submit" class="button button-primary" value="<?php esc_attr_e( 'Save Changes', '{{text_domain}}' ); ?>">
		</p>
	</form>
</div>
