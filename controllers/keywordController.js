const db = require('./dataController');

exports.displayKeywordList = async function(req, res) {
	const debug = true;
	const principlesArray = await db.getPrinciplesArray('','');
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: principlesArray });
}


exports.editKeyword = async function(req, res) {
	const debug = true;
    const framework = req.query.framework;
    const type = req.query.type;
    const id = req.query.id;
    if(debug) { console.log( 'in editKeyword() framework:' + framework + ', type:' + type + ', id:' + id ) };
	const principlesArray = await db.getPrincipleByID(framework, type, id);
    
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principlesArray[0] });
}

exports.updateKeywords = async function(req, res) {
    try {
        const debug = true;
        const framework = req.query.framework;
        if(debug) {console.log('got here 1'); }
        const type = req.query.type;
        if(debug) {console.log('got here 2'); }
        const id = req.query.id;
        if(debug) {console.log('got here 3'); }
        const newkeywords = req.body;
        if(debug) {console.log('got here 4'); }
        if(debug) {console.log('in update Keywords with framework:' + framework + ', type:' + type + ', id:' + id + ', newkeywords:' + newkeywords );}
        const principlesArray = await db.getPrinciplesArray('','');
        //await dbParams.collection.findOneAndUpdate({ _id: new ObjectId(id) }, task);
        if(debug) {console.log('will update with ' + JSON.stringify(newkeywords) )};
        db.updateKeywords( framework, type, id, newkeywords.keywords );
    } catch(err) {
        console.log('error in updateKeywords ' + err.message );
    }
	
	res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: principlesArray });
}
