"key": "facebook",    "type": "social",    "name": "Facebook",    "uri": "https://www.facebook.com/policies/cookies/",    "needConsent": true,    "cookies": [],    "js": function () {        "use strict";        tarteaucitron.fallback(['fb-post', 'fb-follow', 'fb-activity', 'fb-send', 'fb-share-button', 'fb-like', 'fb-video'], '');        tarteaucitron.addScript('//connect.facebook.net/' + tarteaucitron.getLocale() + '/sdk.js#xfbml=1&version=v2.0', 'facebook-jssdk');        if (tarteaucitron.isAjax === true) {            if (typeof FB !== "undefined") {                FB.XFBML.parse();            }        }    },    "fallback": function () {        "use strict";        var id = 'facebook';        tarteaucitron.fallback(['fb-post', 'fb-follow', 'fb-activity', 'fb-send', 'fb-share-button', 'fb-like', 'fb-video'], tarteaucitron.engage(id));    }