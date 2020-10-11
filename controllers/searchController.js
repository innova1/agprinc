const db = require('./dataController');

exports.getFilteredItems = async function(req, res) {
	const debug = true;
    const searchtext = req.query.searchterms;
	if(debug) console.log('in search with searchterms-' + decodeURI(searchterms));
	searchtermsArray = searchterms.split(',');
	var filteredItemsArray = new Array();
	try {
		filteredItemsArray = await db.getKeywordMatch(searchtext);
	} catch(err) {
		console.log("error in searchcontroller.getFilteredItems with " + err);
	}
	return filteredItemsArray;
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
	const debug = true;
	
	return "";
}

exports.getItems = async function(req, res) {
	const debug = false;
    const framework = req.params.framework;
	if(debug) { console.log('in / in searchController.getItems(' + framework + ')')};
    const itemsArray = await db.getPrinciplesArray(framework,'');
	
    res.json({ items: itemsArray });
}
