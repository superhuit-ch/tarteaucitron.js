import Service from '_service';

class Webmecanik extends Service {
	init ( args ) {

		if (args.webmecanikurl === undefined) {
			return;
		}
		window['WebmecanikTrackingObject'] = 'mt';
		window['mt'] = window['mt'] || function () {
			(window['mt'].q = window['mt'].q || []).push(arguments);
		};
		this.addScript(args.webmecanikurl, '', function () {
			mt('send', 'pageview');
		});
	}
}

module.exports = new Webmecanik( 'webmecanik', 'analytic', 'Webmecanik', 'https://webmecanik.com/tos', true, ['mtc_id', 'mtc_sid'] )
