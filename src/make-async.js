class MakeAsync {
	constructor() {
		this.antiGhost = 0;
		this.buffer = '';
	}
	init(url, id) {
		var savedWrite = document.write,
			savedWriteln = document.writeln;

		document.write = function (content) {
			tarteaucitron.makeAsync.buffer += content;
		};
		document.writeln = function (content) {
			tarteaucitron.makeAsync.buffer += content.concat("\n");
		};

		setTimeout(function () {
			document.write = savedWrite;
			document.writeln = savedWriteln;
		}, 20000);

		tarteaucitron.makeAsync.getAndParse(url, id);
	}

	getAndParse(url, id) {
		if (tarteaucitron.makeAsync.antiGhost > 9) {
			tarteaucitron.makeAsync.antiGhost = 0;
			return;
		}
		tarteaucitron.makeAsync.antiGhost += 1;
		tarteaucitron.addScript(url, '', function () {
			if (document.getElementById(id) !== null) {
				document.getElementById(id).innerHTML += "<span style='display:none'>&nbsp;</span>" + tarteaucitron.makeAsync.buffer;
				tarteaucitron.makeAsync.buffer = '';
				tarteaucitron.makeAsync.execJS(id);
			}
		});
	}

	execJS(id) {
		/* not strict because third party scripts may have errors */
		var i,
			scripts,
			childId,
			type;

		if (document.getElementById(id) === null) {
			return;
		}

		scripts = document.getElementById(id).getElementsByTagName('script');
		for (i = 0; i < scripts.length; i += 1) {
			type = (scripts[i].getAttribute('type') !== null) ? scripts[i].getAttribute('type') : '';
			if (type === '') {
				type = (scripts[i].getAttribute('language') !== null) ? scripts[i].getAttribute('language') : '';
			}
			if (scripts[i].getAttribute('src') !== null && scripts[i].getAttribute('src') !== '') {
				childId = id + Math.floor(Math.random() * 99999999999);
				document.getElementById(id).innerHTML += '<div id="' + childId + '"></div>';
				tarteaucitron.makeAsync.getAndParse(scripts[i].getAttribute('src'), childId);
			} else if (type.indexOf('javascript') !== -1 || type === '') {
				eval(scripts[i].innerHTML);
			}
		}
	}
}
