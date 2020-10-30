var assert = require('assert');
var srch = require('../controllers/searchController');
var sinon = require('sinon');

describe('times5()', function() {
	it('should return the number times 5', function() {
		assert.equal( srch.times5(4), 20);
	});
});

describe('times6()', function() {
	it('should return the number times 6', function() {
		assert.equal( srch.times6(4), 24);
	});
});

describe('addItem', function() {
	var foundItems = new Array();
	var alreadyFoundKeys = ['one','two'];
	var item1 = { id: '1', framework: 'frame1', type: 'type1' }
	var item2 = { id: '2', framework: 'frame2', type: 'type2' }
	var dataArray = [item1, item2];
	var itemFinder = new srch.ItemFinder();
	
	it('should return an object', function() {
		itemFinder = new srch.ItemFinder(item1.framework, item1.type, item1.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		var test = foundItems.find( e => e.id == itemFinder.ordinal && e.framework == itemFinder.framework && e.type == itemFinder.type);
		assert.equal( typeof test, 'object')
	});
	
	it('should still have only 1 item because 2nd attempt to add same item should be blocked', function() {
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.notEqual( foundItems.length, 2)
	});
	
	it('should have 2 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, item2.type, item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 2)
	});
	
	it('should have 3 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, item2.type, 3);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 3)
	});
	
	it('should have 4 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, 'type3', item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 4)
	});
	
	it('should have 5 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder('frame3', item2.type, item2.id);
		addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 5)
	});
	
	it('should still have only 5 items because 2nd attempt to add same item should be blocked', function() {
		itemFinder = new srch.ItemFinder('frame3', item2.type, item2.id);
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
	var itemFinder = new srch.ItemFinder('frame1','type1','1');
	var itemFinders = [itemFinder];
	var keywordItemFinderMap = new Map();
	var searchObj = {itemFinders: itemFinders}
	keywordItemFinderMap.set('akey', searchObj)
	var dataArray = [item1, item2];
	var searchWordsArray = ['akey'];
	var count = 0;
	var items = new Array();
	
	var myAPI = { addItem: function() {
			console.log('in addItem Mock');
			count++;
			items.push(count);
		}
	}
	
	var mock = sinon.mock(myAPI);
	//mock.expects("addItem").returns('hello');
	
	it('should do something', function() {
		collectItemsMatchingSearchTerms( keywordItemFinderMap, dataArray, searchWordsArray, myAPI.method );
		assert.equal( count, 5 )
	});
	
});

