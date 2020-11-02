const db = require('./dataController');

exports.getSearchWords = async function(req, res) {
	const debug = false;
    const searchtext = req.query.searchtext;
	const framework = req.query.framework;
	if(debug) console.log('in search with searchtext-' + decodeURI(searchtext).replace(/\s/g, '+'));
	var searchWordsArray = new Array();
	try {
		searchWordsArray = await getKeywordMatch(framework, searchtext);
	} catch(err) {
		console.log("error in searchcontroller.getSearchWords with " + err);
	}
	res.json( {searchWords: searchWordsArray} );
}

exports.getItems = async function(req, res) {
	const debug = false;
    const framework = req.params.framework;
	if(debug) { console.log('in / in searchController.getItems(' + framework + ')')};
    const itemsArray = await db.getPrinciplesArray(framework,'');
	
    res.json({ items: itemsArray });
}

/* returns array of keywords that match the string of first characters filtered by searchtext for keyword suggestions list */
async function getKeywordMatch( framework, searchtext ) {
	const debug = false;
	if(debug) { console.log('searchtext is ' + searchtext) };
	const keywordsMap = new Map();
	var keywords = new Array();
	if(debug) var count = 0;
	var result = new Array();
	try {
		const keywordsMap = await db.keywordItemFinderMap(framework);
		keywords = [ ...keywordsMap.values() ];
		if(debug) console.log('keyword array length: ' + keywords.length);
		keywords.forEach( element => {
			//take searchtext and then compare with the searchtext.length number of chars at the start of each
			var elstring = element.keyword + '';
			var str = elstring.substring(0, searchtext.length);
			if(debug) { console.log( ++count + 'comparing ' + str + ' with ' + searchtext ) };
			if( str.toUpperCase()===searchtext.toUpperCase() ) {
				if(debug) { console.log( 'pushing compared ' + str + ' with ' + searchtext ) };
				result.push(elstring); 
			}
		});
		
	} catch(err) {
        console.log('error in getKeywordMatch ' + err.message );
	}
	return result;
};

async function getItemsFilterByKeywords(req, res) {
	const debug = true;
	if(debug) console.log('in getItems...');
    const searchWords = req.query.searchwords;
	let searchWordsArray = new Array();
	if(searchWords != '') {
		searchWordsArray = searchWords.split(',');
	}
	let framework = req.query.framework;
	let querytype = req.query.querytype;
	if(querytype == '') querytype = 'or';
	if(debug) console.log("f:" + framework + ",s:" + searchWords + ",q:" + querytype)
	var sort = { frameworkdisplay: 1, type: -1, id: 1 }
	//var testarray = ['contract', 'continuous'];
	let itemsArray = new Array();
	try {
		const dbParams = await db.setupDB();
		if(querytype=='or') {
			//const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
			if(framework=='' || framework=='all') {
				itemsArray = await dbParams.collection.find({ 
					keywords: { $in: searchWordsArray } 
				}).sort(sort).collation({locale: "en_US", numericOrdering: true}).toArray();
			} else {
				itemsArray = await dbParams.collection.find({ 
					framework: framework,
					keywords: { $in: searchWordsArray } 
				}).sort(sort).collation({locale: "en_US", numericOrdering: true}).toArray();
			}
		} else {
			//const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
			if(framework=='' || framework=='all') {
				itemsArray = await dbParams.collection.find({ 
					keywords: { $all: searchWordsArray } 
				}).sort(sort).collation({locale: "en_US", numericOrdering: true}).toArray();
			} else {
				itemsArray = await dbParams.collection.find({ 
					framework: framework,
					keywords: { $all: searchWordsArray } 
				}).sort(sort).collation({locale: "en_US", numericOrdering: true}).toArray();
			}
		}
		dbParams.client.close();
		if(debug) console.log('found: ' + itemsArray.length + ' records.')
	} catch(err) {
		console.log('error in try of getItemsFilterByKeyword ' + err.message );
	}
	
	res.json({ items: itemsArray });
	
}

/*
exports.getFilteredItems = async function(req, res) {
	const debug = false;
    const searchWords = req.query.searchwords;
	const framework = req.query.framework;
	var itemsArray = new Array();
	try {
		const searchWordsArray = searchWords.split(',');
		if(debug) { console.log('in / in searchController.getFilteredItems(' + searchWords + ', ' + framework + ')')};
    	itemsArray = await getItemsFilteredByKeywords(framework, searchWordsArray);
	} catch(err) {
		console.log('error in search controller.getFilteredItems with ' + err);
	}
	
    res.json({ items: itemsArray });
}
*/

/*
async function getItemsFilteredByKeywords( framework, searchWordsArray ) {
    const debug = false;
    if(debug) { console.log('in getItemsFilteredByKeywords with ' + searchWordsArray[0])};
	var foundItems = new Array();
    try {
        const dataArray = await db.getPrinciplesArray('all','');
        const keywordItemFinderMap = await db.keywordItemFinderMap(framework);
		foundItems = collectItemsMatchingSearchTerms(keywordItemFinderMap, dataArray, searchWordsArray);
        
    } catch(err) {
        console.log('error in getItemsFilteredByKeywords ' + err.message );
    }
	
	return foundItems;
  
}
*/

/*
function collectItemsMatchingSearchTerms( keywordItemFinderMap, dataArray, searchWordsArray ) {
	const debug = true;
	if(debug) console.log('in collectItemsMatchingSearchTerms')
	var items = new Array();
	var alreadyFoundKeys = new Array();
	var itemFinders = new Array();
	for( const searchTerm of searchWordsArray ) {
		if(debug) console.log('looking at searchTerm: ' + searchTerm);
		var searchObj = keywordItemFinderMap.get(searchTerm.toLowerCase());
		if(searchObj) {
			itemFinders = searchObj.itemFinders;
			for( const itemFinder of itemFinders ) {
				addItem(items, alreadyFoundKeys, dataArray, itemFinder);
			}
		}
	}
	return items;
}
*/

/*
function addItem(foundItems, alreadyFoundKeys, dataArray, itemFinder) {
	const debug = true;
	if(debug) console.log('in addItem')
	if( alreadyFoundKeys.indexOf(itemFinder.key) == -1) {
		foundItems.push(dataArray.find( element => element.id == itemFinder.ordinal && element.framework == itemFinder.framework && element.type == itemFinder.type ));
		alreadyFoundKeys.push(itemFinder.key);
	} else {
		if(debug) { console.log('skipping ' + itemFinder.key + ' because already added') };
	}
}
*/

function Item(framework, type, ordinal, keywords) {
	this.framework = framework;
	this.type = type;
	this.ordinal = ordinal;
	this.keywords = keywords;
	this.toString = function() {
		return this.framework + "|" + this.type + "|" + this.ordinal;
	}
}

function itemKey(item) {
	return item.framework + "|" + item.type + "|" + item.ordinal; 
}

function Items() {
	this.itemMap = new Map();
	this.framework = 'all';
	this.addItem = function(item) {
		this.itemMap.set(item.toString(), item); //using concat of main values as map key, map will reject duplicates keys
	}
}

exports.Item = Item;
exports.Items = Items;
//exports.addItem = addItem;
//exports.collectItemsMatchingSearchTerms = collectItemsMatchingSearchTerms;
exports.getItemsFilterByKeywords = getItemsFilterByKeywords;