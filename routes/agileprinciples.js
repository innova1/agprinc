var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET all agile principles */
router.get('/', function(req, res) {
    //console.log('in router get /' );
    const frameworksArray = db.getFrameworksArray();
    //db.getframeworks();
    //db.isIDInRange(framework, 30);
    res.render('agpris2', { title: 'Agile principles', frameworks: frameworksArray });
});

/* GET one framework of agile principles */
router.get('/:framework', function(req, res) {
    const framework = req.params.framework;
    const frameworksArray = db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = db.getPrinciplesArray(framework, '');
    const searchMap = db.getSearchArray(); //<--this should be changed to getSearchMap because it returnes a Map
    console.log('in router: len is ' + searchArray.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFramework', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, principlesArray: principlesArray, searchMap: searchMap });
});

router.get('/:framework/:type', function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    //console.log('in router get /:framework with ' + framework + ", " + type );
    const principlesArray = db.getPrinciplesArray(framework, type);
    res.render('agpris2', { title: 'Agile Principles', framework: framework, type: type, principlesArray: principlesArray });
});

/* GET specific agile principle */
router.get('/:framework/:type/:id', function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    const id = req.params.id;
    
    if( !isNaN(id) ) {
        if(db.isIDInRange(framework, type, id)) {
            const principleObj = db.getPrincipleByID(framework, type, id);
            res.json({id: id, principle: principleObj.text });
        } else {
            res.render('agpris', {id: id, principle: "error: id out of range"});
        }
    } 
});

/* GET agile principles */
/*
router.get('/', function(req, res) {
    const id = req.params[0];
	 if(id) {
         const principle = db.getPrincipleByID('manifesto', id);
         res.render('agpris', { title: 'Agile Principles List',  id: id, principle: principle });
	 } else {
         const principles = db.getPrinciplesObj('manifesto');
         console.log('short desc is ' + principles[1].shortdescription);
         res.render('agpris', { principlesObject: principles });
	}
});
*/

module.exports = router;
