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
		console.log('item1:' + item1.id + ',' + item1.framework + ',' + item1.type)
		console.log('in itemfinder:' + itemFinder.ordinal + ',' + itemFinder.framework + ',' + itemFinder.type)
		console.log('in dataArray:' + dataArray[0].id + ',' + dataArray[0].framework + ',' + dataArray[0].type)
		var test = foundItems.find( e => e.id == itemFinder.ordinal && e.framework == itemFinder.framework && e.type == itemFinder.type);
		console.log('test:' + test)
		assert.equal( typeof test, 'object')
	});
	
	it('should return false', function() {
		var loc = new Object();
		loc.index = 'fourth';
		var arr = ['zerod','first','second','third']
		assert.equal( isLocationAlreadyInArray(arr, loc), false)
	});
});

