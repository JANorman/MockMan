var MockMan_AssertionBuilder = require('./assertionbuilder'),
    MockMan_MockRegistry = require('./mockregistry'),
    _ = require('underscore');

var mockman = {
	mocks: {},

	/**
	 * Sets up an instance
	 * @param  {string} module_name    Unique name for module
	 * @return {AssertionBuilder}      Assertion builder
	 * @todo   Actually do this...
	 */
	instance: function(module_name) {
		var mock = new MockMan_AssertionBuilder('function');
		mock.setName(module_name);
		return mock;
	},

	/**
	 * Sets up a literal instance
	 * @param  {string} module_name Unique name for module
	 * @return {AssertionBuilder}             [description]
	 */
	literal: function(module_name) {
		var mock = new MockMan_AssertionBuilder('literal');
		mock.setName(module_name);
		return mock;
	},

	/**
	 * Runs the assertions setup on the different mocks
	 */
	close: function() {
		registry = MockMan_MockRegistry.getMocks();
		for(var test in registry) {
			var mocked_methods = registry[test].__getMethods();
			for (var method in mocked_methods) {
				var method_name = mocked_methods[method];
				var expected = registry[test].__getExpectedCallCount(method_name);
				var actual = registry[test].__getActualCallCount(method_name);

				// If expected is false, we shouln't check the number of method calls
				if(expected >= 0 && expected !== actual) {
					throw new Error('Expected ' + test + '::' + method_name + '() to be called ' + expected + ' time(s), but called ' + actual + ' time(s)');
				}
			};	
		}
		MockMan_MockRegistry.clearMocks();
	}
};

var MockMan_AssertionTester = function(expectations) {
	for(var method_expectation in expectations) {
		if(expectations.hasOwnProperty(method_expectation)) {
			var method = method_expectation;
			var expectation = expectations[method_expectation];

			// Test for number of times the method was called
			if(expectation.expected.calls !== expectation.actual.calls) {
				throw exception('Method "' + method + '" was expected to be called ' 
					+ expectation.expected.calls + ' times, but actually called ' 
					+ expectation.actual.calls + ' times')
			}
		}
	}
}

var exception = function(message) {
	return new Error('MockMan: ' + message);
}

module.exports = mockman;