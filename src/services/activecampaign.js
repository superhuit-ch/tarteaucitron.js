import Service from '_service';

class ActiveCampaign extends Service {
	init ( args ) {
		if (args.actid === undefined) {
			return;
		}
		window.trackcmp_email = '';
		this.addScript('https://trackcmp.net/visit?actid=' + args.actid + '&e=' + encodeURIComponent(trackcmp_email) + '&r=' + encodeURIComponent(document.referrer) + '&u=' + encodeURIComponent(window.location.href));
	}
}

module.exports = new ActiveCampaign( 'activecampaign', 'ads', 'Active Campaign', 'https://www.activecampaign.com/privacy-policy/' )

	