
exports.getPrincipleByID = function(type, id) {
	try {
		//console.log('in get prin by id with id=' + id + ', type= ' + type);
		if( id > 12 || id < 1 ) { id = '1'; console.log('changed id to ' + id); }
		const p = getPrinciplesObject(type);
		var result = p[id].principle;
		return result;
	} catch (err) {
		console.log('error in try of get prin by id ' + err.message );
	}
};

exports.getPrinciplesObj = function(type) {
    //console.log('in get prin obj export with type ' + type);
	//const p = getPrinciplesObject(type);
    const p = getDataArray();
	return p;
};

exports.getTypes = function() {
    const p = getDataArray();
    const types = new Set();
    const iterator = p.keys();
    for (const key of iterator ) {
        types.add( p[key].type );
    }
    return types;
};

exports.isIDInRange = function(type, id) {
    console.log('in isIDInRange()');
    const a = getDataArray();
    console.log( 'comparing each with ' + type );
    function isType(o) {
        return o.type == type;
    }
    const typeArray = a.filter( isType );
    //test
    console.log('typeArray is size ' + typeArray.length);
    typeArray.forEach(element => console.log(element.id + ": " + element.principle));
    /*
    if(type == 'manifesto' && (id < 1 || id > 12) ) {
        return false;
    } else if( type == 'safe' && (id < 1 || id > 10 )) {
        return false;
    } else {
        return true;
    }
    */
};

function getPrinciplesObject( type ) {
    //console.log('in get principles function with type ' + type);
    let pObj = new Object();
    if( type == 'manifesto') {
        pObj['1']  = { type: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
        pObj['2']  = { type: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
        pObj['3']  = { type: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
        pObj['4']  = { type: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
        pObj['5']  = { type: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
        pObj['6']  = { type: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
        pObj['7']  = { type: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
        pObj['8']  = { type: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
        pObj['9']  = { type: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
        pObj['10'] = { type: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
        pObj['11'] = { type: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
        pObj['12'] = { type: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    } else if( type == 'safe' ) {
        pObj['1'] = { type: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
        pObj['2'] = { type: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
        pObj['3'] = { type: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
        pObj['4']  = { type: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
        pObj['5']  = { type: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
        pObj['6']  = { type: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
        pObj['7']  = { type: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
        pObj['8']  = { type: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
        pObj['9']  = { type: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
        pObj['10'] = { type: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    } else if( type == 'dad' ) {
        pObj['1'] = { type: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
        pObj['2'] = { type: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
        pObj['3'] = { type: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
        pObj['4']  = { type: 'dad', shortdescription: 'context', principle: 'Context counts' };
        pObj['5']  = { type: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
        pObj['6']  = { type: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
        pObj['7']  = { type: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    } else if( type == 'modern' ) {
        pObj['1'] = { type: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
        pObj['2'] = { type: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
        pObj['3'] = { type: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
        pObj['4']  = { type: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    } else if( type == 'lean' ) {
        pObj['1'] = { type: 'dad', shortdescription: 'waste', principle: 'Eliminate waste' };
        pObj['2'] = { type: 'dad', shortdescription: 'quality', principle: 'Build quality in' };
        pObj['3'] = { type: 'dad', shortdescription: 'knowledge', principle: 'Create knowledge' };
        pObj['4']  = { type: 'dad', shortdescription: 'defer', principle: 'Defer commitment' };
        pObj['5']  = { type: 'dad', shortdescription: 'quickly', principle: 'Delivery quickly' };
        pObj['4']  = { type: 'dad', shortdescription: 'respect', principle: 'Respect people' };
        pObj['5']  = { type: 'dad', shortdescription: 'optimize', principle: 'Optimize the whole' };
    } else {
        ;
    }
    return pObj;
};

function getDataArray() {
    let pObj = new Array();
    let i = 0;
    pObj[i]    = { id: '1' , type: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
    pObj[++i]  = { id: '2' , type: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
    pObj[++i]  = { id: '3' , type: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
    pObj[++i]  = { id: '4' , type: 'manifesto', shortdescription: 'daily with business', principle: 'Business people and developers must work together daily throughout the project.' };
    pObj[++i]  = { id: '5' , type: 'manifesto', shortdescription: 'motivated individuals', principle: 'Build projects around motivated individuals.  Give them the environment and support they need, and trust them to get the job done.' };
    pObj[++i]  = { id: '6' , type: 'manifesto', shortdescription: 'face to face conversation', principle: 'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.' };
    pObj[++i]  = { id: '7' , type: 'manifesto', shortdescription: 'progress is working software', principle: 'Working software is the primary measure of progress.' };
    pObj[++i]  = { id: '8' , type: 'manifesto', shortdescription: 'sustainability', principle: 'Agile processes promote sustainable development.  The sponsors, developers, and users should be able to maintain a constant pace indefinitely.' };
    pObj[++i]  = { id: '9' , type: 'manifesto', shortdescription: 'technical excellence', principle: 'Continuous attention to technical excellence and good design enhances agility.' };
    pObj[++i]  = { id: '10', type: 'manifesto', shortdescription: 'simplicity', principle: 'Simplicity--the art of maximizing the amount of work not done--is essential.' };
    pObj[++i]  = { id: '11', type: 'manifesto', shortdescription: 'design from the teams', principle: 'The best architectures, requirements, and designs emerge from self-organizing teams.' };
    pObj[++i]  = { id: '12', type: 'manifesto', shortdescription: 'continuous improvement', principle: 'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.' };
    pObj[++i]  = { id: '1' , type: 'safe', shortdescription: 'economic view', principle: 'Take an economic view' };
    pObj[++i]  = { id: '2' , type: 'safe', shortdescription: 'systems thinking', principle: 'Apply systems thinking' };
    pObj[++i]  = { id: '3' , type: 'safe', shortdescription: 'variability', principle: 'Assume variability; preserve options' };
    pObj[++i]  = { id: '4' , type: 'safe', shortdescription: 'incremental learning', principle: 'Build incrementally with fast, integrated learning cycles' };
    pObj[++i]  = { id: '5' , type: 'safe', shortdescription: 'working systems', principle: 'Base milestones on objective evaluation of working systems' };
    pObj[++i]  = { id: '6' , type: 'safe', shortdescription: 'flow', principle: 'Visualize and limit WIP, reduce batch sizes, and manage queue lengths' };
    pObj[++i]  = { id: '7' , type: 'safe', shortdescription: 'cadence', principle: 'Apply cadence, synchronize with cross-domain planning' };
    pObj[++i]  = { id: '8' , type: 'safe', shortdescription: 'intrinsic motivation', principle: 'Unlock the intrinsic motivation of knowledge workers' };
    pObj[++i]  = { id: '9' , type: 'safe', shortdescription: 'decentralize', principle: 'Decentralize decision-making' };
    pObj[++i]  = { id: '10', type: 'safe', shortdescription: 'value', principle: 'Organize around value' };
    pObj[++i]  = { id: '1' , type: 'dad', shortdescription: 'delight customers', principle: 'Delight Customers' };
    pObj[++i]  = { id: '2' , type: 'dad', shortdescription: 'be awesome', principle: 'Be awesome' };
    pObj[++i]  = { id: '3' , type: 'dad', shortdescription: 'pragmatism', principle: 'Pragmatism over purism' };
    pObj[++i]  = { id: '4' , type: 'dad', shortdescription: 'context', principle: 'Context counts' };
    pObj[++i]  = { id: '5' , type: 'dad', shortdescription: 'choice', principle: 'Choice is good' };
    pObj[++i]  = { id: '6' , type: 'dad', shortdescription: 'flow', principle: 'Optimize flow' };
    pObj[++i]  = { id: '7' , type: 'dad', shortdescription: 'enterprise', principle: 'Enterprise awareness' };
    pObj[++i]  = { id: '1' , type: 'modern', shortdescription: 'awesome', principle: 'Make people awesome' };
    pObj[++i]  = { id: '2' , type: 'modern', shortdescription: 'deliver continuously', principle: 'Deliver value continuously' };
    pObj[++i]  = { id: '3' , type: 'modern', shortdescription: 'safety', principle: 'Make safety a prerequisite' };
    pObj[++i]  = { id: '4' , type: 'modern', shortdescription: 'experiment and learn', principle: 'Experiment and learn rapidly' };
    pObj[++i]  = { id: '1' , type: 'lean', shortdescription: 'waste', principle: 'Eliminate waste' };
    pObj[++i]  = { id: '2' , type: 'lean', shortdescription: 'quality', principle: 'Build quality in' };
    pObj[++i]  = { id: '3' , type: 'lean', shortdescription: 'knowledge', principle: 'Create knowledge' };
    pObj[++i]  = { id: '4' , type: 'lean', shortdescription: 'defer', principle: 'Defer commitment' };
    pObj[++i]  = { id: '5' , type: 'lean', shortdescription: 'quickly', principle: 'Delivery quickly' };
    pObj[++i]  = { id: '6' , type: 'lean', shortdescription: 'respect', principle: 'Respect people' };
    pObj[++i]  = { id: '7' , type: 'lean', shortdescription: 'optimize', principle: 'Optimize the whole' };
    return pObj;
};


