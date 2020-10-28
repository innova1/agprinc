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

var addItem = app.__get__('addItem');
var ItemFinder = app.__get__('ItemFinder');

describe('addItem', function() {
	var foundItems = new Array();
	var alreadyFoundKeys = ['one','two'];
	var item1 = { id: '1', framework: 'frame1', type: 'type1' }
	var item2 = { id: '2', framework: 'frame2', type: 'type2' }
	var dataArray = [item1, item2];
	var itemFinder = new ItemFinder(item1.framework, item1.type, item1.id);
	it('should return true', function() {
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		var test = foundItems.find( e => e.ordinal == item1.id && e.framework == item1.framework && e.type == item1.type);
		assert.equal( test, true)
	});
	
	it('should return false', function() {
		var loc = new Object();
		loc.index = 'fourth';
		var arr = ['zerod','first','second','third']
		assert.equal( isLocationAlreadyInArray(arr, loc), false)
	});
});

