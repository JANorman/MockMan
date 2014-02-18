var assert = require('assert'),
	_ = require('underscore');

describe('MockRegistry', function() {

	var registry;
	beforeEach(function(done) {
		registry = require('../lib/mockregistry');
		registry.clearMocks();
		done();
	});

	describe('GetMocks', function() {

		it('should return empty array when none set', function(done) {
			assert.deepEqual([], registry.getMocks());
			done();
		});

		it('should return items that have been set', function(done) {
			var mock1 = { mockname: 'mock1' };
			var mock2 = { mockname: 'mock2' };
			var mock3 = { mockname: 'mock3' };

			registry.addMock('Mock1', mock1);
			registry.addMock('Mock2', mock2);
			registry.addMock('Mock3', mock3);

			var mocks = registry.getMocks();
			var expected = {
				Mock1: mock1,
				Mock2: mock2,
				Mock3: mock3
			};
			assert.deepEqual(expected, mocks);
			done();
		});

	});

	describe('ClearMocks', function() {

		it('should correctly clear mocks', function(done) {
			var mock1 = { mockname: 'mock1' };
			registry.addMock('Mock1', mock1);

			assert.equal(1, _.keys(registry.getMocks()).length);

			registry.clearMocks();
			assert.equal(0, _.keys(registry.getMocks()).length);
			done();
		});

	});

});