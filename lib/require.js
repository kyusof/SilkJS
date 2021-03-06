/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

include('lib/print_r.js')
(function() {
	var fs = builtin.fs;
	var v8 = builtin.v8;
	function runScript(src) {
		var script = v8.compileScript(src);
		var exports = v8.runScript(script);
		v8.freeScript(script);
		return exports;
	}
	function locateFile(module) {
		if (module.substr(0,1) == '/' || module.substr(0,2) == './' || module.substr(0,3) == '../') {
			if (fs.isFile(module)) {
				return module;
				if (fs.isFile(module + '.js')) {
					return module + '.js';
				}
			}
		}
		else {
			var paths = require.path;
			for (var i=0, len=paths.length; i<len; i++) {
				var path = paths[i];
				if (path.substr(path.length-1, 1) != '/') {
					path += '/';
				}
				path += module;
				if (fs.isFile(path)) {
					return path;
				}
				if (fs.isFile(path + '.js')) {
					return path + '.js';
				}
			}
		}
		throw 'Could not locate require file ' + module;
	}
	require = function(module) {
		if (module.substr(0, 8) == 'builtin/') {
			var m = builtin[module.substr(8)];
			return m;
		}
		var modulePath = locateFile(module);
		if (require.cache[modulePath]) {
			return require.cache[modulePath];
		}
		var script = [
			'(function() {',
			'	var module = {',
			'		id: "' + module + '",',
			'		exports: {}',
			'	},',
			'	exports = module.exports;',
			fs.readFile(modulePath),
			'	return exports;',
			'}())'
		].join('\n');
		require.cache[modulePath] = runScript(script);
		return require.cache[modulePath];
	};

	require.cache = {};
	require.path = [
		'modules',
		'/usr/share/silkjs/modules'
	];
}());
