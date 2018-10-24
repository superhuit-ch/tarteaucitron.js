class FacebookPixel extends Service {
	init ( args ) {
		var n;
		if (window.fbq) return;
		
		n = window.fbq = function () {
			n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
		};
		
		if (!window._fbq) window._fbq = n;
		
		n.push = n;
		n.loaded = !0;
		n.version = '2.0';
		n.queue = [];
		
		this.addScript('https://connect.facebook.net/en_US/fbevents.js');
		
		fbq('init', args.facebookpixelId);
		fbq('track', 'PageView');
		if (typeof args.facebookpixelMore === 'function') {
			args.facebookpixelMore();
		}
	}
}

module.exports = new FacebookPixel('facebookpixel', 'ads', 'Facebook Pixel', 'https://fr-fr.facebook.com/business/help/www/651294705016616', true, ['datr', 'fr', 'reg_ext_ref', 'reg_fb_gate', 'reg_fb_ref', 'sb', 'wd', 'x-src'])
