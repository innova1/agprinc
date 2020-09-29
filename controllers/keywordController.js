const db = require('../dataController');

export.getKeywordList() {
	const debug = true;
	const parray = getDataArray();
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}