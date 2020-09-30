const db = require('./dataController');

exports.displayKeywordList = function(req, res) {
	const debug = true;
	const parray = db.getPrinciplesArray('','');
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}

exports.updateKeywords = function(req, res) {
	const debug = true;
    const newkeywords = req.body;
	const parray = db.getPrinciplesArray('','');
    
    if(debug) {console.log('will update with ' + newkeywords)};
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}

exports.editKeyword = function(req, res) {
	const debug = true;
    const framework = req.query.framework;
    const type = req.query.type;
    const id = req.query.id;
    if(debug) { console.log( 'framework: ' + framework + ', type: ' + type + ', id: ' + id ) };
	const principleObj = db.getPrincipleByID(framework, type, id);
    
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principleObj });
}