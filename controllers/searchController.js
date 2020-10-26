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
		const keywordsMap = await db.getSearchMap(framework);
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

/* returns array of principles filtered by searchWordsArray */
async function getItemsFilteredByKeywords( framework, searchWordsArray ) {
    const debug = false;
    if(debug) { console.log('in getItemsFilteredByKeywords with ' + searchWordsArray[0])};
	var foundItems = new Array();
    try {
        const dataArray = await db.getPrinciplesArray('all','');
        const searchMap = await db.getSearchMap(framework);
		foundItems = collectItemsMatchingSearchTerms(searchMap, dataArray, searchWordsArray);
        
    } catch(err) {
        console.log('error in getItemsFilteredByKeywords ' + err.message );
    }
	
	return foundItems;
  
}

function collectItemsMatchingSearchTerms( searchMap, dataArray, searchWordsArray ) {
	const debug = false;
	var items = new Array();
	var indexes = new Array();
	var locations = new Array();
	for( const searchTerm of searchWordsArray ) {
		if(debug) console.log('looking at searchTerm: ' + searchTerm);
		var searchObj = searchMap.get(searchTerm.toLowerCase());
		if(searchObj) {
			locations = searchObj.locations;
			for( const location of locations ) {
				if( !isLocationAlreadyInArray(indexes, location )) {
					pushLocationIndex(indexes, location);
					pushItemLocationToArray(items, dataArray, location);
				} else {
					if(debug) { console.log('skipping ' + searchMap[location.index].shortdescription + ' because already added') };
				}
			}
		}
	}
	return items;
}

function pushItemLocationToArray(foundItems, dataArray, location) {
	foundItems.push(dataArray.find( element => element.id == location.id && element.framework == location.framework && element.type == location.type ));
}

function pushLocationIndex(foundIndexes, location) {
	foundIndexes.push(location.index);
}

function isLocationAlreadyInArray(foundIndexes, location) {
	var result = foundIndexes.indexOf(location.index) != -1;
	console.log('testing location.index of ' + location.index + ' against ' + foundIndexes.length + ' indexes with ' + result);
	return result;
}

exports.times5 = function(a) {
	return a * 5;
}

function times6(a) {
	return a * 6;
}