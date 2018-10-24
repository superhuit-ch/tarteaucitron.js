import _addScript from '../add-script.js';

module.exports = class Service {
	
	constructor (key, type, name, uri, needConsent = true, cookies = []) {
		this.key = key;
		this.type = type;
		this.name = name;
		this.uri = uri;
		this.needConsent = needConsent;
		this.cookies = cookies;

		this.addScript = _addScript;
	}

	init () {}
}
