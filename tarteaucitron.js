/*jslint browser: true, evil: true */
import './src/addEventListener-mdn-polyfill.js';

import addScript from './src/add-script.js';
import UserInterface from './src/user-interface.js';
import Cookie from './src/cookie.js';
import MakeAsync from './src/make-async.js';


// define correct path for files inclusion
var scripts = document.getElementsByTagName('script'),
		path = scripts[scripts.length - 1].src.split('?')[0],
		tarteaucitronForceCDN = (tarteaucitronForceCDN === undefined) ? '' : tarteaucitronForceCDN,
		cdn = (tarteaucitronForceCDN === '') ? path.split('/').slice(0, -1).join('/') + '/' : tarteaucitronForceCDN,
		alreadyLaunch = (alreadyLaunch === undefined) ? 0 : alreadyLaunch,
		tarteaucitronForceLanguage = (tarteaucitronForceLanguage === undefined) ? '' : tarteaucitronForceLanguage,
		tarteaucitronForceExpire = (tarteaucitronForceExpire === undefined) ? '' : tarteaucitronForceExpire,
		tarteaucitronCustomText = (tarteaucitronCustomText === undefined) ? '' : tarteaucitronCustomText,
		timeExipre = 31536000000,
		tarteaucitronProLoadServices,
		tarteaucitronNoAdBlocker = false;

const DEFAULT_PARAMS = {
	adblocker							 : false,
	hashtag								 : '#tarteaucitron',
	cookieName						 : 'tarteaucitron',
	highPrivacy						 : false,
	orientation						 : "top",
	removeCredit					 : false,
	showAlertSmall				 : true,
	cookieslist						 : true,
	handleBrowserDNTRequest: false,
	AcceptAllCta					 : false,
	moreInfoLink					 : true,
	privacyUrl						 : "",
	useExternalCss				 : false
};


class Tarteaucitron {
	constructor( params ) {
		this.version = 20181023;
		this.cdn = cdn;
		this.user = {};
		this.lang = {};
		this.services = {};
		this.added = [];
		this.idprocessed = [];
		this.state = [];
		this.launch = [];
		this.parameters = {};
		this.isAjax = false;
		this.reloadThePage = false;
		this.events = {
			init: function () {},
			load: function () {}
		};

		this.proTemp = '';
		
		this.parameters = Object.assign(DEFAULT_PARAMS, params);

		this.ui = new UserInterface();

		var origOpen;

		if (alreadyLaunch === 0) {
			alreadyLaunch = 1;

			window.addEventListener("load", function () {
				this.load();
				this.fallback(['tarteaucitronOpenPanel'], function (elem) {
					elem.addEventListener("click", function (event) {
						this.ui.openPanel();
						event.preventDefault();
					}, false);
				}, true);
			}, false);
			window.addEventListener("scroll", function () {
				var scrollPos = window.pageYOffset || document.documentElement.scrollTop,
						heightPosition;

				if (document.getElementById('tarteaucitronAlertBig') !== null && !this.parameters.highPrivacy) {
					if (document.getElementById('tarteaucitronAlertBig').style.display === 'block') {
						heightPosition = document.getElementById('tarteaucitronAlertBig').offsetHeight + 'px';

						if (scrollPos > (screen.height * 2)) {
							this.ui.respondAll(true);
						} else if (scrollPos > (screen.height / 2)) {
							document.getElementById('tarteaucitronDisclaimerAlert').innerHTML = '<strong>' + this.lang.alertBigScroll + '</strong> ' + this.lang.alertBig;
						}

						if (this.orientation === 'top') {
							document.getElementById('tarteaucitronPercentage').style.top = heightPosition;
						} else {
							document.getElementById('tarteaucitronPercentage').style.bottom = heightPosition;
						}
						document.getElementById('tarteaucitronPercentage').style.width = ((100 / (screen.height * 2)) * scrollPos) + '%';
					}
				}
			}, false);

			window.addEventListener("keydown", function (evt) {
				if (evt.keyCode === 27) {
					this.ui.closePanel();
				}
			}, false);
			window.addEventListener("hashchange", function () {
				if (document.location.hash === this.hashtag && this.hashtag !== '') {
					this.ui.openPanel();
				}
			}, false);
			window.addEventListener("resize", function () {
				if (document.getElementById('tarteaucitron') !== null) {
					if (document.getElementById('tarteaucitron').style.display === 'block') {
						this.ui.jsSizing('main');
					}
				}

				if (document.getElementById('tarteaucitronCookiesListContainer') !== null) {
					if (document.getElementById('tarteaucitronCookiesListContainer').style.display === 'block') {
						this.ui.jsSizing('cookie');
					}
				}
			}, false);


			if (typeof XMLHttpRequest !== 'undefined') {
				origOpen = XMLHttpRequest.prototype.open;
				XMLHttpRequest.prototype.open = function () {

					this.addEventListener("load", function () {
						if (typeof tarteaucitronProLoadServices === 'function') {
							tarteaucitronProLoadServices();
						}
					}, false);

					try {
						origOpen.apply(this, arguments);
					} catch (err) {}
				};
			}
		}

		if (this.events.init) {
			this.events.init();
		}
	}

	load() {
		var language 			 = this.getLanguage(),
				pathToLang 		 = `${this.cdn}lang/tarteaucitron.${language}.js?v=${this.version}`,
				pathToServices = `${this.cdn}tarteaucitron.services.js?v=${this.version}`,
				linkElement 	 = document.createElement('link'),
				
		// Step 1: load css
		if (!this.parameters.useExternalCss) {
			linkElement.rel  = 'stylesheet';
			linkElement.type = 'text/css';
			linkElement.href = `${this.cdn}css/tarteaucitron.css?v=${this.version}`;
			document.getElementsByTagName('head')[0].appendChild(linkElement);
		}

		// Step 2: load language and services
		addScript(pathToLang, '', function () {

			if (tarteaucitronCustomText !== '') {
				tarteaucitron.lang = tarteaucitron.AddOrUpdate(tarteaucitron.lang, tarteaucitronCustomText);
			}
			addScript(pathToServices, '', function () {

				var body = document.body,
						div = document.createElement('div'),
						html = '',
						index,
						orientation = 'Top',
						cat = ['ads', 'analytic', 'api', 'comment', 'social', 'support', 'video', 'other'],
						i;

				cat = cat.sort(function (a, b) {
					if (tarteaucitron.lang[a].title > tarteaucitron.lang[b].title) {
						return 1;
					}
					if (tarteaucitron.lang[a].title < tarteaucitron.lang[b].title) {
						return -1;
					}
					return 0;
				});

				// Step 3: prepare the html
				html += '<div id="tarteaucitronPremium"></div>';
				html += '<button id="tarteaucitronBack" onclick="tarteaucitron.userInterface.closePanel();" aria-label="' + tarteaucitron.lang.close + '"></button>';
				html += '<div id="tarteaucitron" role="dialog" aria-labelledby="dialogTitle">';
				html += '   <button id="tarteaucitronClosePanel" onclick="tarteaucitron.userInterface.closePanel();">';
				html += '       ' + tarteaucitron.lang.close;
				html += '   </button>';
				html += '   <div id="tarteaucitronServices">';
				html += '      <div class="tarteaucitronLine tarteaucitronMainLine" id="tarteaucitronMainLineOffset">';
				html += '         <span id="dialogTitle" class="tarteaucitronH1">' + tarteaucitron.lang.title + '</span>';
				html += '         <div id="tarteaucitronInfo" class="tarteaucitronInfoBox">';
				html += '         ' + tarteaucitron.lang.disclaimer;
				if (this.parameters.privacyUrl !== "") {
					html += '   <br/><br/>';
					html += '   <button id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
					html += '       ' + tarteaucitron.lang.privacyUrl;
					html += '   </button>';
				}
				html += '         </div>';
				html += '         <div class="tarteaucitronName">';
				html += '            <span class="tarteaucitronH2">' + tarteaucitron.lang.all + '</span>';
				html += '         </div>';
				html += '         <div class="tarteaucitronAsk" id="tarteaucitronScrollbarAdjust">';
				html += '            <button id="tarteaucitronAllAllowed" class="tarteaucitronAllow" onclick="tarteaucitron.userInterface.respondAll(true);">';
				html += '               &#10003; ' + tarteaucitron.lang.allowAll;
				html += '            </button> ';
				html += '            <button id="tarteaucitronAllDenied" class="tarteaucitronDeny" onclick="tarteaucitron.userInterface.respondAll(false);">';
				html += '               &#10007; ' + tarteaucitron.lang.denyAll;
				html += '            </button>';
				html += '         </div>';
				html += '      </div>';
				html += '      <div class="tarteaucitronBorder">';
				html += '         <div class="clear"></div><ul>';
				for (i = 0; i < cat.length; i += 1) {
					html += '         <li id="tarteaucitronServicesTitle_' + cat[i] + '" class="tarteaucitronHidden">';
					html += '            <div class="tarteaucitronTitle">';
					html += '               <button onclick="tarteaucitron.userInterface.toggle(\'tarteaucitronDetails' + cat[i] + '\', \'tarteaucitronInfoBox\');return false">&#10011; ' + tarteaucitron.lang[cat[i]].title + '</button>';
					html += '            </div>';
					html += '            <div id="tarteaucitronDetails' + cat[i] + '" class="tarteaucitronDetails tarteaucitronInfoBox">';
					html += '               ' + tarteaucitron.lang[cat[i]].details;
					html += '            </div>';
					html += '         <ul id="tarteaucitronServices_' + cat[i] + '"></ul></li>';
				}
				html += '         </ul>';
				html += '         <div class="tarteaucitronHidden" id="tarteaucitronScrollbarChild" style="height:20px;display:block"></div>';
				if (this.parameters.removeCredit === false) {
					html += '     <a class="tarteaucitronSelfLink" href="https://opt-out.ferank.eu/" rel="nofollow" target="_blank" rel="noopener" title="tarteaucitron ' + tarteaucitron.lang.newWindow + '">🍋 ' + tarteaucitron.lang.credit + '</a>';
				}
				html += '       </div>';
				html += '   </div>';
				html += '</div>';

				if (this.parameters.orientation === 'bottom') {
					orientation = 'Bottom';
				}

				if (this.parameters.highPrivacy && !this.parameters.AcceptAllCta) {
					html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
					html += '   <span id="tarteaucitronDisclaimerAlert">';
					html += '       ' + tarteaucitron.lang.alertBigPrivacy;
					html += '   </span>';
					html += '   <button id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.openPanel();">';
					html += '       ' + tarteaucitron.lang.personalize;
					html += '   </button>';

					if (this.parameters.privacyUrl !== "") {
						html += '   <button id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
						html += '       ' + tarteaucitron.lang.privacyUrl;
						html += '   </button>';
					}

					html += '</div>';
				} else {
					html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
					html += '   <span id="tarteaucitronDisclaimerAlert">';

					if (this.parameters.highPrivacy) {
						html += '       ' + tarteaucitron.lang.alertBigPrivacy;
					} else {
						html += '       ' + tarteaucitron.lang.alertBigClick + ' ' + tarteaucitron.lang.alertBig;
					}

					html += '   </span>';
					html += '   <button id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.respondAll(true);">';
					html += '       &#10003; ' + tarteaucitron.lang.acceptAll;
					html += '   </button>';
					html += '   <button id="tarteaucitronCloseAlert" onclick="tarteaucitron.userInterface.openPanel();">';
					html += '       ' + tarteaucitron.lang.personalize;
					html += '   </button>';

					if (this.parameters.privacyUrl !== "") {
						html += '   <button id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
						html += '       ' + tarteaucitron.lang.privacyUrl;
						html += '   </button>';
					}

					html += '</div>';
					html += '<div id="tarteaucitronPercentage"></div>';
				}

				if (this.parameters.showAlertSmall === true) {
					html += '<div id="tarteaucitronAlertSmall" class="tarteaucitronAlertSmall' + orientation + '">';
					html += '   <button id="tarteaucitronManager" onclick="tarteaucitron.userInterface.openPanel();">';
					html += '       ' + tarteaucitron.lang.alertSmall;
					html += '       <span id="tarteaucitronDot">';
					html += '           <span id="tarteaucitronDotGreen"></span>';
					html += '           <span id="tarteaucitronDotYellow"></span>';
					html += '           <span id="tarteaucitronDotRed"></span>';
					html += '       </span>';
					if (this.parameters.cookieslist === true) {
						html += '   </button><!-- @whitespace';
						html += '   --><button id="tarteaucitronCookiesNumber" onclick="tarteaucitron.userInterface.toggleCookiesList();">0</button>';
						html += '   <div id="tarteaucitronCookiesListContainer">';
						html += '       <button id="tarteaucitronClosePanelCookie" onclick="tarteaucitron.userInterface.closePanel();">';
						html += '           ' + tarteaucitron.lang.close;
						html += '       </button>';
						html += '       <div class="tarteaucitronCookiesListMain" id="tarteaucitronCookiesTitle">';
						html += '            <span id="tarteaucitronCookiesNumberBis" class="tarteaucitronH2">0 cookie</span>';
						html += '       </div>';
						html += '       <div id="tarteaucitronCookiesList"></div>';
						html += '    </div>';
					} else {
						html += '   </div>';
					}
					html += '</div>';
				}

				addScript(this.cdn + 'advertising.js?v=' + tarteaucitron.version, '', function () {
					if (tarteaucitronNoAdBlocker === true || this.parameters.adblocker === false) {

						// create a wrapper container at the same level than tarteaucitron so we can add an aria-hidden when tarteaucitron is opened
						/*var wrapper = document.createElement('div');
						wrapper.id = "contentWrapper";

						while (document.body.firstChild)
						{
								wrapper.appendChild(document.body.firstChild);
						}

						// Append the wrapper to the body
						document.body.appendChild(wrapper);*/

						div.id = 'tarteaucitronRoot';
						body.appendChild(div, body);
						div.innerHTML = html;

						if (tarteaucitron.job !== undefined) {
							tarteaucitron.job = tarteaucitron.cleanArray(tarteaucitron.job);
							for (index = 0; index < tarteaucitron.job.length; index += 1) {
								tarteaucitron.addService(tarteaucitron.job[index]);
							}
						} else {
							tarteaucitron.job = []
						}

						tarteaucitron.isAjax = true;

						tarteaucitron.job.push = function (id) {

							// ie <9 hack
							if (typeof tarteaucitron.job.indexOf === 'undefined') {
								tarteaucitron.job.indexOf = function (obj, start) {
									var i,
										j = this.length;
									for (i = (start || 0); i < j; i += 1) {
										if (this[i] === obj) {
											return i;
										}
									}
									return -1;
								};
							}

							if (tarteaucitron.job.indexOf(id) === -1) {
								Array.prototype.push.call(this, id);
							}
							tarteaucitron.launch[id] = false;
							tarteaucitron.addService(id);
						};

						if (document.location.hash === this.parameters.hashtag && this.parameters.hashtag !== '') {
							this.ui.openPanel();
						}

						tarteaucitron.cookie.number();
						setInterval(tarteaucitron.cookie.number, 60000);
					}
				}, this.parameters.adblocker);

				if (this.parameters.adblocker === true) {
					setTimeout(function () {
						if (tarteaucitronNoAdBlocker === false) {
							html = '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '" style="display:block" role="alert" aria-live="polite">';
							html += '   <p id="tarteaucitronDisclaimerAlert">';
							html += '       ' + tarteaucitron.lang.adblock + '<br/>';
							html += '       <strong>' + tarteaucitron.lang.adblock_call + '</strong>';
							html += '   </p>';
							html += '   <button id="tarteaucitronPersonalize" onclick="location.reload();">';
							html += '       ' + tarteaucitron.lang.reload;
							html += '   </button>';
							html += '</div>';
							html += '<div id="tarteaucitronPremium"></div>';

							// create wrapper container
							/*var wrapper = document.createElement('div');
							wrapper.id = "contentWrapper";

							while (document.body.firstChild)
							{
									wrapper.appendChild(document.body.firstChild);
							}

							// Append the wrapper to the body
							document.body.appendChild(wrapper);*/

							div.id = 'tarteaucitronRoot';
							body.appendChild(div, body);
							div.innerHTML = html;
							tarteaucitron.pro('!adblocker=true');
						} else {
							tarteaucitron.pro('!adblocker=false');
						}
					}, 1500);
				}
			});
		});

		if (tarteaucitron.events.load) {
			tarteaucitron.events.load();
		}
	}

	addService(serviceId) {
		var html = '',
			s = tarteaucitron.services,
			service = s[serviceId],
			cookie = tarteaucitron.cookie.read(),
			hostname = document.location.hostname,
			hostRef = document.referrer.split('/')[2],
			isNavigating = (hostRef === hostname && window.location.href !== this.parameters.privacyUrl) ? true : false,
			isAutostart = (!service.needConsent) ? true : false,
			isWaiting = (cookie.indexOf(service.key + '=wait') >= 0) ? true : false,
			isDenied = (cookie.indexOf(service.key + '=false') >= 0) ? true : false,
			isAllowed = (cookie.indexOf(service.key + '=true') >= 0) ? true : false,
			isResponded = (cookie.indexOf(service.key + '=false') >= 0 || cookie.indexOf(service.key + '=true') >= 0) ? true : false,
			isDNTRequested = (navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1" || window.doNotTrack === "1") ? true : false;

		if (tarteaucitron.added[service.key] !== true) {
			tarteaucitron.added[service.key] = true;

			html += '<li id="' + service.key + 'Line" class="tarteaucitronLine">';
			html += '   <div class="tarteaucitronName">';
			html += '       <span class="tarteaucitronH3">' + service.name + '</span>';
			html += '       <span id="tacCL' + service.key + '" class="tarteaucitronListCookies"></span><br/>';
			if (this.parameters.moreInfoLink == true) {
				html += '       <a href="https://opt-out.ferank.eu/service/' + service.key + '/" target="_blank" rel="noopener" title="' + tarteaucitron.lang.cookieDetail + ' ' + service.name + ' ' + tarteaucitron.lang.ourSite + ' ' + tarteaucitron.lang.newWindow + '">';
				html += '           ' + tarteaucitron.lang.more;
				html += '       </a>';
				html += '        - ';
				html += '       <a href="' + service.uri + '" target="_blank" rel="noopener" title="' + service.name + ' ' + tarteaucitron.lang.newWindow + '">';
				html += '           ' + tarteaucitron.lang.source;
				html += '       </a>';
			}
			html += '   </div>';
			html += '   <div class="tarteaucitronAsk">';
			html += '       <button id="' + service.key + 'Allowed" class="tarteaucitronAllow" onclick="tarteaucitron.userInterface.respond(this, true);">';
			html += '           &#10003; ' + tarteaucitron.lang.allow;
			html += '       </button> ';
			html += '       <button id="' + service.key + 'Denied" class="tarteaucitronDeny" onclick="tarteaucitron.userInterface.respond(this, false);">';
			html += '           &#10007; ' + tarteaucitron.lang.deny;
			html += '       </button>';
			html += '   </div>';
			html += '</li>';

			this.ui.css('tarteaucitronServicesTitle_' + service.type, 'display', 'block');

			if (document.getElementById('tarteaucitronServices_' + service.type) !== null) {
				document.getElementById('tarteaucitronServices_' + service.type).innerHTML += html;
			}

			this.ui.order(service.type);
		}

		// allow by default for non EU
		if (isResponded === false && tarteaucitron.user.bypass === true) {
			isAllowed = true;
			tarteaucitron.cookie.create(service.key, true);
		}

		if ((!isResponded && (isAutostart || (isNavigating && isWaiting)) && !this.parameters.highPrivacy) || isAllowed) {
			if (!isAllowed) {
				tarteaucitron.cookie.create(service.key, true);
			}
			if (tarteaucitron.launch[service.key] !== true) {
				tarteaucitron.launch[service.key] = true;
				service.js();
			}
			tarteaucitron.state[service.key] = true;
			this.ui.color(service.key, true);
		} else if (isDenied) {
			if (typeof service.fallback === 'function') {
				service.fallback();
			}
			tarteaucitron.state[service.key] = false;
			this.ui.color(service.key, false);
		} else if (!isResponded && isDNTRequested && this.parameters.handleBrowserDNTRequest) {
			tarteaucitron.cookie.create(service.key, 'false');
			if (typeof service.fallback === 'function') {
				service.fallback();
			}
			tarteaucitron.state[service.key] = false;
			this.ui.color(service.key, false);
		} else if (!isResponded) {
			tarteaucitron.cookie.create(service.key, 'wait');
			if (typeof service.fallback === 'function') {
				service.fallback();
			}
			this.ui.color(service.key, 'wait');
			this.ui.openAlert();
		}

		tarteaucitron.cookie.checkCount(service.key);
	}

	cleanArray(arr) {
		var i,
			len = arr.length,
			out = [],
			obj = {},
			s = tarteaucitron.services;

		for (i = 0; i < len; i += 1) {
			if (!obj[arr[i]]) {
				obj[arr[i]] = {};
				if (tarteaucitron.services[arr[i]] !== undefined) {
					out.push(arr[i]);
				}
			}
		}

		out = out.sort(function (a, b) {
			if (s[a].type + s[a].key > s[b].type + s[b].key) {
				return 1;
			}
			if (s[a].type + s[a].key < s[b].type + s[b].key) {
				return -1;
			}
			return 0;
		});

		return out;
	}


	getLanguage() {
		if (!navigator) {
			return 'en';
		}

		var availableLanguages = 'cs,en,fr,es,it,de,nl,pt,pl,ru,el',
			defaultLanguage = 'en',
			lang = navigator.language || navigator.browserLanguage ||
			navigator.systemLanguage || navigator.userLang || null,
			userLanguage = lang.substr(0, 2);

		if (tarteaucitronForceLanguage !== '') {
			if (availableLanguages.indexOf(tarteaucitronForceLanguage) !== -1) {
				return tarteaucitronForceLanguage;
			}
		}

		if (availableLanguages.indexOf(userLanguage) === -1) {
			return defaultLanguage;
		}
		return userLanguage;
	}

	getLocale() {
		if (!navigator) {
			return 'en_US';
		}

		var lang = navigator.language || navigator.browserLanguage ||
			navigator.systemLanguage || navigator.userLang || null,
			userLanguage = lang.substr(0, 2);

		if (userLanguage === 'fr') {
			return 'fr_FR';
		} else if (userLanguage === 'en') {
			return 'en_US';
		} else if (userLanguage === 'de') {
			return 'de_DE';
		} else if (userLanguage === 'es') {
			return 'es_ES';
		} else if (userLanguage === 'it') {
			return 'it_IT';
		} else if (userLanguage === 'pt') {
			return 'pt_PT';
		} else if (userLanguage === 'nl') {
			return 'nl_NL';
		} else if (userLanguage === 'el') {
			return 'el_EL';
		} else {
			return 'en_US';
		}
	}

	fallback(matchClass, content, noInner) {
		var elems = document.getElementsByTagName('*'),
			i,
			index = 0;

		for (i in elems) {
			if (elems[i] !== undefined) {
				for (index = 0; index < matchClass.length; index += 1) {
					if ((' ' + elems[i].className + ' ')
						.indexOf(' ' + matchClass[index] + ' ') > -1) {
						if (typeof content === 'function') {
							if (noInner === true) {
								content(elems[i]);
							} else {
								elems[i].innerHTML = content(elems[i]);
							}
						} else {
							elems[i].innerHTML = content;
						}
					}
				}
			}
		}
	}

	engage(id) {
		var html = '',
			r = Math.floor(Math.random() * 100000),
			engage = tarteaucitron.services[id].name + ' ' + tarteaucitron.lang.fallback;

		if (tarteaucitron.lang['engage-' + id] !== undefined) {
			engage = tarteaucitron.lang['engage-' + id];
		}

		html += '<div class="tac_activate">';
		html += '   <div class="tac_float">';
		html += '      ' + engage;
		html += '      <button class="tarteaucitronAllow" id="Eng' + r + 'ed' + id + '" onclick="tarteaucitron.userInterface.respond(this, true);">';
		html += '          &#10003; ' + tarteaucitron.lang.allow;
		html += '       </button>';
		html += '   </div>';
		html += '</div>';

		return html;
	}

	extend(a, b) {
		var prop;
		for (prop in b) {
			if (b.hasOwnProperty(prop)) {
				a[prop] = b[prop];
			}
		}
	}

	proTimer() {
		setTimeout(tarteaucitron.proPing, 1000);
	}

	pro(list) {
		tarteaucitron.proTemp += list;
		clearTimeout(tarteaucitron.proTimer);
		tarteaucitron.proTimer = setTimeout(tarteaucitron.proPing, 2500);
	}

	proPing() {
		if (tarteaucitron.uuid !== '' && tarteaucitron.uuid !== undefined && tarteaucitron.proTemp !== '') {
			var div = document.getElementById('tarteaucitronPremium'),
				timestamp = new Date().getTime(),
				url = '//opt-out.ferank.eu/premium.php?';

			if (div === null) {
				return;
			}

			url += 'domain=' + tarteaucitron.domain + '&';
			url += 'uuid=' + tarteaucitron.uuid + '&';
			url += 'c=' + encodeURIComponent(tarteaucitron.proTemp) + '&';
			url += '_' + timestamp;

			div.innerHTML = '<img src="' + url + '" style="display:none" />';

			tarteaucitron.proTemp = '';
		}

		tarteaucitron.cookie.number();
	}

	AddOrUpdate(source, custom) {
		/**
		 Utility function to Add or update the fields of obj1 with the ones in obj2
		*/
		for (key in custom) {
			if (custom[key] instanceof Object) {
				source[key] = tarteaucitron.AddOrUpdate(source[key], custom[key]);
			} else {
				source[key] = custom[key];
			}
		}
		return source;
	}

	getElemWidth(elem) {
		return elem.getAttribute('width') || elem.clientWidth;
	}

	getElemHeight(elem) {
		return elem.getAttribute('height') || elem.clientHeight;
	}
}


module.exports = function( params ) {
	return new Tarteaucitron( params );
}
