export default class UserInterface {
	constructor () {

	}
	
	css (id, property, value) {
		if (document.getElementById(id) !== null) {
			document.getElementById(id).style[property] = value;
		}
	}

	respondAll (status) {
		var s = tarteaucitron.services,
				service,
				key,
				index = 0;

		for (index = 0; index < tarteaucitron.job.length; index += 1) {
				service = s[tarteaucitron.job[index]];
				key = service.key;
				if (tarteaucitron.state[key] !== status) {
						if (status === false && tarteaucitron.launch[key] === true) {
								tarteaucitron.reloadThePage = true;
						}
						if (tarteaucitron.launch[key] !== true && status === true) {
								tarteaucitron.launch[key] = true;
								tarteaucitron.services[key].js();
						}
						tarteaucitron.state[key] = status;
						tarteaucitron.cookie.create(key, status);
						tarteaucitron.userInterface.color(key, status);
				}
		}
	}

	respond (el, status) {
		var key = el.id.replace(new RegExp("(Eng[0-9]+|Allow|Deni)ed", "g"), '');

		// return if same state
		if (tarteaucitron.state[key] === status) {
				return;
		}

		if (status === false && tarteaucitron.launch[key] === true) {
				tarteaucitron.reloadThePage = true;
		}

		// if not already launched... launch the service
		if (status === true) {
				if (tarteaucitron.launch[key] !== true) {
						tarteaucitron.launch[key] = true;
						tarteaucitron.services[key].js();
				}
		}
		tarteaucitron.state[key] = status;
		tarteaucitron.cookie.create(key, status);
		tarteaucitron.userInterface.color(key, status);
	}

	color (key, status) {
			var gray = '#808080',
					greenDark = '#1B870B',
					greenLight = '#E6FFE2',
					redDark = '#9C1A1A',
					redLight = '#FFE2E2',
					yellowDark = '#FBDA26',
					c = 'tarteaucitron',
					nbDenied = 0,
					nbPending = 0,
					nbAllowed = 0,
					sum = tarteaucitron.job.length,
					index;

			if (status === true) {
					tarteaucitron.userInterface.css(key + 'Line', 'borderLeft', '5px solid ' + greenDark);
					tarteaucitron.userInterface.css(key + 'Allowed', 'backgroundColor', greenDark);
					tarteaucitron.userInterface.css(key + 'Denied', 'backgroundColor', gray);

					document.getElementById(key + 'Line').classList.add('tarteaucitronIsAllowed');
					document.getElementById(key + 'Line').classList.remove('tarteaucitronIsDenied');
			} else if (status === false) {
					tarteaucitron.userInterface.css(key + 'Line', 'borderLeft', '5px solid ' + redDark);
					tarteaucitron.userInterface.css(key + 'Allowed', 'backgroundColor', gray);
					tarteaucitron.userInterface.css(key + 'Denied', 'backgroundColor', redDark);

					document.getElementById(key + 'Line').classList.remove('tarteaucitronIsAllowed');
					document.getElementById(key + 'Line').classList.add('tarteaucitronIsDenied');
			}

			// check if all services are allowed
			for (index = 0; index < sum; index += 1) {
					if (tarteaucitron.state[tarteaucitron.job[index]] === false) {
							nbDenied += 1;
					} else if (tarteaucitron.state[tarteaucitron.job[index]] === undefined) {
							nbPending += 1;
					} else if (tarteaucitron.state[tarteaucitron.job[index]] === true) {
							nbAllowed += 1;
					}
			}

			tarteaucitron.userInterface.css(c + 'DotGreen', 'width', ((100 / sum) * nbAllowed) + '%');
			tarteaucitron.userInterface.css(c + 'DotYellow', 'width', ((100 / sum) * nbPending) + '%');
			tarteaucitron.userInterface.css(c + 'DotRed', 'width', ((100 / sum) * nbDenied) + '%');

			if (nbDenied === 0 && nbPending === 0) {
					tarteaucitron.userInterface.css(c + 'AllAllowed', 'backgroundColor', greenDark);
					tarteaucitron.userInterface.css(c + 'AllDenied', 'opacity', '0.4');
					tarteaucitron.userInterface.css(c + 'AllAllowed', 'opacity', '1');
			} else if (nbAllowed === 0 && nbPending === 0) {
					tarteaucitron.userInterface.css(c + 'AllAllowed', 'opacity', '0.4');
					tarteaucitron.userInterface.css(c + 'AllDenied', 'opacity', '1');
					tarteaucitron.userInterface.css(c + 'AllDenied', 'backgroundColor', redDark);
			} else {
					tarteaucitron.userInterface.css(c + 'AllAllowed', 'opacity', '0.4');
					tarteaucitron.userInterface.css(c + 'AllDenied', 'opacity', '0.4');
			}

			// close the alert if all service have been reviewed
			if (nbPending === 0) {
					tarteaucitron.userInterface.closeAlert();
			}

			if (tarteaucitron.services[key].cookies.length > 0 && status === false) {
					tarteaucitron.cookie.purge(tarteaucitron.services[key].cookies);
			}

			if (status === true) {
					if (document.getElementById('tacCL' + key) !== null) {
							document.getElementById('tacCL' + key).innerHTML = '...';
					}
					setTimeout(function () {
							tarteaucitron.cookie.checkCount(key);
					}, 2500);
			} else {
					tarteaucitron.cookie.checkCount(key);
			}
	}

	openPanel () {

		tarteaucitron.userInterface.css('tarteaucitron', 'display', 'block');
		tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block');
		tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'display', 'none');

		document.getElementById('tarteaucitronClosePanel').focus();
		//document.getElementById('contentWrapper').setAttribute("aria-hidden", "true");
		document.getElementsByTagName('body')[0].classList.add('modal-open');
		tarteaucitron.userInterface.focusTrap();
		tarteaucitron.userInterface.jsSizing('main');
	}

	closePanel () {
		if (document.location.hash === tarteaucitron.hashtag) {
				document.location.hash = '';
		}
		tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
		tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'display', 'none');

		tarteaucitron.fallback(['tarteaucitronInfoBox'], function (elem) {
				elem.style.display = 'none';
		}, true);

		if (tarteaucitron.reloadThePage === true) {
				window.location.reload();
		} else {
				tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none');
		}
		if (document.getElementById('tarteaucitronCloseAlert') !== null) {
				document.getElementById('tarteaucitronCloseAlert').focus();
		}
		//document.getElementById('contentWrapper').setAttribute("aria-hidden", "false");
		document.getElementsByTagName('body')[0].classList.remove('modal-open');

	}

	focusTrap () {
		var focusableEls,
				firstFocusableEl,
				lastFocusableEl,
				filtered;

		focusableEls = document.getElementById('tarteaucitron').querySelectorAll('a[href], button');
		filtered = [];

		// get only visible items
		for (var i = 0, max = focusableEls.length; i < max; i++) {
				if (focusableEls[i].offsetHeight > 0) {
				filtered.push(focusableEls[i]);
				}
		}

		firstFocusableEl = filtered[0];
		lastFocusableEl = filtered[filtered.length - 1];

		//loop focus inside tarteaucitron
		document.getElementById('tarteaucitron').addEventListener("keydown", function (evt) {

				if ( evt.key === 'Tab' || evt.keyCode === 9 ) {

						if ( evt.shiftKey ) /* shift + tab */ {
								if (document.activeElement === firstFocusableEl) {
										lastFocusableEl.focus();
										evt.preventDefault();
								}
						} else /* tab */ {
								if (document.activeElement === lastFocusableEl) {
										firstFocusableEl.focus();
										evt.preventDefault();
								}
						}
				}
		})
	}

	openAlert () {
			var c = 'tarteaucitron';
			tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'block');
			tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'none');
			tarteaucitron.userInterface.css(c + 'AlertBig',   'display', 'block');
	}

	closeAlert () {
			var c = 'tarteaucitron';
			tarteaucitron.userInterface.css(c + 'Percentage', 'display', 'none');
			tarteaucitron.userInterface.css(c + 'AlertSmall', 'display', 'block');
			tarteaucitron.userInterface.css(c + 'AlertBig',   'display', 'none');
			tarteaucitron.userInterface.jsSizing('box');
	}

	toggleCookiesList () {
			var div = document.getElementById('tarteaucitronCookiesListContainer');

			if (div === null) {
					return;
			}

			if (div.style.display !== 'block') {
					tarteaucitron.cookie.number();
					div.style.display = 'block';
					tarteaucitron.userInterface.jsSizing('cookie');
					tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
					tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'block');
					tarteaucitron.fallback(['tarteaucitronInfoBox'], function (elem) {
							elem.style.display = 'none';
					}, true);
			} else {
					div.style.display = 'none';
					tarteaucitron.userInterface.css('tarteaucitron', 'display', 'none');
					tarteaucitron.userInterface.css('tarteaucitronBack', 'display', 'none');
			}
	}

	toggle (id, closeClass) {
			var div = document.getElementById(id);

			if (div === null) {
					return;
			}

			if (closeClass !== undefined) {
					tarteaucitron.fallback([closeClass], function (elem) {
							if (elem.id !== id) {
									elem.style.display = 'none';
							}
					}, true);
			}

			if (div.style.display !== 'block') {
					div.style.display = 'block';
			} else {
					div.style.display = 'none';
			}
	}

	order (id) {
			var main = document.getElementById('tarteaucitronServices_' + id),
					allDivs,
					store = [],
					i;

			if (main === null) {
					return;
			}

			allDivs = main.childNodes;

			if (typeof Array.prototype.map === 'function') {
					Array.prototype.map.call(main.children, Object).sort(function (a, b) {
					//var mainChildren = Array.from(main.children);
					//mainChildren.sort(function (a, b) {
							if (tarteaucitron.services[a.id.replace(/Line/g, '')].name > tarteaucitron.services[b.id.replace(/Line/g, '')].name) { return 1; }
							if (tarteaucitron.services[a.id.replace(/Line/g, '')].name < tarteaucitron.services[b.id.replace(/Line/g, '')].name) { return -1; }
							return 0;
					}).forEach(function (element) {
							main.appendChild(element);
					});
			}
	}

	jsSizing (type) {
			var scrollbarMarginRight = 10,
					scrollbarWidthParent,
					scrollbarWidthChild,
					servicesHeight,
					e = window,
					a = 'inner',
					windowInnerHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
					mainTop,
					mainHeight,
					closeButtonHeight,
					headerHeight,
					cookiesListHeight,
					cookiesCloseHeight,
					cookiesTitleHeight,
					paddingBox,
					alertSmallHeight,
					cookiesNumberHeight;

			if (type === 'box') {
					if (document.getElementById('tarteaucitronAlertSmall') !== null && document.getElementById('tarteaucitronCookiesNumber') !== null) {

							// reset
							tarteaucitron.userInterface.css('tarteaucitronCookiesNumber', 'padding', '0px 10px');

							// calculate
							alertSmallHeight = document.getElementById('tarteaucitronAlertSmall').offsetHeight;
							cookiesNumberHeight = document.getElementById('tarteaucitronCookiesNumber').offsetHeight;
							paddingBox = (alertSmallHeight - cookiesNumberHeight) / 2;

							// apply
							tarteaucitron.userInterface.css('tarteaucitronCookiesNumber', 'padding', paddingBox + 'px 10px');
					}
			} else if (type === 'main') {

					// get the real window width for media query
					if (window.innerWidth === undefined) {
							a = 'client';
							e = document.documentElement || document.body;
					}

					// height of the services list container
					if (document.getElementById('tarteaucitron') !== null && document.getElementById('tarteaucitronClosePanel') !== null && document.getElementById('tarteaucitronMainLineOffset') !== null) {

							// reset
							tarteaucitron.userInterface.css('tarteaucitronServices', 'height', 'auto');

							// calculate
							mainHeight = document.getElementById('tarteaucitron').offsetHeight;
							closeButtonHeight = document.getElementById('tarteaucitronClosePanel').offsetHeight;

							// apply
							servicesHeight = (mainHeight - closeButtonHeight + 2);
							tarteaucitron.userInterface.css('tarteaucitronServices', 'height', servicesHeight + 'px');
							tarteaucitron.userInterface.css('tarteaucitronServices', 'overflow-x', 'auto');
					}

					// align the main allow/deny button depending on scrollbar width
					if (document.getElementById('tarteaucitronServices') !== null && document.getElementById('tarteaucitronScrollbarChild') !== null) {

							// media query
							if (e[a + 'Width'] <= 479) {
									tarteaucitron.userInterface.css('tarteaucitronScrollbarAdjust', 'marginLeft', '11px');
							} else if (e[a + 'Width'] <= 767) {
									scrollbarMarginRight = 12;
							}

							scrollbarWidthParent = document.getElementById('tarteaucitronServices').offsetWidth;
							scrollbarWidthChild = document.getElementById('tarteaucitronScrollbarChild').offsetWidth;
							tarteaucitron.userInterface.css('tarteaucitronScrollbarAdjust', 'marginRight', ((scrollbarWidthParent - scrollbarWidthChild) + scrollbarMarginRight) + 'px');
					}

					// center the main panel
					if (document.getElementById('tarteaucitron') !== null) {

							// media query
							if (e[a + 'Width'] <= 767) {
									mainTop = 0;
							} else {
									mainTop = ((windowInnerHeight - document.getElementById('tarteaucitron').offsetHeight) / 2) - 21;
							}

							// correct
							if (mainTop < 0) {
									mainTop = 0;
							}

							if (document.getElementById('tarteaucitronMainLineOffset') !== null) {
									if (document.getElementById('tarteaucitron').offsetHeight < (windowInnerHeight / 2)) {
											mainTop -= document.getElementById('tarteaucitronMainLineOffset').offsetHeight;
									}
							}

							// apply
							tarteaucitron.userInterface.css('tarteaucitron', 'top', mainTop + 'px');
					}


			} else if (type === 'cookie') {

					// put cookies list at bottom
					if (document.getElementById('tarteaucitronAlertSmall') !== null) {
							tarteaucitron.userInterface.css('tarteaucitronCookiesListContainer', 'bottom', (document.getElementById('tarteaucitronAlertSmall').offsetHeight) + 'px');
					}

					// height of cookies list
					if (document.getElementById('tarteaucitronCookiesListContainer') !== null) {

							// reset
							tarteaucitron.userInterface.css('tarteaucitronCookiesList', 'height', 'auto');

							// calculate
							cookiesListHeight = document.getElementById('tarteaucitronCookiesListContainer').offsetHeight;
							cookiesCloseHeight = document.getElementById('tarteaucitronClosePanelCookie').offsetHeight;
							cookiesTitleHeight = document.getElementById('tarteaucitronCookiesTitle').offsetHeight;

							// apply
							tarteaucitron.userInterface.css('tarteaucitronCookiesList', 'height', (cookiesListHeight - cookiesCloseHeight - cookiesTitleHeight - 2) + 'px');
					}
			}
	}
}
