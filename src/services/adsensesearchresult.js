"key": "adsensesearchresult",    "type": "ads",    "name": "Google Adsense Search (result)",    "uri": "http://www.google.com/ads/preferences/",    "needConsent": true,    "cookies": [],    "js": function () {        "use strict";        if (tarteaucitron.user.adsensesearchresultCx === undefined) {            return;        }        tarteaucitron.addScript('//www.google.com/cse/cse.js?cx=' + tarteaucitron.user.adsensesearchresultCx);    },    "fallback": function () {        "use strict";        var id = 'adsensesearchresult';        if (document.getElementById('gcse_searchresults')) {            document.getElementById('gcse_searchresults').innerHTML = tarteaucitron.engage(id);        }    }