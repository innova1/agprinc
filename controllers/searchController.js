const db = require('./dataController');

exports.getFilteredItems = async function(req, res) {
	const debug = true;
	
	return "";
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

exports.getAllItems = async function(req, res) {
	const debug = true;
	if(debug) { console.log('in / in searchController')};
    const itemsArray = await db.getPrinciplesArray('','');
	
    res.json({ items: itemsArray });
}

