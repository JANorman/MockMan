var MockMan_AssertionBuilder = require('./assertionbuilder'),
    MockMan_AssertionTester = require('./assertiontester'),
    _ = require('underscore');

/**
 * MockMan
 * @type {Object}
 */
var mockman = {
	mocks: {},

	/**
	 * Sets up an instance
	 * @param  {string} module_name    Unique name for module
	 * @return {AssertionBuilder}      Assertion builder
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
		var tester = MockMan_AssertionTester.runAssertions();
	}
};

module.exports = mockman;