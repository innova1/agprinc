var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET all agile principles json */
router.get('/', function(req, res) {
    console.log('in router get /' );
    const type = 'manifesto';
    const principlesArray = db.getPrinciplesArray(type);
    //db.getTypes();
    //db.isIDInRange(type, 30);
    res.json({ principlesArray: principlesArray });
});

/* GET one type of agile principles json */
router.get('/types/:type', function(req, res) {
    //console.log('in router get /types/:type' );
    const type = req.params.type;
    const principlesArray = db.getPrinciplesArray(type);
    res.json({ principlesArray: principlesArray });
});

/* GET specific agile principle json */
router.get('/types/:type/ids/:id', function(req, res) {
    const type = req.params.type;
    const id = req.params.id;
    //console.log('in router get with type ' + req.params.type + " and with id " + req.params.id );
    const principlesObj = db.getPrinciplesArray(type);
    
    if(id) {
        if(db.isIDInRange(type, id)) {
            const principle = db.getPrincipleByID(type, id);
            res.json({id: id, principle: principle });
        } else {
            res.json({id: id, principle: "error: id out of range"});
        }
    } 
});

module.exports = router;
