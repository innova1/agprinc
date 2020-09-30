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
    if(debug) { console.log( 'framework: ' + framework + ', type: ' + type + ', id: ' + id ) };
	const principleObj = db.getPrincipleByID('manifesto', 'principle', '1');
    
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principleObj });
}