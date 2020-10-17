const db = require('./dataController');

exports.getSearchWords = async function(req, res) {
	const debug = false;
    const searchtext = req.query.searchtext;
	const framework = req.query.framework;
	if(debug) console.log('in search with searchtext-' + decodeURI(searchtext).replace(/\s/g, '+'));
	var searchWordsArray = new Array();
	try {
		searchWordsArray = await db.getKeywordMatch(framework, searchtext);
	} catch(err) {
		console.log("error in searchcontroller.getSearchWords with " + err);
	}
	res.json( {searchWords: searchWordsArray} );
}

/*
    const framework = req.params.framework;
    const searchterms = req.query.searchterms;
    //console.log('in search with framework-' + framework + ' and searchterms-' + decodeURI(searchterms));
	searchtermsArray = searchterms.split(',');
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = await db.getMatchedItems(searchtermsArray);
    //console.log('in router: len is ' + searchMap.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFrameworkBoot', { title: 'Agile Principles', searchterms: searchtermsArray, frameworks: frameworksArray, framework: framework, principlesArray: principlesArray });
});
*/

exports.getSearchTerms = async function(req, res) {
	const debug = false;
	
	return "";
}

exports.getItems = async function(req, res) {
	const debug = false;
    const framework = req.params.framework;
	if(debug) { console.log('in / in searchController.getItems(' + framework + ')')};
    const itemsArray = await db.getPrinciplesArray(framework,'');
	
    res.json({ items: itemsArray });
}

exports.getFilteredItems = async function(req, res) {
	const debug = true;
    const searchWords = req.query.searchwords;
	const framework = req.query.framework;
	var itemsArray = new Array();
	try {
		const searchWordsArray = searchWords.split(',');
		if(debug) { console.log('in / in searchController.getFilteredItems(' + searchWords + ', ' + framework + ')')};
    	itemsArray = await db.getFilteredItems(framework, searchWordsArray);
	} catch(err) {
		console.log('error in search controller.getFilteredItems with ' + err);
	}
	
    res.json({ items: itemsArray });
}
