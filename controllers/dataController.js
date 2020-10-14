const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:dataController');

async function setupDB() {
    const debug = false;
    const url = 'mongodb://application:app44word@localhost:27017/?authMechanism=SCRAM-SHA-1&authSource=agileinfodb'; //process.env.DB_URL;
    if(debug) { console.log('in setupDB with url ' + url); }
    //debug(`attempting to connect to database at ${url}`);
    const dbName = 'agileinfodb';
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = client.db(dbName);
        const collection = await db.collection('agileinfo');
        return ({ client: client, collection: collection });
    } catch (err) {
        //debug(err);
        console.log(err);
    }
};

exports.testdb = async function() {
    const debug = false;
    if(debug) { console.log('in exprt test db'); }
    try {
        const dbParams = await setupDB();
        const el = await dbParams.collection.findOne({ _id: new ObjectId('5f74e7e9a5562327a9226af1') });
        if(debug) { console.log( 'got here 1 in testdb with element type:' + el.type ); }
        dbParams.client.close();
        if(debug) { console.log( 'about to return element type:' + el.type ); }
        return el;
    } catch(err) {
		console.log('error in try of testdb ' + err.message );
    }
};

exports.getPrincipleByID = async function(framework, type, id) {
    return getPrincipleByID(framework, type, id);
};

async function getPrincipleByID(framework, type, id) {
    const debug = false;
    //contract: next called with an id that is out of range -- call isIDInRange() first
	try {
        /*
		if(debug) { console.log('in get prin by framework=' + framework + ', type=' + type + ', id=' + id) };
		//if( id > 12 || id < 1 ) { id = '1'; console.log('changed id to ' + id); }
		const parray = getPrinciplesArray(framework, type);
        if(debug) { console.log('first record of array is ' + parray[0].id) };
		var result = parray.find( e => e.id == id );
        if(debug) { console.log('result is ' + result) };
        */
        
        const dbParams = await setupDB();
        if(debug) {
            const el = await dbParams.collection.findOne({ _id: new ObjectId('5f74e7e9a5562327a9226af1') });
            console.log('test: ' + el.type);
        }
        //const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
        principlesArray = await dbParams.collection.find({ "framework": framework, "type": type, "id": id}).toArray();
        if(debug) { await 'principlesArray length: ' + principlesArray.length; }
        dbParams.client.close();
        
		return principlesArray;
	} catch (err) {
		console.log('error in try of get prin by id ' + err.message );
	}
};

exports.getPrinciplesArray = function(framework, type) {
    return getPrinciplesArray(framework, type);
};

async function getPrinciplesArray(framework, type) {
    const debug = false;
    if(debug) { console.log('in get prin array export with framework ' + framework); }
    const parray = getDataArray();
    //console.log('parray is length ' + parray.length);
    let principlesArray = new Array();
    if(framework=='all') {
        if(debug) { console.log('in get princ array framework is empty'); }
        /*
        principlesArray = parray;
        */
        try {
            const dbParams = await setupDB();
            if(debug) {
                const el = await dbParams.collection.findOne({ _id: new ObjectId('5f74e7e9a5562327a9226af1') });
                console.log('test: ' + el.type);
            }
            //const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
            principlesArray = await dbParams.collection.find({}).toArray();
            if(debug) { await 'parray length: ' + parray.length; }
            dbParams.client.close();
        } catch(err) {
            console.log('error in try of getPrinciplesArray ' + err.message );
        }
    } else if(type=='') {
        if(debug) { console.log('type is empty') };
        try {
            const dbParams = await setupDB();
            //const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
            principlesArray = await dbParams.collection.find({ "framework": framework }).toArray();
            dbParams.client.close();
        } catch(err) {
            console.log('error in try of getPrinciplesArray ' + err.message );
        }
        /*
        function isFramework(o) {
            return o.framework == framework;
        }
        principlesArray = parray.filter( isFramework );
        principlesArray.sort(comparePrinciplesSortById);
        principlesArray.sort(comparePrinciplesSortByType);
        */
    } else {
        if(debug) { console.log('in else framework is ' + framework + ', type is ' + type) ; }
        try {
            const dbParams = await setupDB();
            //const fbks = await dbParams.collection.find({}).sort({ createDate: -1 }).toArray();
            principlesArray = await dbParams.collection.find({ "framework": framework, "type": type }).toArray();
            dbParams.client.close();
        } catch(err) {
            console.log('error in try of getPrinciplesArray ' + err.message );
        }
        /*
        function isMatchFrameworkAndType(o) {
            return o.framework == framework && o.type == type ;
        }
        principlesArray = parray.filter( isMatchFrameworkAndType );
        */
    }
    if(debug) { console.log('about to export prin array with length ' + principlesArray.length); }
	return principlesArray;
};

exports.getFrameworksArray = async function() {
    //using a Set object so that duplicates are removed
    const debug = false;
	const s = new Set();
	const frameworks = new Array();
	try {
		const p = await getPrinciplesArray('all','');
		if(debug) { console.log('data array length is ' + p.length); }
		//const p = getDataArray();
		const iterator = p.keys();				
		for (const key of iterator ) {
			if(debug) { console.log('testing with key ' + key + ' and ' + p[key].framework) };
			if(!s.has(p[key].framework)) {
			   frameworks.push( { framework: p[key].framework, frameworkdisplay: p[key].frameworkdisplay } )
			}
			s.add( p[key].framework );
			if(debug) { console.log('s length is now ' + s.size + ' and frameworks is now ' + frameworks.length ); }
		}
	} catch(err) {
    	console.log('got error in catch block of getFrameworksArray with ' + err);
	}
    return frameworks;
};

exports.getNumbersArray = function( framework ) {
    const o = getSingleframeworkObj( framework );
    return o.idArray;
};

exports.isIDInRange = function( framework, type, id ) {
    const o = getSingleFrameworkTypeIdObj( framework, type, id );
    return !( id < o.min || id > o.max );
};

exports.getSearchMap = function() {
    return createSearchMap();
}

exports.getFilteredItems = async function( searchWordsArray ) {
	var resultArray = new Array();
	try {
		resultArray = await getItemsFilteredByKeywords( searchWordsArray );
	} catch(err) {
		console.log('error in db.getFilteredItems with ' + err);
	}
	return resultArray;
}

exports.updateKeywords = async function( framework, type, id, keywords ) {
    const debug = false;
    var result = false;
    if(debug) { console.log('in db.updateKeywords framework: ' + framework + ', type: ' + type + ', id: ' + id + ', keywords: ' + keywords); }
    // todo -- keywords is a string, needs to be turn into an array
    var keywordsArray = keywords.split(',').map( item => item.trim() );
    if(debug) {
        for( const k of keywordsArray ) {
            console.log(k);
        }
    }
    
    try {
        //await dbParams.collection.findOneAndUpdate({ _id: new ObjectId(id) }, task);
        const dbParams = await setupDB();
        result = dbParams.collection.findOneAndUpdate( 
            { 
                "framework": framework, 
                "type": type, 
                "id": id}, 
                { 
                    $set: 
                        { 
                            "keywords": keywordsArray 
                        } 
                } 
        );
    } catch(err) {
        console.log('error in dataController.updateKeywords ' + err.message );
    }

    return result;
}

/* returns array of keywords that match the string of first characters filtered by searchtext for keyword suggestions list */
exports.getKeywordMatch = async function a( searchtext ) {
	const debug = false;
	if(debug) { console.log('searchtext is ' + searchtext) };
	const keywordsMap = new Map();
	var keywords = new Array();
	if(debug) var count = 0;
	var result = new Array();
	try {
		const keywordsMap = await createSearchMap();
		keywords = [ ...keywordsMap.values() ];
		if(debug) console.log('keyword array length: ' + keywords.length);
		keywords.forEach( element => {
			//take searchtext and then compare with the searchtext.length number of chars at the start of each
			var elstring = element.keyword + '';
			var str = elstring.substring(0, searchtext.length);
			if(debug) { console.log( ++count + 'comparing ' + str + ' with ' + searchtext ) };
			if( str.toUpperCase()===searchtext.toUpperCase() ) {
				if(debug) { console.log( 'pushing compared ' + str + ' with ' + searchtext ) };
				result.push(elstring); 
			}
		});
		
	} catch(err) {
        console.log('error in dataController.getKeywordMatch ' + err.message );
	}
	return result;
};

function getSingleFrameworkTypeIdObj( framework, type, id ) {
    const singleframeworkObj = new Object();
    const a = getDataArray();
    function isframework(o) {
        return o.framework == framework && o.type == type.substring(0,type.length-1);
    }
    singleframeworkObj.frameworks = a.filter( isframework );
    singleframeworkObj.idArray = new Array();
    singleframeworkObj.frameworks.forEach( e => singleframeworkObj.idArray.push(e.id) );
    singleframeworkObj.max = Math.max(...singleframeworkObj.idArray);
    singleframeworkObj.min = Math.min(...singleframeworkObj.idArray);
    return singleframeworkObj;
};

function comparePrinciplesSortById(a,b) {
    if(Number(a.id) > Number(b.id)) return 1;
    if(Number(a.id) < Number(b.id)) return -1;
    return 0;
}

function comparePrinciplesSortByType(a,b) {
    if(a.type < b.type) return 1;
    if(a.type > b.type) return -1;
    return 0;
}

function getDataArray() {
    let pObj = new Array();
    let i = 0;
    pObj[i]    = { id: '1' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.', keywords: ['highest', 'priority', 'customer', 'early', 'continuous', 'delivery', 'valuable', 'software'] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'welcome change', text: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.', keywords: [ 'changing', 'requirements', 'late', 'development', 'change', 'customer', 'competitive', 'advantage'] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'deliver frequently', text: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.', keywords: ['deliver', 'working', 'software', 'frequently', 'weeks', 'months', 'shorter', 'timescale'] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'daily with business', text: 'Business people and developers must work together daily throughout the project.', keywords: ['business', 'developers', 'together', 'daily', 'project'] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'motivated individuals', text: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.', keywords: ['Build', 'projects', 'motivated', 'individuals', 'environment', 'support', 'trust'] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.', keywords: ['efficient', 'effective', 'conveying', 'information', 'team', 'face-to-face', 'conversation'] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'progress is working software', text: 'Working software is the primary measure of progress.', keywords: ['Working', 'software', 'primary', 'measure', 'progress']};
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.', keywords: ['Agile', 'processes', 'promote', 'sustainable', 'development', 'sponsors', 'developers', 'users', 'maintain', 'constant', 'pace', 'indefinitely'] };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.', keywords: [] };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'simplicity', text: 'Simplicity--the art of maximizing the amount of work not done--is essential.', keywords: [] };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams.', keywords: [] };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous improvement', text: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'individuals and interactions', text: 'Individuals and interactions over processes and tools', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'deliver frequently', text: 'Working software over comprehensive documentation', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'collaboration', text: 'Customer collaboration over contract negotiation', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'respond to change', text: 'Responding to change over following a plan', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'economic view', text: 'Take an economic view', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'systems thinking', text: 'Apply systems thinking', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'variability', text: 'Assume variability; preserve options', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'incremental learning', text: 'Build incrementally with fast, integrated learning cycles', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'working systems', text: 'Base milestones on objective evaluation of working systems', keywords: [] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'flow', text: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths', keywords: [] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'cadence', text: 'Apply cadence, synchronize with cross-domain planning', keywords: [] };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'intrinsic motivation', text: 'Unlock the intrinsic motivation of knowledge workers', keywords: [] };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'decentralize', text: 'Decentralize decision-making', keywords: [] };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'value', text: 'Organize around value', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'alignment', text: 'Alignment', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'built-in quality', text: 'Built-in quality', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'transparency', text: 'Transparency', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'program execution', text: 'Program execution', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'delight customers', text: 'Delight Customers', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'be awesome', text: 'Be awesome', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'pragmatism', text: 'Pragmatism over purism', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'context', text: 'Context counts', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'choice', text: 'Choice is good', keywords: [] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'flow', text: 'Optimize flow', keywords: [] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'enterprise', text: 'Enterprise awareness', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Individuals and interactions over processes and tools', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Consumable solutions over comprehensive documentation', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Stakeholder collaboration over contract negotiation', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Responding to feedback over following a plan', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Transparency over (false) predictability', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the stakeholder through early and continuous delivery of valuable solutions.', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'welcome change', text: 'Welcome emerging requirements, even late in the solution delivery lifecycle. Agile processes harness change for the customer’s competitive advantage.', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'deliver continuously', text: 'Deliver valuable solutions continuously, from many times a day to every few weeks, with the aim to increase the frequency over time.', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'daily with stakeholders', text: 'Stakeholders and developers must actively collaborate to deliver outcomes that will delight our organization’s customers.', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'motivated individuals', text: 'Build teams around motivated individuals. Give them the environment and support they need, and trust them to get the job done.', keywords: [] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a delivery team is face-to-face conversation, ideally around a whiteboard.', keywords: [] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'measure is delivery of value', text: 'Continuous delivery of value is the primary measure of progress.', keywords: [] };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable delivery. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.', keywords: [] };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.', keywords: [] };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'simplicity', text: 'Simplicity – the art of maximizing the amount of work not done – is essential.', keywords: [] };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams enabled by organizational roadmaps and support.', keywords: [] };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous improvement', text: 'The team continuously reflects on how to become more effective, then experiments, learns, and adjusts its behavior accordingly.', keywords: [] };
    pObj[++i]  = { id: '13', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'leverage and evolve enterprise assets', text: 'Leverage and evolve the assets within your enterprise, collaborating with the people responsible for those assets to do so.', keywords: [] };
    pObj[++i]  = { id: '14', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'visualize work', text: 'Visualize work to produce a smooth delivery flow and keep work-in-progress (WIP) to a minimum.', keywords: [] };
    pObj[++i]  = { id: '15', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'evolve the entire enterprise', text: 'Evolve the entire enterprise, not just individuals and teams, to support agile, non-agile, and hybrid teams.', keywords: [] };
    pObj[++i]  = { id: '16', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'automated measures for data-led decisions', text: 'We measure our work and its outcomes, preferring automated measures over manually gathered ones, to make data-led decisions.', keywords: [] };
    pObj[++i]  = { id: '17', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'transparency', text: 'We provide complete transparency to our stakeholders in everything we do and produce, to enable open and honest conversations and effective governance of our team.', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'delivery continuously', text: 'Deliver continuously', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'visualize workflow', text: 'Visualize workflow', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'whole teams', text: 'Whole teams', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'stable teams', text: 'Stable teams', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'trust & respect', text: 'Trust & respect', keywords: [] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'mastery', text: 'Master your craft', keywords: [] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'technical excellence', text: 'Technical excellence', keywords: [] };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'collaboration', text: 'Collaboration', keywords: [] };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'measure wisely', text: 'Measure wisely', keywords: [] };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'transparency', text: 'Transparency', keywords: [] };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'learn continuously', text: 'Learn continuously', keywords: [] };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'purposeful experiments', text: 'Purposeful experiments', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'awesome', text: 'Make people awesome', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'deliver continuously', text: 'Deliver value continuously', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'safety', text: 'Make safety a prerequisite', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'experiment and learn', text: 'Experiment and learn rapidly', keywords: [] };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'waste', text: 'Eliminate waste', keywords: [] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'quality', text: 'Build quality in', keywords: [] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'knowledge', text: 'Create knowledge', keywords: [] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'defer', text: 'Defer commitment', keywords: [] };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'quickly', text: 'Deliver quickly', keywords: [] };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'respect', text: 'Respect people', keywords: [] };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'optimize', text: 'Optimize the whole', keywords: [] };
    return pObj;
};

/*
    create an array of objects
		each important word has an object indexed on the word itself
		each object is the word and an array of framework, type and id of the principle that contains the word
		go through the data array and build this
		on each new work check if it already exists
		if yes, then add this pointer to the array in the object
		if no, then create the object and add to the array
*/
async function createSearchMap() {
    const debug = false;
  	//const dataArray = getDataArray(); //full data array of all values and principle objects
    const dataArray = await getPrinciplesArray('all','');
    var searchMap = new Map(); //Map being built of a list of objects with keyword and location of the word
    var tempArray = new Array(); //temporary holding tank of keywords to be tested and added if not already there. if already there, then just add location to the end of the item on the search array
    var locationObj = new Object();
    var searchObj = new Object();
    var index = -1;

    for( const a of dataArray ) {
	  index++
      //get the keywords from each a entry
      //go through and see if keyword is in the map
      //if yes, add location to the map object
      //if no, add new map entry with location in object
      tempArray = a.keywords;
      if(tempArray) {
        for( const kwd of tempArray ) {
          if(debug) { console.log('looking at object with keyword ' + kwd); }
          searchObj = searchMap.get(kwd);
          if(!searchObj) { //the keyword is not already in the map, then add
            if(debug) { console.log('keywork ' + kwd + ' not already in search obj'); }
            locationObj = { index: index, framework: a.framework, type: a.type, id: a.id };
            var locations = new Array();
            locations.push(locationObj);
            searchObj = { keyword: kwd, locations: locations };
            searchMap.set(kwd.toLowerCase(), searchObj);
            if(debug) { console.log('added location ' + a.framework + ':' + a.type + ':' + a.id + ' to new search object ' + searchObj.keyword); }
          } else { //add location to existing
            if(debug) { console.log('adding location ' + a.framework + ':' + a.type + ':' + a.id + ' to existing search object ' + searchObj.keyword); }
            locationObj = { index: index, framework: a.framework, type: a.type, id: a.id };
            searchObj.locations.push(locationObj);
          }
        }
      } else {
        if(debug) { console.log('skipping ' + a.id ); }
      }
    }
    return searchMap;
}

/* returns array of principles filtered by searchWordsArray */
async function getItemsFilteredByKeywords( searchWordsArray ) {
    const debug = false;
    if(debug) { console.log('in getItemsFilteredByKeywords with ' + searchWordsArray[0])};
    //const dataArray = getDataArray();
    const foundItems = new Array();
    try {
        const dataArray = await getPrinciplesArray('all','');
		if(debug) console.log('db.getFilteredItems just before create search map');
        const searchMap = await createSearchMap();
		if(debug) console.log('db.getFilteredItems just after create search map. searchMap length: ' + searchMap.size);
        var foundIndexes = new Array();
        var locations = new Array();
        for( const searchTerm of searchWordsArray ) {
		  if(debug) console.log('looking at searchTerm: ' + searchTerm);
          var searchObj = searchMap.get(searchTerm.toLowerCase());
          if(searchObj) {
            locations = searchObj.locations;
            for( const l of locations ) {
              if( foundIndexes.indexOf(l.index) == -1 ) {
                foundIndexes.push(l.index);
                foundItems.push(dataArray[l.index]);
              } else {
                if(debug) { console.log('skipping ' + dataArray[l.index].shortdescription + ' because already added') };
              }
            }
          }
        }
        if(debug && foundItems[0]) { console.log('first found item is ' + foundItems[0].framework) } else { console.log('none found') };
        
    } catch(err) {
        console.log('error in dataController.getItemsFilteredByKeywords ' + err.message );
    }
	
	return foundItems;
  
}



/*
function getPrinciplesObject( framework ) {
    //console.log('in get principles function with framework ' + framework);
    let pObj = new Object();
    if( framework == 'manifesto') {
        pObj['1']  = { type: 'principle', framework: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.'};
        pObj['2']  = { type: 'principle', framework: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.'};
        pObj['3']  = { type: 'principle', framework: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
        pObj['4']  = { type: 'principle', framework: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
        pObj['5']  = { type: 'principle', framework: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
        pObj['6']  = { type: 'principle', framework: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
        pObj['7']  = { type: 'principle', framework: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
        pObj['8']  = { type: 'principle', framework: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
        pObj['9']  = { type: 'principle', framework: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
        pObj['10'] = { type: 'principle', framework: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
        pObj['11'] = { type: 'principle', framework: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
        pObj['12'] = { type: 'principle', framework: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    } else if( framework == 'safe' ) {
        pObj['1'] = { type: 'principle', framework: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
        pObj['2'] = { type: 'principle', framework: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
        pObj['3'] = { type: 'principle', framework: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
        pObj['4']  = { type: 'principle', framework: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
        pObj['5']  = { type: 'principle', framework: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
        pObj['6']  = { type: 'principle', framework: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
        pObj['7']  = { type: 'principle', framework: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
        pObj['8']  = { type: 'principle', framework: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
        pObj['9']  = { type: 'principle', framework: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
        pObj['10'] = { type: 'principle', framework: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    } else if( framework == 'dad' ) {
        pObj['1'] = { type: 'principle', framework: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
        pObj['2'] = { type: 'principle', framework: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
        pObj['3'] = { type: 'principle', framework: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
        pObj['4']  = { type: 'principle', framework: 'dad', shortdescription: 'context', principle: 'Context counts' };
        pObj['5']  = { type: 'principle', framework: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
        pObj['6']  = { type: 'principle', framework: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
        pObj['7']  = { type: 'principle', framework: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    } else if( framework == 'modern' ) {
        pObj['1'] = { type: 'principle', framework: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
        pObj['2'] = { type: 'principle', framework: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
        pObj['3'] = { type: 'principle', framework: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
        pObj['4']  = { type: 'principle', framework: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    } else if( framework == 'lean' ) {
        pObj['1'] = { type: 'principle', framework: 'dad', shortdescription: 'waste', principle: 'Eliminate waste' };
        pObj['2'] = { type: 'principle', framework: 'dad', shortdescription: 'quality', principle: 'Build quality in' };
        pObj['3'] = { type: 'principle', framework: 'dad', shortdescription: 'knowledge', principle: 'Create knowledge' };
        pObj['4']  = { type: 'principle', framework: 'dad', shortdescription: 'defer', principle: 'Defer commitment' };
        pObj['5']  = { type: 'principle', framework: 'dad', shortdescription: 'quickly', principle: 'Delivery quickly' };
        pObj['4']  = { type: 'principle', framework: 'dad', shortdescription: 'respect', principle: 'Respect people' };
        pObj['5']  = { type: 'principle', framework: 'dad', shortdescription: 'optimize', principle: 'Optimize the whole' };
    } else {
        ;
    }
    return pObj;
};
*/

