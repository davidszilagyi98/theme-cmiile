<?php
/**
 * Theme functions and definitions
 *
 * @package cmiile
 */

if ( ! defined( 'ABSPATH' ) ) {
	return;
}

/**
 * Require the main autoloader
 */
require_once 'autoload.php';

define( 'CMIILE_VERSION', '2.0.0' );
define( 'CMIILE_URL', get_stylesheet_directory_uri() );
define( 'CMIILE_PATH', get_stylesheet_directory() );

new Tillty\Themes\Cmiile\Hooks();