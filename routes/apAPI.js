var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');
const srch = require('../controllers/searchController');

/* live search against keywords */
router.get('/keywords?', async function(req, res) {
	const debug = false;
	const searchText = req.query.keyword;
	if(debug) { console.log('in keyword search with ' + searchText) };
	const result = await db.getKeywordMatch(searchText);
	res.json({result: result});
});


/* Manage search functionality */
router.get('/searchterms', srch.getSearchTerms);

/* return filtered items for local update */
router.get('/search', srch.getFilteredItems);

/* return all agile principles as jason */
router.get('/', srch.getAllItems);


/* GET all agile principles json */
/*
router.get('/', function(req, res) {
	const debug = true;
	if(debug) { console.log('in /')};
    const frameworksArray = db.getFrameworksArray();
    console.log('in router get / with frameworks ' + frameworksArray );
    //db.getframeworks();
    //db.isIDInRange(framework, 30);
    res.json({ AFs: frameworksArray });
});
*/

/*
possible new model
api/agileframeworks/:framework/[principles|values]/:number
*/

/* GET frameworks of agile principles json */
/* not using
router.get('/frameworks/', function(req, res) {
    const frameworksArray = db.getframeworksArray();
    res.json({ "available frameworks": frameworksArray });
});
*/

/* GET one framework of agile principles json */
router.get('/:framework', function(req, res) {
    const framework = req.params.framework;
    //console.log('in router get /:framework with ' + framework );
    const principlesArray = db.getPrinciplesArray(framework, '');
    res.json({ principlesArray: principlesArray });
});

router.get('/:framework/:type', function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    //console.log('in router get /:framework with ' + framework + ", " + type );
    const principlesArray = db.getPrinciplesArray(framework, type);
    res.json({ principlesArray: principlesArray });
});

/*
router.get('/:framework/:type/numbers', function(req, res) {
    const framework = req.params.framework;
    const s = db.getNumbersArray( framework );
    res.json({ "available numbers": s });
});
*/

/* GET specific agile principle json */
router.get('/:framework/:type/:id', function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    const id = req.params.id;
    
    if( !isNaN(id) ) {
        if(db.isIDInRange(framework, type, id)) {
            const principleObj = db.getPrincipleByID(framework, type, id);
            res.json({id: id, principle: principleObj.text });
        } else {
            res.json({id: id, principle: "error: id out of range"});
        }
    } 
});


module.exports = router;
