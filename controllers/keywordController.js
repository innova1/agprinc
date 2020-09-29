const db = require('../dataController');

exports.displayKeywordList = function() {
	const debug = true;
	const parray = getDataArray();
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}