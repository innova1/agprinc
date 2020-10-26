var assert = require('assert');
var srch = require('../controllers/searchController')

describe('testableFunc', function() {
	it('should return the number times 5', function() {
		assert.equal( testableFunc(4), 20);
	});
});

/*
describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});
*/