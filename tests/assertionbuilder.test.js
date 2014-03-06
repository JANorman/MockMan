var mockery = require('mockery');

var assert = require('assert'),
	_ = require('underscore'),
	mockery = require('mockery');

describe('AssertionTester', function() {

	describe('RunAssertions', function() {

		var mockRegistryMock,
			assertionBuilder,
			Builder;

		beforeEach(function(done) {
			mockRegistryMock = {
				mocks: []
			};
			mockRegistryMock.addMock = function(mock) {
				this.mocks.push(mock);
			};
			done();
		});

		it('using once() should report correct call count', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').once().willReturn('return-string');

			var result = Builder.getMock();
			result = new result();
			assert.equal(result.__getActualCallCount('method1'), 0);
			assert.equal(result.__getExpectedCallCount('method1'), 1);
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.__getActualCallCount('method1'), 1);
			done();
		});

		it('using twice() should report correct call count', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').twice().willReturn('return-string');

			var result = Builder.getMock();
			result = new result();
			assert.equal(result.__getActualCallCount('method1'), 0);
			assert.equal(result.__getExpectedCallCount('method1'), 2);
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.__getActualCallCount('method1'), 2);
			done();
		});

		it('using any() should report correct call count', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').any().willReturn('return-string');

			var result = Builder.getMock();
			result = new result();
			assert.equal(result.__getActualCallCount('method1'), 0);
			assert.equal(result.__getExpectedCallCount('method1'), -1);
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.__getActualCallCount('method1'), 3);
			done();
		});

		it('using times(x) should report correct call count', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').times(3).willReturn('return-string');

			var result = Builder.getMock();
			result = new result();
			assert.equal(result.__getActualCallCount('method1'), 0);
			assert.equal(result.__getExpectedCallCount('method1'), 3);
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.method1(), 'return-string');
			assert.equal(result.__getActualCallCount('method1'), 2);
			done();
		});

		it('using willExecuteCallback() correctly call callback', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').once().willExecuteCallback(0, [null, true]);

			var result = Builder.getMock();
			result = new result();
			result.method1(function(val1, val2) {
				assert.equal(val1, null);
				assert.equal(val2, true);
				done();
			});
		});

		it('using willExecuteCallback() on another parametercorrectly call callback', function(done) {
			mockery.registerMock('./mockregistry', mockRegistryMock);
			mockery.enable({
			    warnOnUnregistered: false,
			    warnOnReplace: false
			});
			assertionBuilder = require('../lib/assertionbuilder');
			Builder = new assertionBuilder('class-name'); 
			
			Builder.shouldReceive('method1').once().willExecuteCallback(1, [null, true]);

			var result = Builder.getMock();
			result = new result();
			result.method1('item1', function(val1, val2) {
				assert.equal(val1, null);
				assert.equal(val2, true);
				done();
			});
		});

	});

});