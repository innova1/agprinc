var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');

/* GET agile principles */
router.get('/*', function(req, res) {
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

module.exports = router;
