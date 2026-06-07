<?php
/**
 * Plugin Name:       {{plugin_name}}
 * Description:       A high-quality WordPress plugin following WP.org standards.
 * Version:           1.0.0
 * Author:            Your Name
 * Author URI:        https://example.com
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       {{text_domain}}
 * Domain Path:       /languages
 *
 * @package           {{namespace}}
 */

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The core plugin class.
 */
class {{namespace}}\Main {

	/**
	 * Instance of this class.
	 *
	 * @var object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin.
	 */
	public function __construct() {
		$this->define_constants();
		$this->includes();
		$this->init_hooks();
	}

	/**
	 * Return an instance of this class.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Define constants.
	 */
	private function define_constants() {
		define( '{{prefix|upper}}VERSION', '1.0.0' );
		define( '{{prefix|upper}}PATH', plugin_dir_path( __FILE__ ) );
		define( '{{prefix|upper}}URL', plugin_dir_url( __FILE__ ) );
	}

	/**
	 * Include required files.
	 */
	private function includes() {
		// Include admin classes, helpers, etc.
	}

	/**
	 * Initialize hooks.
	 */
	private function init_hooks() {
		add_action( 'admin_menu', [ $this, 'add_menu_pages' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_admin_assets' ] );
		
		// Activation / Deactivation hooks
		register_activation_hook( __FILE__, [ $this, 'activate' ] );
		register_deactivation_hook( __FILE__, [ $this, 'deactivate' ] );
	}

	/**
	 * Add Admin Menu Pages.
	 */
	public function add_menu_pages() {
		add_menu_page(
			__( '{{plugin_name}}', '{{text_domain}}' ),
			__( '{{plugin_name}}', '{{text_domain}}' ),
			'manage_options',
			'{{plugin_slug}}',
			[ $this, 'render_dashboard_page' ],
			'dashicons-admin-generic',
			100
		);

		add_submenu_page(
			'{{plugin_slug}}',
			__( 'Dashboard', '{{text_domain}}' ),
			__( 'Dashboard', '{{text_domain}}' ),
			'manage_options',
			'{{plugin_slug}}',
			[ $this, 'render_dashboard_page' ]
		);

		add_submenu_page(
			'{{plugin_slug}}',
			__( 'Settings', '{{text_domain}}' ),
			__( 'Settings', '{{text_domain}}' ),
			'manage_options',
			'{{plugin_slug}}-settings',
			[ $this, 'render_settings_page' ]
		);
	}

	/**
	 * Enqueue Admin Assets.
	 */
	public function enqueue_admin_assets( $hook ) {
		// Only load on our plugin pages
		if ( strpos( $hook, '{{plugin_slug}}' ) === false ) {
			return;
		}

		wp_enqueue_style( '{{plugin_slug}}-admin', {{prefix|upper}}URL . 'assets/css/admin.css', [], {{prefix|upper}}VERSION );
		wp_enqueue_script( '{{plugin_slug}}-admin', {{prefix|upper}}URL . 'assets/js/admin.js', [ 'jquery' ], {{prefix|upper}}VERSION, true );
		
		wp_localize_script( '{{plugin_slug}}-admin', '{{prefix}}params', [
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( '{{prefix}}nonce' ),
		]);
	}

	/**
	 * Render Dashboard Page.
	 */
	public function render_dashboard_page() {
		// Include template file
		include {{prefix|upper}}PATH . 'templates/admin-dashboard.php';
	}

	/**
	 * Render Settings Page.
	 */
	public function render_settings_page() {
		// Include template file
		include {{prefix|upper}}PATH . 'templates/admin-settings.php';
	}

	/**
	 * Activation logic.
	 */
	public function activate() {
		// Setup database tables, default options, etc.
	}

	/**
	 * Deactivation logic.
	 */
	public function deactivate() {
		// Clear scheduled tasks, etc.
	}
}

/**
 * Initialize the plugin.
 */
function {{prefix}}init() {
	return {{namespace}}\Main::get_instance();
}

add_action( 'plugins_loaded', '{{prefix}}init' );
