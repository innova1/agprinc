var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles json */
router.get('/', function(req, res) {
    const type = 'manifesto';
    const principlesObj = db.getPrinciplesObj(type);
    res.json({ principlesObject: principlesObj });
});

/* GET agile principles json */
router.get('/types/:type/ids/:id', function(req, res) {
    const type = req.params.type;
    const id = req.params.id;
    console.log('in router get with type ' + req.params.type + " and with id " + req.params.id );
    const principlesObj = db.getPrinciplesObj(type);
    
    if(id) {
        if(db.isIDInRange(type, id)) {
            const principle = db.getPrincipleByID(type, id);
            res.json({id: id, principle: principle });
        } else {
            res.json({id: id, principle: "err:out of range"});
        }
    } 
});

module.exports = router;
