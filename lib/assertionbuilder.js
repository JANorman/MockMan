var MockMan_MockRegistry = require('./mockregistry'),
    _ = require('underscore');

module.exports = function(type) {
		 // Current method defining the calls on
		 var  current_method,
		 // Current call count expectation
         current_call_count = 0,
         // Current return value
         current_return = null,
         // Name of the mocked method
         mock_name = '',
         // Callback information
         callback_info = {
         	enabled: false,
         	argument_number: 0,
         	func_params: null
         };

    // Expectations object
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
    		},
    		callback: {
    			enabled: callback_info.enabled,
    			arg: callback_info.argument_number,
    			func_params: callback_info.func_params
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

		willExecuteCallback: function(arg_number, values) {
			callback_info.enabled = true;
			callback_info.argument_number = arg_number;
			callback_info.func_params = values;
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

				__createMethod: function(name, expected_calls, returns, callback) {
					this.__calls[name] = {};
					this.__calls[name].expected = expected_calls;
					this.__calls[name].actual = 0;
					this.__calls[name].callback = callback;

					this[name] = function() {
						this.__calls[name].actual++;
						if(this.__calls[name].callback.enabled) {
							if(typeof arguments[this.__calls[name].callback.arg] == "function") {
								arguments[this.__calls[name].callback.arg].apply(undefined, this.__calls[name].callback.func_params);
							} else {
								throw new Error('Callback is not a function');
							}	
						}
						
						return returns;
					}
				}
			};

			for(var method in expectations) {
				var method_exp = expectations[method];
				obj.__createMethod(method, method_exp.expected.calls, method_exp.returns, method_exp.callback);
			}
		
			MockMan_MockRegistry.addMock(this.mname, obj);
			return function() { return obj; };
		}
	};

	return returnObject;
};