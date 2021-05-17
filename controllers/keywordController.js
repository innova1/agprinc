const db = require('./dataController');

exports.displayKeywordList = async function(req, res) {
  const debug = false;
  if(debug) { console.log( 'in displayKeywordList' ); }
  const principlesArray = await db.getPrinciplesArray('all','');

  res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: principlesArray });
}

exports.editKeyword = async function(req, res) {
    try {
        const debug = true;
        const framework = req.query.framework;
        const type = req.query.type;
        const id = req.query.id;
        if(debug) { console.log( 'in editKeyword() framework:' + framework + ', type:' + type + ', id:' + id ) };
        const principlesArray = await db.getPrincipleByID(framework, type, id);
    } catch(err) {
        console.log('error in updateKeywords ' + err.message );
    }
    res.render('editEntryKeyword', { title: 'Edit Keyword', principleObj: principlesArray[0] });
}

exports.updateKeywords = async function(req, res) {
    try {
        const debug = false;
        const framework = req.query.framework;
        const type = req.query.type;
        const id = req.query.id;
        const newkeywords = req.body;
        if(debug) {console.log('in update Keywords with framework:' + framework + ', type:' + type + ', id:' + id + ', newkeywords:' + newkeywords.keywords );}
        //await dbParams.collection.findOneAndUpdate({ _id: new ObjectId(id) }, task);
        if(debug) {console.log('will update with ' + JSON.stringify(newkeywords) )};
        var result = db.updateKeywords( framework, type, id, newkeywords.keywords );
        //const principlesArray = await db.getPrinciplesArray('','');
    } catch(err) {
        console.log('error in updateKeywords ' + err.message );
    }
	
	//res.render('viewEntriesKeywords', { title: 'Keywords List', principlesArray: principlesArray });
    res.redirect('/agileframeworks/keywords');
}

exports.getKeywordsMap = async function(req, res) {
	let keywordsArray = new Array();
	try {
		let kmap = new Map();
		kmap = await db.keywordItemFinderMap('all');
		function pushToArray(value, key, map) {
			keywordsArray.push( value )
		}
		kmap.forEach(pushToArray)
		//console.log("keywordsarray length: " + keywordsArray.length)
	} catch(err) {
		console.log(err)
	}
	return keywordsArray;
}
