module.exports = {
	getException: function(mod, method, expected, actual) {
		var message = 'Expected ' + mod + '::' + method + '() to be called ' + expected + ' time(s), but ';
		if(actual == 0) {
			message += 'it was never called.';
		} else if(actual == 1) {
			message += 'actually called once.';
		} else {
			message += 'it was called ' + actual + ' times';
		}
		return new Error(message);
	}
};