
exports.getPrincipleByID = function(framework, type, id) {
    //contract: next called with an id that is out of range -- call isIDInRange() first
	try {
		/*console.log('in get prin by id with id=' + id + ', framework= ' + framework);
		if( id > 12 || id < 1 ) { id = '1'; console.log('changed id to ' + id); }*/
		const parray = getPrinciplesArray(framework, type);
		var result = parray.find( e => e.id == id );
		return result;
	} catch (err) {
		console.log('error in try of get prin by id ' + err.message );
	}
};

exports.getPrinciplesArray = function(framework, type) {
    return getPrinciplesArray(framework, type);
};

function getPrinciplesArray(framework, type) {
    //console.log('in get prin array export with framework ' + framework);
    const parray = getDataArray();
    //console.log('parray is length ' + parray.length);
    let principlesArray = new Array();
    if(type=='') {
        function isFramework(o) {
            return o.framework == framework;
        }
        principlesArray = parray.filter( isFramework );
        principlesArray.sort(comparePrinciplesSortById);
        principlesArray.sort(comparePrinciplesSortByType);
    } else {
        function isMatchFrameworkAndType(o) {
            return o.framework == framework && o.type == type.substring(0,type.length-1);
        }
        principlesArray = parray.filter( isMatchFrameworkAndType );
    }
    //console.log('about to export prin array with length ' + principlesArray.length);
	return principlesArray;
};

exports.getFrameworksArray = function() {
    //using a Set object so that duplicates are removed
    const p = getDataArray();
    const s = new Set();
    const frameworks = new Array();
    const iterator = p.keys();
    for (const key of iterator ) {
        if(!s.has(p[key].framework)) {
           frameworks.push( { framework: p[key].framework, frameworkdisplay: p[key].frameworkdisplay } )
        }
        s.add( p[key].framework );
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
    pObj[i]    = { id: '1' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.', keywords: ['customer', 'early', 'continuous', 'delivery', 'valuable', 'software'] };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'welcome change', text: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.', keywords: [ 'changing', 'requirements', 'late', 'development', 'change', 'customer', 'competitive', 'advantage'] };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'deliver frequently', text: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.', keywords: ['deliver', 'working', 'software', 'frequently', 'weeks', 'months', 'shorter', 'timescale'] };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'daily with business', text: 'Business people and developers must work together daily throughout the project.' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'motivated individuals', text: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'progress is working software', text: 'Working software is the primary measure of progress.' };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.' };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'simplicity', text: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'continuous improvement', text: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'individuals and interactions', text: 'Individuals and interactions over processes and tools' };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'deliver frequently', text: 'Working software over comprehensive documentation' };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'collaboration', text: 'Customer collaboration over contract negotiation' };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'Manifesto', framework: 'manifesto', shortdescription: 'respond to change', text: 'Responding to change over following a plan' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'economic view', text: 'Take an economic view' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'systems thinking', text: 'Apply systems thinking' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'variability', text: 'Assume variability; preserve options' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'incremental learning', text: 'Build incrementally with fast, integrated learning cycles' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'working systems', text: 'Base milestones on objective evaluation of working systems' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'flow', text: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'cadence', text: 'Apply cadence, synchronize with cross-domain planning' };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'intrinsic motivation', text: 'Unlock the intrinsic motivation of knowledge workers' };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'decentralize', text: 'Decentralize decision-making' };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'value', text: 'Organize around value' };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'alignment', text: 'Alignment' };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'built-in quality', text: 'Built-in quality' };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'transparency', text: 'Transparency' };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'SAFe', framework: 'safe', shortdescription: 'program execution', text: 'Program execution' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'delight customers', text: 'Delight Customers' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'be awesome', text: 'Be awesome' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'pragmatism', text: 'Pragmatism over purism' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'context', text: 'Context counts' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'choice', text: 'Choice is good' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'flow', text: 'Optimize flow' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD', framework: 'dad', shortdescription: 'enterprise', text: 'Enterprise awareness' };
    pObj[++i]  = { id: '1' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Individuals and interactions over processes and tools' };
    pObj[++i]  = { id: '2' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Consumable solutions over comprehensive documentation' };
    pObj[++i]  = { id: '3' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Stakeholder collaboration over contract negotiation' };
    pObj[++i]  = { id: '4' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Responding to feedback over following a plan' };
    pObj[++i]  = { id: '5' , type: 'value', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'todo', text: 'Transparency over (false) predictability' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous delivery', text: 'Our highest priority is to satisfy the stakeholder through early and continuous delivery of valuable solutions.' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'welcome change', text: 'Welcome emerging requirements, even late in the solution delivery lifecycle. Agile processes harness change for the customer’s competitive advantage.' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'deliver continuously', text: 'Deliver valuable solutions continuously, from many times a day to every few weeks, with the aim to increase the frequency over time.' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'daily with stakeholders', text: 'Stakeholders and developers must actively collaborate to deliver outcomes that will delight our organization’s customers.' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'motivated individuals', text: 'Build teams around motivated individuals. Give them the environment and support they need, and trust them to get the job done.' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'face-to-face conversation', text: 'The most efficient and effective method of conveying information to and within a delivery team is face-to-face conversation, ideally around a whiteboard.' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'measure is delivery of value', text: 'Continuous delivery of value is the primary measure of progress.' };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'sustainability', text: 'Agile processes promote sustainable delivery. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'technical excellence', text: 'Continuous attention to technical excellence and good design enhances agility.' };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'simplicity', text: 'Simplicity – the art of maximizing the amount of work not done – is essential.' };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'best design from the teams', text: 'The best architectures, requirements, and designs emerge from self-organizing teams enabled by organizational roadmaps and support.' };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'continuous improvement', text: 'The team continuously reflects on how to become more effective, then experiments, learns, and adjusts its behavior accordingly.' };
    pObj[++i]  = { id: '13', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'leverage and evolve enterprise assets', text: 'Leverage and evolve the assets within your enterprise, collaborating with the people responsible for those assets to do so.' };
    pObj[++i]  = { id: '14', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'visualize work', text: 'Visualize work to produce a smooth delivery flow and keep work-in-progress (WIP) to a minimum.' };
    pObj[++i]  = { id: '15', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'evolve the entire enterprise', text: 'Evolve the entire enterprise, not just individuals and teams, to support agile, non-agile, and hybrid teams.' };
    pObj[++i]  = { id: '16', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'automated measures for data-led decisions', text: 'We measure our work and its outcomes, preferring automated measures over manually gathered ones, to make data-led decisions.' };
    pObj[++i]  = { id: '17', type: 'principle', frameworkdisplay: 'DAD Manifesto', framework: 'dadmanifesto', shortdescription: 'transparency', text: 'We provide complete transparency to our stakeholders in everything we do and produce, to enable open and honest conversations and effective governance of our team.' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'delivery continuously', text: 'Deliver continuously' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'visualize workflow', text: 'Visualize workflow' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'whole teams', text: 'Whole teams' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'stable teams', text: 'Stable teams' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'trust & respect', text: 'Trust & respect' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'mastery', text: 'Master your craft' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'technical excellence', text: 'Technical excellence' };
    pObj[++i]  = { id: '8' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'collaboration', text: 'Collaboration' };
    pObj[++i]  = { id: '9' , type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'measure wisely', text: 'Measure wisely' };
    pObj[++i]  = { id: '10', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'transparency', text: 'Transparency' };
    pObj[++i]  = { id: '11', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'learn continuously', text: 'Learn continuously' };
    pObj[++i]  = { id: '12', type: 'principle', frameworkdisplay: 'DAD+', framework: 'dad+', shortdescription: 'purposeful experiments', text: 'Purposeful experiments' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'awesome', text: 'Make people awesome' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'deliver continuously', text: 'Deliver value continuously' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'safety', text: 'Make safety a prerequisite' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Modern Agile', framework: 'modern', shortdescription: 'experiment and learn', text: 'Experiment and learn rapidly' };
    pObj[++i]  = { id: '1' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'waste', text: 'Eliminate waste' };
    pObj[++i]  = { id: '2' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'quality', text: 'Build quality in' };
    pObj[++i]  = { id: '3' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'knowledge', text: 'Create knowledge' };
    pObj[++i]  = { id: '4' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'defer', text: 'Defer commitment' };
    pObj[++i]  = { id: '5' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'quickly', text: 'Deliver quickly' };
    pObj[++i]  = { id: '6' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'respect', text: 'Respect people' };
    pObj[++i]  = { id: '7' , type: 'principle', frameworkdisplay: 'Lean', framework: 'lean', shortdescription: 'optimize', text: 'Optimize the whole' };
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
function createSearchMap() {
  	const dataArray = getDataArray(); //full data array of all values and principle objects
    var searchMap = new Map(); //Map being built of a list of objects with keyword and location of the word
    var tempArray = new Array(); //temporary holding tank of keywords to be tested and added if not already there. if already there, then just add location to the end of the item on the search array
    var locationObj = new Object();
    var searchObj = new Object();

    for( const a of dataArray ) {
      //get the keywords from each a entry
      //go through and see if keyword is in the map
      //if yes, add location to the map object
      //if no, add new map entry with location in object
      tempArray = a.keywords;
      if(tempArray) {
        for( const kwd of tempArray ) {
          console.log('looking at object with keyword ' + kwd);
          searchObj = searchMap.get(kwd);
          if(!searchObj) { //the keyword is not already in the map, then add
            console.log('keywork ' + kwd + ' not already in search obj');
            locationObj = { framework: a.framework, type: a.type, id: a.id };
            var locations = new Array();
            locations.push(locationObj);
            searchObj = { keyword: kwd, locations: locations };
            searchMap.set(kwd, searchObj);
            console.log('added location ' + a.framework + ':' + a.type + ':' + a.id + ' to new search object ' + searchObj.keyword)
          } else { //add location to existing
            console.log('adding location ' + a.framework + ':' + a.type + ':' + a.id + ' to existing search object ' + searchObj.keyword);
            locationObj = { framework: a.framework, type: a.type, id: a.id };
            searchObj.locations.push(locationObj);
          }
        }
      }
    }
    return searchMap;
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

