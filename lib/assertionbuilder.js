var MockMan_MockRegistry = require('./mockregistry'),
    _ = require('underscore');

module.exports = function(type) {
	// Used for defining current data
	var  current_method,
         current_call_count = 0,
         current_return = null,
         mock_name = '';

    var expectations = {};

    if(!type || !_.contains(['literal', 'constructor'], type)) {
    	type = 'literal';
    }

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

		never: function() {
			return this.times(0);
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
		
			MockMan_MockRegistry.addMock(this.mname, obj);
			return function() { return obj; };
		}
	};

	return returnObject;
};