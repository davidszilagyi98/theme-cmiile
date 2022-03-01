<?php
/**
 * WooCommerce checkout logic
 *
 * @package cmiile
 * @since 1.0.0
 */

namespace Tillty\Themes\Cmiile\WooCommerce;

/**
 * Adds checkout fields and hooks up to capacity control.
 */
class WooCommerce_Controller {

	/**
	 * Add WooCommerce Cart Menu Item Shortcode to particular menu
	 *
	 * @param html  $items The HTML output of the nav items.
	 * @param object $args Nav items arguments.
	 * @return html
	 */
	public function mini_cart_button_nav( $items, $args ) {

		if ( ! is_admin() && 'primary' === $args->theme_location && 1 === $args->depth ) {
			$items .= '<li>' . apply_filters( 'the_content', '[mini_cart_button]' ) . '</li>';
		}
		return $items;
	}

	/**
	 * Mini cart shortcode
	 *
	 * @return buffer
	 */
	public function mini_cart_button() {
		if ( ! is_admin() ) {

			ob_start();

			$cart_count = WC()->cart->cart_contents_count;
			$cart_url   = wc_get_cart_url();

			?>
			<div class="mini-cart-link">
				<a class="menu-item cart-contents" href="<?php echo esc_url( $cart_url ); ?>" title="<?php esc_html_e( 'Cart', 'woocommerce' ); ?>">
					<i class="fas fa-shopping-cart"></i>
					<?php if ( $cart_count > 0 ) : ?>
					<span class="cart-contents-count"><?php echo esc_html( $cart_count ); ?></span>
				<?php endif; ?>
				</a>
			</div>
			<?php
			return ob_get_clean();
		}
	}

	/**
	 * Mini cart fragment with cart count
	 *
	 * @param html $fragments The cart HTML fragments.
	 * @return buffer
	 */
	public function mini_cart_button_count( $fragments ) {
		ob_start();

		$cart_count = WC()->cart->cart_contents_count;
		$cart_url   = wc_get_cart_url();

		?>
		<a class="cart-contents menu-item" href="<?php echo esc_url( $cart_url ); ?>" title="<?php esc_html_e( 'Cart', 'woocommerce' ); ?>">
			<?php if ( $cart_count > 0 ) : ?>
					<span class="cart-contents-count"><?php echo esc_html( $cart_count ); ?></span>
			<?php endif; ?>
		</a>
		<?php
		$fragments['a.cart-contents'] = ob_get_clean();

		return $fragments;
	}

	/**
	 * Displays product title
	 *
	 * @return void
	 */
	public function show_title() {
    	global $product;
    	$title = $product->get_title();

    	echo "<h4>$title</h4>";
	}

	/**
	 * Add Theme support
	 */
	public function theme_support() {
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );
	}

	public function show_hero_section() {
		echo '<section class="hero">';
		dynamic_sidebar( 'hero' );
		echo '</section>';
	}
}