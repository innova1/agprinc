var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles json */
router.get('/*', function(req, res) {
  const id = req.params[0];
  const type = 'manifesto';
  const principle = db.getPrincipleByID(type, id);
  const principlesObj = db.getPrinciplesObj();

  if(id) {
	res.json({id: id, principle: principlesObj[id].principle });
  } else {
	const principles = db.getPrinciplesObj('manifesto');
	console.log('short desc is ' + principlesObj[1].shortdescription);
  	res.json({ principlesObject: principlesObj });
  }
});

module.exports = router;
