var assert = require('assert');
var srch = require('../controllers/searchController');
var rewire = require('rewire');
var sinon = require('sinon');

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
	var itemFinder = new ItemFinder();
	
	it('should return an object', function() {
		itemFinder = new ItemFinder(item1.framework, item1.type, item1.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		var test = foundItems.find( e => e.id == itemFinder.ordinal && e.framework == itemFinder.framework && e.type == itemFinder.type);
		assert.equal( typeof test, 'object')
	});
	
	it('should still have only 1 item because 2nd attempt to add same item should be blocked', function() {
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.notEqual( foundItems.length, 2)
	});
	
	it('should have 2 elements now because item was changed slightly', function() {
		itemFinder = new ItemFinder(item2.framework, item2.type, item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 2)
	});
	
	it('should have 3 elements now because item was changed slightly', function() {
		itemFinder = new ItemFinder(item2.framework, item2.type, 3);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 3)
	});
	
	it('should have 4 elements now because item was changed slightly', function() {
		itemFinder = new ItemFinder(item2.framework, 'type3', item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 4)
	});
	
	it('should have 5 elements now because item was changed slightly', function() {
		itemFinder = new ItemFinder('frame3', item2.type, item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 5)
	});
	
	it('should still have only 5 items because 2nd attempt to add same item should be blocked', function() {
		itemFinder = new ItemFinder('frame3', item2.type, item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.notEqual( foundItems.length, 6)
	});
	
});


var collectItemsMatchingSearchTerms = app.__get__('collectItemsMatchingSearchTerms');

describe('collectItemsMatchingSearchTerms', function() {
	var foundItems = new Array();
	var alreadyFoundKeys = ['one','two'];
	var item1 = { id: '1', framework: 'frame1', type: 'type1' }
	var item2 = { id: '2', framework: 'frame2', type: 'type2' }
	var itemFinder = new ItemFinder();
	var keywordItemFinderMap = new Map();
	var dataArray = [item1, item2];
	var searchWordsArray = new Array();
	var count = 0;
	
	var stub = function() {
		count++;
		items = [1,2,3,4,5,6,7]
	}
	
	addItem = stub;
	if('should do something', function() {
		collectItemsMatchingSearchTerms( keywordItemFinderMap, dataArray, searchWordsArray );
		assert.equal( count, 5 )
	});
	
	stub.restore();
	
});

