<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package {{namespace}}
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Clean up plugin data.
 */
delete_option( '{{prefix}}version' );
delete_option( '{{prefix}}api_key' );

// Delete custom tables if any...
// global $wpdb;
// $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}your_table_name" );
