/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
	var UNSENT = 0,
		OPENED = 1,
		HEADERS_RECEIVED = 2,
		LOADING = 3,
		DONE = 4;
	XMLHttpRequest = function() {
		Util.apply(this, {
			// private
			readyState: UNSENT,
			headers: {},
			responseHeaders: {},
			errorFlag: 0,
			// public
			status: 0,
			method: 'GET',
			url: '',
			username: undefined,
			password: undefined,
			onreadystatechange: function() {},
			statusText: '',
			responseText: null
		});
		return this;
	};
	Util.apply(XMLHttpRequest.prototype, {
		open: function(method, url, async, username, password) {
			Util.apply(this, {
				method: method,
				url: url,
				username: username,
				password: password,
				readyState: OPENED,
				status: 0,
				statusText: ''
			});
		},
		setRequestHeader: function(header, value) {
			this.headers[header] = value;
		},
		send: function(data) {
			log('send');
			var o = xhrHelper.request({
				method: this.method,
				username: this.username,
				password: this.password,
				url: this.url,
				data: data
			});
			if (Util.isString(o)) {
				throw o;
			}
			this.responseText = o.responseText;
			this.status = o.status;
			this.readyState = DONE;
			this.onreadystatechange();
		},
		abort: function() {

		},
		getResponseHeader: function(header) {
			var lcHeader = header.toLowerCase();
			if (this.readyState == UNSENT || this.readyState == OPENED || this.errorFlag || lcHeader === 'set-cookie' || lcHeader === 'set-cookie2') {
				return null;
			}
			return this.responseHeaders[header] || null;
		},
		getAllResponseHeaders: function() {
			var headers = [];
			forEach(responseHeaders, function(value, key) {
				headers.push(key + ': ' + value);
			});
			return headers.join('\r\n');
		}
	});
}());
