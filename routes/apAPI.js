var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET all agile principles json */
router.get('/', function(req, res) {
    //console.log('in router get /' );
    const frameworksArray = db.getFrameworksArray();
    //db.getframeworks();
    //db.isIDInRange(framework, 30);
    res.json({ "Agile Frameworks": frameworksArray });
});

/*
possible new model
api/agileframeworks/:framework/[principles|values]/:number
*/

/* GET frameworks of agile principles json */
router.get('/frameworks/', function(req, res) {
    const frameworksArray = db.getframeworksArray();
    res.json({ "available frameworks": frameworksArray });
});

/* GET one framework of agile principles json */
router.get('/:framework', function(req, res) {
    //console.log('in router get /frameworks/:framework' );
    const framework = req.params.framework;
    const principlesArray = db.getPrinciplesArray(framework, '');
    res.json({ principlesArray: principlesArray });
});

router.get('/frameworks/:framework/types', function(req, res) {
    const framework = req.params.framework;
    const s = db.getTypesArray( framework, type );
    res.json({ "available numbers": s });
});

router.get('/frameworks/:framework/types/:type', function(req, res) {
    //console.log('in router get /frameworks/:framework' );
    const framework = req.params.framework;
    const principlesArray = db.getPrinciplesArray(framework);
    res.json({ principlesArray: principlesArray });
});

router.get('/frameworks/:framework/types/:type/numbers', function(req, res) {
    const framework = req.params.framework;
    const s = db.getNumbersArray( framework );
    res.json({ "available numbers": s });
});

/* GET specific agile principle json */
router.get('/frameworks/:framework/types/:type/numbers/:id', function(req, res) {
    const framework = req.params.framework;
    const id = req.params.id;
    //console.log('in router get with framework ' + req.params.framework + " and with id " + req.params.id );
    const principlesObj = db.getPrinciplesArray(framework);
    
    if(id) {
        if(db.isIDInRange(framework, id)) {
            const principleObj = db.getPrincipleByID(framework, id);
            res.json({id: id, principle: principleObj.principle });
        } else {
            res.json({id: id, principle: "error: id out of range"});
        }
    } 
});

module.exports = router;
