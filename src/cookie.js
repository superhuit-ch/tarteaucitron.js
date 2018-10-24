class Cookie {

	constructor() {
		this.owner = {};
	}

	create(key, status) {

		if (tarteaucitronForceExpire !== '') {
			// The number of day cann't be higher than 1 year
			timeExipre = (tarteaucitronForceExpire > 365) ? 31536000000 : tarteaucitronForceExpire * 86400000; // Multiplication to tranform the number of days to milliseconds
		}

		var d = new Date(),
			time = d.getTime(),
			expireTime = time + timeExipre, // 365 days
			regex = new RegExp("!" + key + "=(wait|true|false)", "g"),
			cookie = tarteaucitron.cookie.read().replace(regex, ""),
			value = tarteaucitron.parameters.cookieName + '=' + cookie + '!' + key + '=' + status,
			domain = (tarteaucitron.parameters.cookieDomain !== undefined && tarteaucitron.parameters.cookieDomain !== '') ? 'domain=' + tarteaucitron.parameters.cookieDomain + ';' : '';

		if (tarteaucitron.cookie.read().indexOf(key + '=' + status) === -1) {
			tarteaucitron.pro('!' + key + '=' + status);
		}

		d.setTime(expireTime);
		document.cookie = value + '; expires=' + d.toGMTString() + '; path=/;' + domain;
	}

	read() {
		var nameEQ = tarteaucitron.parameters.cookieName + "=",
			ca = document.cookie.split(';'),
			i,
			c;

		for (i = 0; i < ca.length; i += 1) {
			c = ca[i];
			while (c.charAt(0) === ' ') {
				c = c.substring(1, c.length);
			}
			if (c.indexOf(nameEQ) === 0) {
				return c.substring(nameEQ.length, c.length);
			}
		}
		return '';
	}

	purge(arr) {
		var i;

		for (i = 0; i < arr.length; i += 1) {
			document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/;';
			document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname + ';';
			document.cookie = arr[i] + '=; expires=Thu, 01 Jan 2000 00:00:00 GMT; path=/; domain=.' + location.hostname.split('.').slice(-2).join('.') + ';';
		}
	}

	checkCount(key) {
		var arr = tarteaucitron.services[key].cookies,
			nb = arr.length,
			nbCurrent = 0,
			html = '',
			i,
			status = document.cookie.indexOf(key + '=true');

		if (status >= 0 && nb === 0) {
			html += tarteaucitron.lang.useNoCookie;
		} else if (status >= 0) {
			for (i = 0; i < nb; i += 1) {
				if (document.cookie.indexOf(arr[i] + '=') !== -1) {
					nbCurrent += 1;
					if (tarteaucitron.cookie.owner[arr[i]] === undefined) {
						tarteaucitron.cookie.owner[arr[i]] = [];
					}
					if (tarteaucitron.cookie.crossIndexOf(tarteaucitron.cookie.owner[arr[i]], tarteaucitron.services[key].name) === false) {
						tarteaucitron.cookie.owner[arr[i]].push(tarteaucitron.services[key].name);
					}
				}
			}

			if (nbCurrent > 0) {
				html += tarteaucitron.lang.useCookieCurrent + ' ' + nbCurrent + ' cookie';
				if (nbCurrent > 1) {
					html += 's';
				}
				html += '.';
			} else {
				html += tarteaucitron.lang.useNoCookie;
			}
		} else if (nb === 0) {
			html = tarteaucitron.lang.noCookie;
		} else {
			html += tarteaucitron.lang.useCookie + ' ' + nb + ' cookie';
			if (nb > 1) {
				html += 's';
			}
			html += '.';
		}

		if (document.getElementById('tacCL' + key) !== null) {
			document.getElementById('tacCL' + key).innerHTML = html;
		}
	}

	crossIndexOf(arr, match) {
		var i;
		for (i = 0; i < arr.length; i += 1) {
			if (arr[i] === match) {
				return true;
			}
		}
		return false;
	}

	number() {
		var cookies = document.cookie.split(';'),
			nb = (document.cookie !== '') ? cookies.length : 0,
			html = '',
			i,
			name,
			namea,
			nameb,
			c,
			d,
			s = (nb > 1) ? 's' : '',
			savedname,
			regex = /^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i,
			regexedDomain = (tarteaucitron.cdn.match(regex) !== null) ? tarteaucitron.cdn.match(regex)[1] : tarteaucitron.cdn,
			host = (tarteaucitron.domain !== undefined) ? tarteaucitron.domain : regexedDomain;

		cookies = cookies.sort(function (a, b) {
			namea = a.split('=', 1).toString().replace(/ /g, '');
			nameb = b.split('=', 1).toString().replace(/ /g, '');
			c = (tarteaucitron.cookie.owner[namea] !== undefined) ? tarteaucitron.cookie.owner[namea] : '0';
			d = (tarteaucitron.cookie.owner[nameb] !== undefined) ? tarteaucitron.cookie.owner[nameb] : '0';
			if (c + a > d + b) {
				return 1;
			}
			if (c + a < d + b) {
				return -1;
			}
			return 0;
		});

		if (document.cookie !== '') {
			for (i = 0; i < nb; i += 1) {
				name = cookies[i].split('=', 1).toString().replace(/ /g, '');
				if (tarteaucitron.cookie.owner[name] !== undefined && tarteaucitron.cookie.owner[name].join(' // ') !== savedname) {
					savedname = tarteaucitron.cookie.owner[name].join(' // ');
					html += '<div class="tarteaucitronHidden">';
					html += '     <span class="tarteaucitronTitle tarteaucitronH3">';
					html += '        ' + tarteaucitron.cookie.owner[name].join(' // ');
					html += '    </span>';
					html += '</div><ul class="cookie-list">';
				} else if (tarteaucitron.cookie.owner[name] === undefined && host !== savedname) {
					savedname = host;
					html += '<div class="tarteaucitronHidden">';
					html += '     <span class="tarteaucitronTitle tarteaucitronH3">';
					html += '        ' + host;
					html += '    </span>';
					html += '</div><ul class="cookie-list">';
				}
				html += '<li class="tarteaucitronCookiesListMain">';
				html += '    <div class="tarteaucitronCookiesListLeft"><button onclick="tarteaucitron.cookie.purge([\'' + cookies[i].split('=', 1) + '\']);tarteaucitron.cookie.number();tarteaucitron.userInterface.jsSizing(\'cookie\');return false"><strong>&times;</strong></button> <strong>' + name + '</strong>';
				html += '    </div>';
				html += '    <div class="tarteaucitronCookiesListRight">' + cookies[i].split('=').slice(1).join('=') + '</div>';
				html += '</li>';
			}
			html += '</ul>';
		} else {
			html += '<div class="tarteaucitronCookiesListMain">';
			html += '    <div class="tarteaucitronCookiesListLeft"><strong>-</strong></div>';
			html += '    <div class="tarteaucitronCookiesListRight"></div>';
			html += '</div>';
		}

		html += '<div class="tarteaucitronHidden" style="height:20px;display:block"></div>';

		if (document.getElementById('tarteaucitronCookiesList') !== null) {
			document.getElementById('tarteaucitronCookiesList').innerHTML = html;
		}

		if (document.getElementById('tarteaucitronCookiesNumber') !== null) {
			document.getElementById('tarteaucitronCookiesNumber').innerHTML = nb;
		}

		if (document.getElementById('tarteaucitronCookiesNumberBis') !== null) {
			document.getElementById('tarteaucitronCookiesNumberBis').innerHTML = nb + ' cookie' + s;
		}

		for (i = 0; i < tarteaucitron.job.length; i += 1) {
			tarteaucitron.cookie.checkCount(tarteaucitron.job[i]);
		}
	}
}
