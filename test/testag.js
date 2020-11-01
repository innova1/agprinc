var assert = require('assert');
var srch = require('../controllers/searchController');
var sinon = require('sinon');

describe('addItem', function() {
	var foundItems = new Array();
	var alreadyFoundKeys = ['one','two'];
	var item1 = { id: '1', framework: 'frame1', type: 'type1' }
	var item2 = { id: '2', framework: 'frame2', type: 'type2' }
	var dataArray = [item1, item2];
	var itemFinder = new srch.ItemFinder();
	
	it('should return an object', function() {
		itemFinder = new srch.ItemFinder(item1.framework, item1.type, item1.id);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		var test = foundItems.find( e => e.id == itemFinder.ordinal && e.framework == itemFinder.framework && e.type == itemFinder.type);
		assert.equal( typeof test, 'object')
	});
	
	it('should still have only 1 item because 2nd attempt to add same item should be blocked', function() {
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.notEqual( foundItems.length, 2)
	});
	
	it('should have 2 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, item2.type, item2.id);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 2)
	});
	
	it('should have 3 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, item2.type, 3);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 3)
	});
	
	it('should have 4 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder(item2.framework, 'type3', item2.id);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 4)
	});
	
	it('should have 5 elements now because item was changed slightly', function() {
		itemFinder = new srch.ItemFinder('frame3', item2.type, item2.id);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.equal( foundItems.length, 5)
	});
	
	it('should still have only 5 items because 2nd attempt to add same item should be blocked', function() {
		itemFinder = new srch.ItemFinder('frame3', item2.type, item2.id);
		srch.addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder)
		assert.notEqual( foundItems.length, 6)
	});
	
});

describe("Item", function() {
	var a = new Item('frame1', 'type1', 'iter1');
	
	it('should return frame1') {
		assert.equal( a.framework, 'frame1');
	}
	
	it('should return type1') {
		assert.equal( a.framework, 'type1');
	}
	
	it('should return iter1') {
		assert.equal( a.framework, 'iter1');
	}
}

/*
var items = new Items();

var a = new Item('frame1', 'type1', 'iter1');
items.addItem(a);
a = new Item('frame2', 'type2', 'iter2');
items.addItem(a);
a = new Item('frame3', 'type3', 'iter3');
items.addItem(a);
a = new Item('frame1', 'type1', 'iter1');
items.addItem(a);

console.log('length of s is ' + s.size);

for( const e of s ) {
	console.log(e + ", " + e.toString())
}

console.log('length of items is ' + items.size);

for( const e of items.itemMap.keys() ) {
	console.log(e)
}
*/