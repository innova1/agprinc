var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles json */
router.get('/*', function(req, res) {
    const type = req.params[0];
    const id = req.params[1];
    console.log('in router get with type ' + type + ' and id ' + id);
    const principlesObj = db.getPrinciplesObj(type);
    
    if(id) {
        if(db.isIDInRange(type, id)) {
            const principle = db.getPrincipleByID(type, id);
            res.json({id: id, principle: principle });
        } else {
            res.json({id: id, principle: "err:out of range"});
        }
    } else {
        console.log('short desc is ' + principlesObj[1].shortdescription);
        res.json({ principlesObject: principlesObj });
    }
});

module.exports = router;
