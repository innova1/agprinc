
exports.getPrincipleByID = function(framework, id) {
    //contract: next called with an id that is out of range -- call isIDInRange() first
	try {
		//console.log('in get prin by id with id=' + id + ', framework= ' + framework);
		//if( id > 12 || id < 1 ) { id = '1'; console.log('changed id to ' + id); }
		const parray = getPrinciplesArray(framework);
		var result = parray.find( e => e.id == id );
		return result;
	} catch (err) {
		console.log('error in try of get prin by id ' + err.message );
	}
};

exports.getPrinciplesArray = function(framework) {
    return getPrinciplesArray(framework);
};

function getPrinciplesArray(framework) {
    //console.log('in get prin obj export with framework ' + framework);
    const parray = getDataArray();
    let frameworkArray = new Array();
    if(framework=='') {
        frameworkArray = parray;
    } else {
        function isframework(o) {
            return o.framework == framework;
        }
        frameworkArray = parray.filter( isframework );
    }
	return frameworkArray;
};

exports.getframeworksArray = function() {
    //using a Set object so that duplicates are removed
    const p = getDataArray();
    const frameworks = new Set();
    const iterator = p.keys();
    for (const key of iterator ) {
        frameworks.add( p[key].framework );
    }
    return Array.from(frameworks);
};

exports.getNumbersArray = function( framework ) {
    const o = getSingleframeworkObj( framework );
    return o.idArray;
};

exports.isIDInRange = function(framework, id) {
    const o = getSingleframeworkObj(framework);
    return !( id < o.min || id > o.max );
};

function getSingleframeworkObj( framework ) {
    const singleframeworkObj = new Object();
    const a = getDataArray();
    function isframework(o) {
        return o.framework == framework;
    }
    singleframeworkObj.frameworks = a.filter( isframework );
    singleframeworkObj.idArray = new Array();
    singleframeworkObj.frameworks.forEach( e => singleframeworkObj.idArray.push(e.id) );
    singleframeworkObj.max = Math.max(...singleframeworkObj.idArray);
    singleframeworkObj.min = Math.min(...singleframeworkObj.idArray);
    return singleframeworkObj;
};

function getDataArray() {
    let pObj = new Array();
    let i = 0;
    pObj[i]    = { id: '1' , framework: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
    pObj[++i]  = { id: '2' , framework: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
    pObj[++i]  = { id: '3' , framework: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
    pObj[++i]  = { id: '4' , framework: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
    pObj[++i]  = { id: '5' , framework: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
    pObj[++i]  = { id: '6' , framework: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
    pObj[++i]  = { id: '7' , framework: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
    pObj[++i]  = { id: '8' , framework: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
    pObj[++i]  = { id: '9' , framework: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
    pObj[++i]  = { id: '10', framework: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
    pObj[++i]  = { id: '11', framework: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
    pObj[++i]  = { id: '12', framework: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    pObj[++i]  = { id: '1' , framework: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
    pObj[++i]  = { id: '2' , framework: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
    pObj[++i]  = { id: '3' , framework: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
    pObj[++i]  = { id: '4' , framework: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
    pObj[++i]  = { id: '5' , framework: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
    pObj[++i]  = { id: '6' , framework: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
    pObj[++i]  = { id: '7' , framework: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
    pObj[++i]  = { id: '8' , framework: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
    pObj[++i]  = { id: '9' , framework: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
    pObj[++i]  = { id: '10', framework: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    pObj[++i]  = { id: '1' , framework: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
    pObj[++i]  = { id: '2' , framework: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
    pObj[++i]  = { id: '3' , framework: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
    pObj[++i]  = { id: '4' , framework: 'dad', shortdescription: 'context', principle: 'Context counts' };
    pObj[++i]  = { id: '5' , framework: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
    pObj[++i]  = { id: '6' , framework: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
    pObj[++i]  = { id: '7' , framework: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    pObj[++i]  = { id: '1' , framework: 'daddiscipline', shortdescription: 'delivery continuously', principle: 'Deliver continuously' };
    pObj[++i]  = { id: '2' , framework: 'daddiscipline', shortdescription: 'visualize workflow', principle: 'Visualize workflow' };
    pObj[++i]  = { id: '3' , framework: 'daddiscipline', shortdescription: 'whole teams', principle: 'Whole teams' };
    pObj[++i]  = { id: '4' , framework: 'daddiscipline', shortdescription: 'stable teams', principle: 'Stable teams' };
    pObj[++i]  = { id: '5' , framework: 'daddiscipline', shortdescription: 'trust & respect', principle: 'Trust & respect' };
    pObj[++i]  = { id: '6' , framework: 'daddiscipline', shortdescription: 'mastery', principle: 'Master your craft' };
    pObj[++i]  = { id: '7' , framework: 'daddiscipline', shortdescription: 'technical excellence', principle: 'Technical excellence' };
    pObj[++i]  = { id: '8' , framework: 'daddiscipline', shortdescription: 'collaboration', principle: 'Collaboration' };
    pObj[++i]  = { id: '9' , framework: 'daddiscipline', shortdescription: 'measure wisely', principle: 'Measure wisely' };
    pObj[++i]  = { id: '10', framework: 'daddiscipline', shortdescription: 'transparency', principle: 'Transparency' };
    pObj[++i]  = { id: '11', framework: 'daddiscipline', shortdescription: 'learn continuously', principle: 'Learn continuously' };
    pObj[++i]  = { id: '12', framework: 'daddiscipline', shortdescription: 'purposeful experiments', principle: 'Purposeful experiments' };
    pObj[++i]  = { id: '1' , framework: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
    pObj[++i]  = { id: '2' , framework: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
    pObj[++i]  = { id: '3' , framework: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
    pObj[++i]  = { id: '4' , framework: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    pObj[++i]  = { id: '1' , framework: 'lean', shortdescription: 'waste', principle: 'Eliminate waste' };
    pObj[++i]  = { id: '2' , framework: 'lean', shortdescription: 'quality', principle: 'Build quality in' };
    pObj[++i]  = { id: '3' , framework: 'lean', shortdescription: 'knowledge', principle: 'Create knowledge' };
    pObj[++i]  = { id: '4' , framework: 'lean', shortdescription: 'defer', principle: 'Defer commitment' };
    pObj[++i]  = { id: '5' , framework: 'lean', shortdescription: 'quickly', principle: 'Deliver quickly' };
    pObj[++i]  = { id: '6' , framework: 'lean', shortdescription: 'respect', principle: 'Respect people' };
    pObj[++i]  = { id: '7' , framework: 'lean', shortdescription: 'optimize', principle: 'Optimize the whole' };
    return pObj;
};

/*
function getPrinciplesObject( framework ) {
    //console.log('in get principles function with framework ' + framework);
    let pObj = new Object();
    if( framework == 'manifesto') {
        pObj['1']  = { framework: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
        pObj['2']  = { framework: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
        pObj['3']  = { framework: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
        pObj['4']  = { framework: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
        pObj['5']  = { framework: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
        pObj['6']  = { framework: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
        pObj['7']  = { framework: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
        pObj['8']  = { framework: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
        pObj['9']  = { framework: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
        pObj['10'] = { framework: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
        pObj['11'] = { framework: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
        pObj['12'] = { framework: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    } else if( framework == 'safe' ) {
        pObj['1'] = { framework: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
        pObj['2'] = { framework: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
        pObj['3'] = { framework: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
        pObj['4']  = { framework: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
        pObj['5']  = { framework: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
        pObj['6']  = { framework: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
        pObj['7']  = { framework: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
        pObj['8']  = { framework: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
        pObj['9']  = { framework: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
        pObj['10'] = { framework: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    } else if( framework == 'dad' ) {
        pObj['1'] = { framework: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
        pObj['2'] = { framework: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
        pObj['3'] = { framework: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
        pObj['4']  = { framework: 'dad', shortdescription: 'context', principle: 'Context counts' };
        pObj['5']  = { framework: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
        pObj['6']  = { framework: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
        pObj['7']  = { framework: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    } else if( framework == 'modern' ) {
        pObj['1'] = { framework: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
        pObj['2'] = { framework: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
        pObj['3'] = { framework: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
        pObj['4']  = { framework: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    } else if( framework == 'lean' ) {
        pObj['1'] = { framework: 'dad', shortdescription: 'waste', principle: 'Eliminate waste' };
        pObj['2'] = { framework: 'dad', shortdescription: 'quality', principle: 'Build quality in' };
        pObj['3'] = { framework: 'dad', shortdescription: 'knowledge', principle: 'Create knowledge' };
        pObj['4']  = { framework: 'dad', shortdescription: 'defer', principle: 'Defer commitment' };
        pObj['5']  = { framework: 'dad', shortdescription: 'quickly', principle: 'Delivery quickly' };
        pObj['4']  = { framework: 'dad', shortdescription: 'respect', principle: 'Respect people' };
        pObj['5']  = { framework: 'dad', shortdescription: 'optimize', principle: 'Optimize the whole' };
    } else {
        ;
    }
    return pObj;
};
*/

