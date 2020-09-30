const db = require('./dataController');

exports.displayKeywordList = function(req, res) {
	const debug = true;
	const parray = db.getPrinciplesArray('','');
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}

exports.editKeyword = function(req, res) {
	const debug = true;
    const framework = req.params.framework;
    const type = req.params.type;
    const id = req.params.id;
	const principleObj = db.getPrincipleByID(framework, type, id);
    
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principleObj });
}