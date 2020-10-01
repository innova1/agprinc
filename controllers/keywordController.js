const db = require('./dataController');

exports.displayKeywordList = async function(req, res) {
	const debug = true;
	const parray = await db.getPrinciplesArray('','');
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}

exports.updateKeywords = async function(req, res) {
	const debug = true;
    const framework = req.query.framework;
    const type = req.query.type;
    const id = req.query.id;
    const newkeywords = req.body;
    if(debug) {console.log('in update Keywords with framework:' + framework + ', type:' + type + ', id:' + id + ', newkeywords:' + newkeywords );}
	const parray = await db.getPrinciplesArray('','');
    
    if(debug) {console.log('will update with ' + JSON.stringify(newkeywords) )};
    db.updateKeywords( framework, type, id, newkeywords.keywords );
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: parray });
}

exports.editKeyword = async function(req, res) {
	const debug = true;
    const framework = req.query.framework;
    const type = req.query.type;
    const id = req.query.id;
    if(debug) { console.log( 'framework:' + framework + ', type:' + type + ', id:' + id ) };
	const principlesArray = await db.getPrincipleByID(framework, type, id);
    
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principlesArray[0] });
}