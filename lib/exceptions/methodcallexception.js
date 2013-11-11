module.exports = {
	getException: function(mod, method, expected, actual) {
		return new Error(
			'Expected ' + mod + '::' + method + '() to be called ' + expected + ' time(s), but called ' + actual + ' time(s)'
		);
	}
};