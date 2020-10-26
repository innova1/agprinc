var assert = require('assert');
var srch = require('../controllers/searchController');
var rewire = require('rewire');

var app = rewire('../controllers/searchController');

var times6 = app.__get__('times6');

describe('times5()', function() {
	it('should return the number times 5', function() {
		assert.equal( srch.times5(4), 20);
	});
});

describe('times6()', function() {
	it('should return the number times 6', function() {
		assert.equal( times6(4), 24);
	});
});

var isLocationAlreadyInArray = app.__get__('isLocationAlreadyInArray');
describe('isLocationAlreadyInArray', function() {
	it('should return -1', function() {
		var loc = new object();
		loc.index = 1;
		assert.equal( isLocationAlreadyInArray(['zerod','first','second','third'], loc))
	})
})

/*
describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			assert.equal([1, 2, 3].indexOf(4), -1);
		});
	});
});
*/