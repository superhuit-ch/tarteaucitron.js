"key": "matomo",    "type": "analytic",    "name": "Matomo (formerly known as Piwik)",    "uri": "https://matomo.org/faq/general/faq_146/",    "needConsent": false,    "cookies": ['_pk_ref', '_pk_cvar', '_pk_id', '_pk_ses', '_pk_hsr', 'piwik_ignore', '_pk_uid'],    "js": function () {        "use strict";        if (tarteaucitron.user.matomoId === undefined) {            return;        }        window._paq = window._paq || [];        window._paq.push(["setSiteId", tarteaucitron.user.matomoId]);        window._paq.push(["setTrackerUrl", tarteaucitron.user.matomoHost + "piwik.php"]);        window._paq.push(["setDoNotTrack", 1]);        window._paq.push(["trackPageView"]);        window._paq.push(["setIgnoreClasses", ["no-tracking", "colorbox"]]);        window._paq.push(["enableLinkTracking"]);        window._paq.push([function() {            var self = this;            function getOriginalVisitorCookieTimeout() {                var now = new Date(),                nowTs = Math.round(now.getTime() / 1000),                visitorInfo = self.getVisitorInfo();                var createTs = parseInt(visitorInfo[2]);                var cookieTimeout = 33696000; // 13 mois en secondes                var originalTimeout = createTs + cookieTimeout - nowTs;                return originalTimeout;            }            this.setVisitorCookieTimeout( getOriginalVisitorCookieTimeout() );        }]);        tarteaucitron.addScript(tarteaucitron.user.matomoHost + 'piwik.js', '', '', true, 'defer', true);    }};// Hotjar /*    1. Set the following variable before the initialization :     tarteaucitron.user.hotjarId = YOUR_WEBSITE_ID;    tarteaucitron.user.HotjarSv = XXXX; // Can be found in your website tracking code as "hjvs=XXXX"     2. Push the service :     (tarteaucitron.job = tarteaucitron.job || []).push('hotjar');     3. HTML    You don't need to add any html code, if the service is autorized, the javascript is added. otherwise n