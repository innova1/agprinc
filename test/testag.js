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

var isItemAlreadyAdded = app.__get__('isItemAlreadyAdded');

describe('isItemAlreadyAdded', function() {
	it('should return true', function() {
		var loc = new Object();
		loc.index = 'zerod';
		var arr = ['zerod','first','second','third']
		assert.equal( isLocationAlreadyInArray(arr, loc), true)
	});
	
	it('should return false', function() {
		var loc = new Object();
		loc.index = 'fourth';
		var arr = ['zerod','first','second','third']
		assert.equal( isLocationAlreadyInArray(arr, loc), false)
	});
});

