const db = require('./dataController');

exports.displayKeywordList = function(req, res) {
	const debug = true;
	const parray = db.getPrinciplesArray();
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}