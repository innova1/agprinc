var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles json */
router.get('/', function(req, res) {
    res.json({ principlesObject: principlesObj });
});

/* GET agile principles json */
router.get('/types/:type/ids/:id', function(req, res) {
    console.log('in router get with ' + req.params);
    const principlesObj = db.getPrinciplesObj('manifesto');
    /*
    if(id) {
        if(db.isIDInRange(type, id)) {
            const principle = db.getPrincipleByID(type, id);
            res.json({id: id, principle: principle });
        } else {
            res.json({id: id, principle: "err:out of range"});
        }
    } 
    */
});

module.exports = router;
