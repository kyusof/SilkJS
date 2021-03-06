/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Json = function() {
	return {
		encode: function(o) {
			return JSON.stringify(o);
		},
		decode: function(s) {
			return JSON.parse(s);
		},
		success: function(o) {
			o = o || {};
			o.success = true;
			res.write(Json.encode(o));
			res.stop();
		},
		failure: function(msg) {
			res.write(Json.encode({
				success: false,
				message: msg
			}));
			res.stop();
		},
		exception: function(msg) {
			res.write(Json.encode({
				success: false,
				exception: msg
			}));
			res.stop();
		}
	}
}();

