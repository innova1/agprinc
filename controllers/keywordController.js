const db = require('../dataController');

exports.displayKeywordList() {
	const debug = true;
	const parray = getDataArray();
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}