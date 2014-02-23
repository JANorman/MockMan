var assert = require('assert'),
	_ = require('underscore'),
	mockery = require('mockery');

describe('MockMan', function() {

	var mockman, 
		mock_builder = function(name) {
			var type = name,
				mock_name;
			
			var instance = {};
			instance.getMockType = function() {
				return type;
			}

			instance.setName = function(name) {
				mock_name = name;
			}

			instance.getName = function() {
				return mock_name;
			}

			return instance;
		},

		mock_assertion_tester = {
			callCount: 0, 

			runAssertions: function() {
				this.callCount++;
			},
		};

	beforeEach(function(done) {
		mockery.registerMock('./assertionbuilder', mock_builder);
		mockery.registerMock('./assertiontester', mock_assertion_tester);
		mockery.enable({
		    warnOnReplace: false,
		    warnOnUnregistered: false
		});
		mockman = require('../lib/mockman');
		done();
	});

	it('Instance should return instance', function(done) {
		var result = mockman.instance('module_mock');
		assert.equal('module_mock', result.getName());
		done();
	});

	it('Literal should return literal', function(done) {
		var result = mockman.instance('module_mock');
		assert.equal('module_mock', result.getName());
		done();
	});

	it('close should run the assertions', function(done) {
		mockman.close();
		assert.equal(1, mock_assertion_tester.callCount);
		done();
	});
});
