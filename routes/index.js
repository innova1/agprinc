var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome', message: 'This site hosts several applications.', mainurl: '/agileframeworks/', alink: 'Feel free to try this one.' });
});

module.exports = router;
