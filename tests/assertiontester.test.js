var mockery = require('mockery');

var assert = require('assert'),
	_ = require('underscore'),
	mockery = require('mockery');

describe('AssertionTester', function() {

	describe('RunAssertions', function() {

		var mockRegistryMock,
			assertionTester,
			data;

		beforeEach(function(done) {
			data = [{
				"data": {
					"save": {
						"expected": 3,
						"actual": 3
					},
					"update": {
						"expected": 2,
						"actual": 2
					}
				},

				"__getMethods": function() {
					return _.keys(this.data);
				},

				"__getExpectedCallCount": function(method_name) {
					return this.data[method_name].expected;
				},

				"__getActualCallCount": function(method_name) {
					return this.data[method_name].actual;
				}
			},
			{
				"data": {
					"run": {
						"expected": 2,
						"actual": 2
					},
					"stop": {
						"expected": 1,
						"actual": 1
					}
				},

				"__getMethods": function() {
					return _.keys(this.data);
				},

				"__getExpectedCallCount": function(method_name) {
					return this.data[method_name].expected;
				},

				"__getActualCallCount": function(method_name) {
					return this.data[method_name].actual;
				}
			}];

			mockRegistryMock = {};
			mockRegistryMock.getMocks = function() {
				return data;
			};

			mockRegistryMock.clearMocks = function() {};
			done();
		});

		it('should not report any exceptions if the methods calls are as expected', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionTester = require('../lib/assertiontester');

			assertionTester.runAssertions();
			done();
		});

		it('should throw exception when method calls do not match', function(done) {
			data[0].data.save.actual = 3;

			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionTester = require('../lib/assertiontester');
			
			assert.throws(assertionTester.runAssertions);	
			done();
		});

	});

});