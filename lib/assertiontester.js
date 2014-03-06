var MethodCallException = require('./exceptions/methodcallexception'),
    MockMan_MockRegistry = require('./mockregistry');

module.exports = {
	/**
	 * Runs the assertions on each of the defined mocks.
	 */
	runAssertions: function() {
		// Get the mocks out of the repository
		var registry = this.getMocks();
		for(var test in registry) {
			// Get the specific mock object
			var mocked_methods = registry[test].__getMethods();
			for (var method in mocked_methods) {
				var method_name = mocked_methods[method];
				// Expected method calls
				var expected = registry[test].__getExpectedCallCount(method_name);
				// Actual method calls
				var actual = registry[test].__getActualCallCount(method_name);
				this.testMethodCalls(test, method_name, expected, actual);
			};
		}
		this.clearMocks();
	},

	/**
	 * Tests the number of method calls
	 * @param  {string}  object         Name of object/class being tested
	 * @param  {string}  method         Name of method associated to
	 * @param  {integer} expected_calls Number of calls expected to method
	 * @param  {integer} actual_calls   Actual number of calls
	 */
	testMethodCalls: function(object, method, expected_calls, actual_calls) {
		// If expected is false, we shouln't check the number of method calls
		if(expected_calls >= 0 && expected_calls !== actual_calls) {
			throw MethodCallException.getException(object, method, expected_calls, actual_calls);
		}
	},

	/**
	 * Returns the mock in the respository
	 * @return {array} Array of mocks
	 */
	getMocks: function() {
		return MockMan_MockRegistry.getMocks();
	}, 

	/**
	 * Clears the mocks in the repository
	 */
	clearMocks: function() {
		MockMan_MockRegistry.clearMocks();
	}
}