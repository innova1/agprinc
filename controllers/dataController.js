
exports.getPrincipleByID = function(type, id) {
	try {
		console.log('in get prin by id with id=' + id + ', type= ' + type);
		if( id > 12 || id < 1 ) { id = '1'; console.log('changed id to ' + id); }
		const p = getPrinciplesObject(type);
		var result = p[id].principle;
		return result;
	} catch (err) {
		console.log('error in try of get prin by id ' + err.message );
	}
};

exports.getPrinciplesObj = function(type) {
    console.log('in get prin obj export with type ' + type);
	const p = getPrinciplesObject(type);
	return p;
};

exports.isIDInRange = function(type, id) {
    if(type == 'manifesto' && (id < 1 || id > 12) ) {
        return false;
    } else if( type == 'safe' && (id < 1 || id > 10 )) {
        return false;
    } else {
        return true;
    }
};

function getPrinciplesObject( type ) {
    console.log('in get principles function with type ' + type);
    let pObj = new Object();
    if( type == 'manifesto') {
        pObj['1'] = { type: 'manifesto', shortdescription: 'continuous delivery', principle: 'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.' };
        pObj['2'] = { type: 'manifesto', shortdescription: 'welcome change', principle: 'Welcome changing requirements, even late in development. Agile processes harness change for the customer\'s competitive advantage.' };
        pObj['3'] = { type: 'manifesto', shortdescription: 'deliver frequently', principle: 'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.' };
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
    } else {
        ;
    }
    return pObj;
};



