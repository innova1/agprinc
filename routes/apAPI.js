var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles json */
router.get('/*', function(req, res) {
      const id = req.params[0];
      const type = 'manifesto';
      if(id==0 || id == null) {
          const principlesObj = db.getPrinciplesObj();
      } else {
          const principle = db.getPrincipleByID(type, id);
      }
  

    if(id) {
        res.json({id: id, principle: principlesObj[id].principle });
    } else {
        const principles = db.getPrinciplesObj('manifesto');
        console.log('short desc is ' + principlesObj[1].shortdescription);
        res.json({ principlesObject: principlesObj });
    }
});

module.exports = router;
