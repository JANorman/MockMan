var _ = require('underscore');

var mockman = {
	mocks: {},

	instance: function(module_name) {
		var new_mock = MockMan_AssertionBuilder;
		this.mocks[module_name] = new_mock;
		return new_mock;
	},

	literal: function(module_name) {
		var new_mock = new MockMan_AssertionBuilder();
		new_mock.setName(module_name);
		return new_mock;
	},

	mock: function() {
		return mockman;
	},

	close: function() {
		for(var test in this.mocks) {
			var mocked_methods = this.mocks[test].__getMethods();
			for (var method in mocked_methods) {
				var method_name = mocked_methods[method];
				var expected = this.mocks[test].__getExpectedCallCount(method_name);
				var actual = this.mocks[test].__getActualCallCount(method_name);

				// If expected is false, we shouln't check the number of method calls
				if(expected >= 0 && expected !== actual) {
					throw new Error('Expected ' + test + '::' + method_name + '() to be called ' + expected + ' time(s), but called ' + actual + ' time(s)');
				}
			};	
		}
	}
};

var MockMan_AssertionBuilder = function() {
	// Used for defining current data
	var  current_method,
         current_call_count = 0,
         current_return = null,
         mock_name = '';

    var expectations = {};

    var saveExpectation = function() {
    	var expects = {
    		returns: current_return,
    		expected: {
    			'calls': current_call_count	
    		},
    		actual: {
    			'calls': 0
    		}
    	};
    	expectations[current_method] = expects;
    };

    var refreshExpectation = function() {
    	current_method = undefined;
    	current_call_count = 0;
    	current_return = 0;
    };

    var addDynamicMethod = function(method, return_value) {
    	returnObject[method] = function() {
    		expectations[method].actual.calls += 1;
    		return return_value;
    	}
    };

    var incrementCallCount = function(method) {
    	if(expectations[method]) {
    		expectations[method].actual.calls += 1;
    	}
    }

	var returnObject = {
		mname: '',
		setName: function(name) {
			this.mname = name;
		},

		shouldReceive: function(name) {
			refreshExpectation();
			current_method = name;
			saveExpectation();
			return this.times('any');
		},

		once: function() {
			return this.times(1);
		},

		twice: function() {
			return this.times(2);
		},

		any: function() {
			return this.times(-1);
		},

		times: function(number) {
			current_call_count = number;
			saveExpectation();
			return this;
		},

		willReturn: function(value) {
			current_return = value;
			saveExpectation();
			return this;
		},

		getExpectations: function() {
			return expectations;
		},

		getMock: function() {
			// Start to build the mock object
			var obj = {
				__calls: {},
				__getMethods: function() {
					return _.keys(this.__calls);
				},
				__getActualCallCount: function(name) {
					if(!this.__calls[name]) return 0;
					return this.__calls[name].actual || 0;
				},
				__getExpectedCallCount: function(name) {
					if(!this.__calls[name]) return 0;
					return this.__calls[name].expected || 0;
				},
				__createMethod: function(name, expected_calls, returns) {
					this.__calls[name] = {};
					this.__calls[name].expected = expected_calls;
					this.__calls[name].actual = 0;

					this[name] = function() {
						this.__calls[name].actual++;
						return returns;
					}
				}
			};

			for(var method in expectations) {
				var method_exp = expectations[method];
				obj.__createMethod(method, method_exp.expected.calls, method_exp.returns);
			}
			mockman.mocks[this.mname] = obj;
			return obj;
		}
	};

	return returnObject;
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