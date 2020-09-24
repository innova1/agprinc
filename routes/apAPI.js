var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET all agile principles json */
router.get('/', function(req, res) {
    //console.log('in router get /' );
    const principlesArray = db.getPrinciplesArray('');
    //db.getTypes();
    //db.isIDInRange(type, 30);
    res.json({ principlesArray: principlesArray });
});

/* GET types of agile principles json */
router.get('/types/', function(req, res) {
    const typesArray = db.getTypesArray();
    res.json({ typesArray: typesArray });
});

/* GET one type of agile principles json */
router.get('/types/:type', function(req, res) {
    //console.log('in router get /types/:type' );
    const type = req.params.type;
    const principlesArray = db.getPrinciplesArray(type);
    res.json({ principlesArray: principlesArray });
});

router.get('/types/:type/numbers', function(req, res) {
    const type = req.params.type;
    const s = db.getNumbersArray( type );
    res.json({ test: s });
});

/* GET specific agile principle json */
router.get('/types/:type/numbers/:id', function(req, res) {
    const type = req.params.type;
    const id = req.params.id;
    //console.log('in router get with type ' + req.params.type + " and with id " + req.params.id );
    const principlesObj = db.getPrinciplesArray(type);
    
    if(id) {
        if(db.isIDInRange(type, id)) {
            const principleObj = db.getPrincipleByID(type, id);
            res.json({id: id, principle: principleObj.principle });
        } else {
            res.json({id: id, principle: "error: id out of range"});
        }
    } 
});

module.exports = router;
