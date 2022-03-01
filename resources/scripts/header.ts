$(window).on('scroll', function () {
	const scroll = $(window).scrollTop();
	const header = $('.site-header');

	if (scroll && scroll >= 500) {
		header.addClass('small');
	} else {
		header.removeClass('small');
	}
});
