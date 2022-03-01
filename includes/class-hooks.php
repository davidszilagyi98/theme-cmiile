<?php
/**
 * Hooks class
 *
 * @package cmiile
 * @since 1.0.0
 */

namespace Tillty\Themes\Cmiile;

use Tillty\Themes\Cmiile\WooCommerce\WooCommerce_Controller;
/**
 * The main init class for this theme
 */
class Hooks {

	/**
	 * The class contructor
	 */
	public function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'scripts_and_styles' ) );
		add_filter( 'tillty_core_footer_areas', fn() => 4 );

		if ( is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
			$this->init_woocommerce( new WooCommerce_Controller() );
		}
	}

	/**
	 * Enqueue styles and scripts
	 *
	 * @return void
	 */
	public function scripts_and_styles() {
		wp_enqueue_style( 'fonts-preload', CMIILE_URL . '/assets/styles/fonts-preload.css', array(), CMIILE_VERSION );
		wp_enqueue_style( 'styles', CMIILE_URL . '/assets/styles/styles.css', array(), CMIILE_VERSION );
		wp_enqueue_script( 'header', CMIILE_URL . '/assets/scripts/header.js', array( 'jquery' ), CMIILE_VERSION, true );
		wp_enqueue_script( 'faq-menu', CMIILE_URL . '/assets/scripts/faq-menu.js', array( 'jquery' ), CMIILE_VERSION, true );
		wp_enqueue_script( 'full-width-iframe', CMIILE_URL . '/assets/scripts/full-width-iframe.js', array( 'jquery' ), CMIILE_VERSION, true );
		// Register fontawesome in the head.
		wp_enqueue_script( 'font-awesome', 'https://kit.fontawesome.com/9a71c0f08c.js', array(), CMIILE_VERSION, false );
	}

	/**
	 * Initializes the WooCommerce functions
	 *
	 * @param WooCommerce_Controller $controller The WC controller.
	 * @return void
	 */
	public function init_woocommerce( $controller ) {
		add_action( 'after_setup_theme', array( $controller, 'theme_support' ) );
		add_shortcode( 'mini_cart_button', array( $controller, 'mini_cart_button' ) );
		add_filter( 'wp_nav_menu_items', array( $controller, 'mini_cart_button_nav' ), 10, 2 );

		// Move product title.
		remove_action( 'woocommerce_single_product_summary', array( $controller, 'woocommerce_template_single_title' ), 5 );
		add_action( 'woocommerce_single_product_summary', array( $controller, 'show_title' ), 0 );

		// Move product price.
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
		add_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 25 );

		// Show hero section.
		add_action('woocommerce_before_shop_loop', array( $controller, 'show_hero_section' ) );
		remove_action('woocommerce_before_shop_loop', 'woocommerce_result_count', 20);
		remove_action('woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30);
	}
}

