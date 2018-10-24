class BingAds extends Service {
 	init ( args ) {
 		var u = args.bingadsTag || 'uetq';
 		window[u] = window[u] || [];
 		this.addScript('https://bat.bing.com/bat.js', '', function () {
 			var bingadsCreate = {
 				ti: args.bingadsID
 			};
 			if ('bingadsStoreCookies' in args) {
 				bingadsCreate['storeConvTrackCookies'] = args.bingadsStoreCookies;
 			}
 			bingadsCreate.q = window[u];
 			window[u] = new UET(bingadsCreate);
 			window[u].push('pageload');
 		});
 	}
}

module.exports = new BingAds('bingads', 'ads', 'Bing Ads Universal Event Tracking', 'https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads', true, ['_uetmsclkid'])
