/**
 * Registry for holding the mock objects.
 */
module.exports = {
	mocks: {},

	/**
	 * Add a mock to the registry
	 * @param {string}  name   Key for the mock object[description]
	 * @param {Object}  mock   Mock object
	 */
	addMock: function(name, mock) {
		this.mocks[name] = mock;
	},

	/**
	 * Returns an array of the mocks in the registry
	 * @return {array}  Array of mock objects 
	 */
	getMocks: function() {
		return this.mocks;
	},

	/**
	 * Clears the current mocks in the registry
	 */
	clearMocks: function() {
		this.mocks = {};
	}
}