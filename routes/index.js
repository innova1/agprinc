var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'This site hosts several applications.', mainurl: '/agileframeworks/', alink: 'You can try this one.' });
});

module.exports = router;
