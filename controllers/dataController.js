
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
    } else {
        function isFrameworkAndType(o) {
            return o.framework == framework && o.type == type.substring(0,type.length-1);
        }
        principlesArray = parray.filter( isFrameworkAndType );
    }
    //console.log('about to export prin array with length ' + principlesArray.length);
	return principlesArray;
};

exports.getFrameworksArray = function() {
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

exports.isIDInRange = function( framework, type, id ) {
    const o = getSingleFrameworkTypeIdObj( framework, type, id );
    return !( id < o.min || id > o.max );
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

function getDataArray() {
    let pObj = new Array();
    let i = 0;
    pObj[i]    = { id: '1' , type: 'principle', framework: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
    pObj[++i]  = { id: '8' , type: 'principle', framework: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
    pObj[++i]  = { id: '9' , type: 'principle', framework: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
    pObj[++i]  = { id: '10', type: 'principle', framework: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
    pObj[++i]  = { id: '11', type: 'principle', framework: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
    pObj[++i]  = { id: '12', type: 'principle', framework: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    pObj[++i]  = { id: '1' , type: 'value', framework: 'manifesto', shortdescription: 'individuals and interactions', principle: 'Individuals and interactions over processes and tools' };
    pObj[++i]  = { id: '2' , type: 'value', framework: 'manifesto', shortdescription: 'deliver frequently', principle: 'Working software over comprehensive documentation' };
    pObj[++i]  = { id: '3' , type: 'value', framework: 'manifesto', shortdescription: 'collaboration', principle: 'Customer collaboration over contract negotiation' };
    pObj[++i]  = { id: '4' , type: 'value', framework: 'manifesto', shortdescription: 'respond to change', principle: 'Responding to change over following a plan' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
    pObj[++i]  = { id: '8' , type: 'principle', framework: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
    pObj[++i]  = { id: '9' , type: 'principle', framework: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
    pObj[++i]  = { id: '10', type: 'principle', framework: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    pObj[++i]  = { id: '1' , type: 'value', framework: 'safe', shortdescription: 'alignment', principle: 'Alignment' };
    pObj[++i]  = { id: '2' , type: 'value', framework: 'safe', shortdescription: 'built-in quality', principle: 'Built-in quality' };
    pObj[++i]  = { id: '3' , type: 'value', framework: 'safe', shortdescription: 'transparency', principle: 'Transparency' };
    pObj[++i]  = { id: '4' , type: 'value', framework: 'safe', shortdescription: 'program execution', principle: 'Program execution' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'dad', shortdescription: 'context', principle: 'Context counts' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    pObj[++i]  = { id: '1' , type: 'value', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'Individuals and interactions over processes and tools' };
    pObj[++i]  = { id: '2' , type: 'value', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'Consumable solutions over comprehensive documentation' };
    pObj[++i]  = { id: '3' , type: 'value', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'Stakeholder collaboration over contract negotiation' };
    pObj[++i]  = { id: '4' , type: 'value', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'Responding to feedback over following a plan' };
    pObj[++i]  = { id: '5' , type: 'value', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'Transparency over (false) predictability' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '8' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '9' , type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '10', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '11', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '12', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '13', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '14', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '15', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '16', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '17', type: 'principle', framework: 'dadmanifesto', shortdescription: 'todo', principle: 'todo' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'dad+', shortdescription: 'delivery continuously', principle: 'Deliver continuously' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'dad+', shortdescription: 'visualize workflow', principle: 'Visualize workflow' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'dad+', shortdescription: 'whole teams', principle: 'Whole teams' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'dad+', shortdescription: 'stable teams', principle: 'Stable teams' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'dad+', shortdescription: 'trust & respect', principle: 'Trust & respect' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'dad+', shortdescription: 'mastery', principle: 'Master your craft' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'dad+', shortdescription: 'technical excellence', principle: 'Technical excellence' };
    pObj[++i]  = { id: '8' , type: 'principle', framework: 'dad+', shortdescription: 'collaboration', principle: 'Collaboration' };
    pObj[++i]  = { id: '9' , type: 'principle', framework: 'dad+', shortdescription: 'measure wisely', principle: 'Measure wisely' };
    pObj[++i]  = { id: '10', type: 'principle', framework: 'dad+', shortdescription: 'transparency', principle: 'Transparency' };
    pObj[++i]  = { id: '11', type: 'principle', framework: 'dad+', shortdescription: 'learn continuously', principle: 'Learn continuously' };
    pObj[++i]  = { id: '12', type: 'principle', framework: 'dad+', shortdescription: 'purposeful experiments', principle: 'Purposeful experiments' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    pObj[++i]  = { id: '1' , type: 'principle', framework: 'lean', shortdescription: 'waste', principle: 'Eliminate waste' };
    pObj[++i]  = { id: '2' , type: 'principle', framework: 'lean', shortdescription: 'quality', principle: 'Build quality in' };
    pObj[++i]  = { id: '3' , type: 'principle', framework: 'lean', shortdescription: 'knowledge', principle: 'Create knowledge' };
    pObj[++i]  = { id: '4' , type: 'principle', framework: 'lean', shortdescription: 'defer', principle: 'Defer commitment' };
    pObj[++i]  = { id: '5' , type: 'principle', framework: 'lean', shortdescription: 'quickly', principle: 'Deliver quickly' };
    pObj[++i]  = { id: '6' , type: 'principle', framework: 'lean', shortdescription: 'respect', principle: 'Respect people' };
    pObj[++i]  = { id: '7' , type: 'principle', framework: 'lean', shortdescription: 'optimize', principle: 'Optimize the whole' };
    return pObj;
};

/*
function getPrinciplesObject( framework ) {
    //console.log('in get principles function with framework ' + framework);
    let pObj = new Object();
    if( framework == 'manifesto') {
        pObj['1']  = { type: 'principle', framework: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
        pObj['2']  = { type: 'principle', framework: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
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

