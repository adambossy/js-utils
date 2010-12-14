// Generally useful Javascript functions, based on jQuery
// author: https://www.github.com/adambossy (Adam Bossy)

// Debugging
(function() {
	$.log = function(message) {
		if (window.console && window.console.debug) {
			console.debug(message);
		} else {
			throw {
				name: 'ConsoleError',
				message: 'Browser does not support window.console'
			};
		}
	};

	$.stacktrace = function(arguments) {
		var stack = (function recurse(callee) {
			return callee.caller && [callee.caller.name].concat(recurse(callee.caller));
		})(arguments.callee);
		return [arguments.callee.name].concat(stack).join('\n');
	};
})(jQuery);

// Common key presses
(function() {
	function keyPress(el, fn, keyCode) {
		return el.keyup(function(event) {
			if ((event.keyCode ? event.keyCode : event.which) == ''+keyCode) {
				fn();
			}
		});
	}

	$.fn.enterkey = function(fn) {
		return keyPress(this, fn, 13);
	};

	$.fn.esckey = function(fn) {
		return keyPress(this, fn, 27);
	};
})(jQuery);

// For general AJAX calls (needs corresponding Python back-end code)
(function($) {
	$.rpc = function(view, argsdict, callback) {
		// This function abstracts away the url to call and error handling
		//
		// json - formatted as:
		//	{ 
		//		'args': [arg1, arg2, ..., argn],
		//		'kwargs': { 'arg1': arg1, 'arg2', arg2, ... }
		//	}
		// shift arguments if argdict argument was omited
		if ( $.isFunction( argsdict ) ) {
			callback = argsdict;
			argsdict = null;
		}

		var defaults = { 
			args: [], 
			kwargs: {} 
		};
		$.extend(defaults, argsdict);

		$.get(
			Topsicle.AJAX,
			{ 
				'view': view,
				'json': JSON.stringify(defaults)
			},
			function(json, textStatus) {
				if (json) {
					if (json.status == 'success') {
						callback(json);
					} else {
						var silent = typeof json.silent != "undefined" && json.silent;
						if (silent) {
							// Fail silently...
						} else {
							alert("Error: " + json.message);
						}
					}
				} else {
					// Internet connection probably lost
				}
			}
		)
	}
})(jQuery);

// Python analogue of key/value funcs for JS objects
(function($) {
	function iterArray(obj, key_or_value_fn) {
		var arr = new Array();
		$.each(obj, function(k, v) {
			if (typeof v != "function") {
				arr.push(key_or_value_fn(k, v));
			}
		});
		return arr;
	}

	$.keys = function(obj) {
		return iterArray(obj, function(k, v) { return k; });
	}

	$.values = function(obj) {
		return iterArray(obj, function(k, v) { return v; });
	}
})(jQuery);
