"key": "twenga",    "type": "ads",    "name": "Twenga",    "uri": "http://www.twenga.com/privacy.php",    "needConsent": true,    "cookies": [],    "js": function () {        "use strict";        if (tarteaucitron.user.twengaId === undefined || tarteaucitron.user.twengaLocale === undefined) {            return;        }        tarteaucitron.addScript('//tracker.twenga.' + tarteaucitron.user.twengaLocale + '/st/tracker_' + tarteaucitron.user.twengaId + '.js');    }