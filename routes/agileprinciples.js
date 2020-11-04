'use strict;'

var express = require('express');
//var app = express();
var router = express.Router();
const db = require('../controllers/dataController');
const kwd = require('../controllers/keywordController');
var session = require('express-session');
var cookieParser = require('cookie-parser');
//const tools = require('../controllers/tools');

router.use(cookieParser());
router.use(session({
	secret: '4$dcf#',
	resave: true,
	saveUninitialized: true
}));

var Users = [];

//this route get is here to block real signup --remove to let work
router.get('/signup', function(req, res) {
	res.redirect('/agileframeworks');
});

router.post('/signup', function(req, res) {
	res.redirect('/agileframeworks');
});

router.get('/signup', function(req, res){
   res.render('signup', { message: "Sign up for access."});
});

router.post('/signup', function(req, res){
	console.log('in signup')
	if(!req.body.id || !req.body.password) {
		res.status("400");
		res.send("Invalid details!");
	} else {
		Users.filter( function(user) {
			if(user.id === req.body.id) {
				res.render('signup', { message: "User Already Exists! Login or choose another user id" });
			}
	});
	var newUser = {id: req.body.id, password: req.body.password};
	Users.push(newUser);
	req.session.user = newUser;
	//res.redirect('/agileframeworks') //temp to not all to keywords
	res.redirect('/agileframeworks/keywords');
   }
});

function checkSignIn(req, res, next){
   if(req.session.user){
	   next();     //If session exists, proceed to page 
   } else {
		var err = new Error("Not logged in!");
		console.log(req.session.user);
		//next(err);  //Error, trying to access unauthorized page! 
		//res.render('signup', { message: "Sign up for access."}); //temporary fail
	   res.render('unknown', { title: "Unknown url", message: "You've reached a nonexistant page." });
   }
}

router.get('/login', function(req, res){
   res.render('login', { message: "Log in for access."});
});

router.post('/login', function(req, res){
	console.log("users: " + Users);
	if( !req.body.id || !req.body.password ) {
		res.render('login', { message: "Please enter both id and password" });
	} else {
		console.log('id:'+req.body.id+', pwd:'+req.body.password)
		//added temporarily to let just me login hard coded
		if(req.body.id === 'tboulet' && req.body.password === 'app44word') {
			console.log('match')
			req.session.user = '{id: "tboulet", password: "app44word" }';
			res.redirect( '/agileframeworks/keywords' );
		} else {
		/* commented out temporarily ***
		Users.filter( function(user) {
			if(user.id === req.body.id && user.password === req.body.password) {
				console.log('match')
				req.session.user = user;
				res.redirect( '/agileframeworks/keywords' );
			}
		});
		*/
			res.render('login', { message: "Invalid credentials!"} );
		}
	}
});

router.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/agileframeworks');
});

/* test db */
router.get('/testdb', async function(req, res) {
    console.log('in test db router');
    const el = await db.testdb();
    res.render('test', { title: 'Test page', record: el });
});

router.get('/testboot', function(req, res) {
    res.render('testboot', { title: 'testing bootstrap' });
});

/* View edit keywords page */
router.get('/keywords', checkSignIn, kwd.displayKeywordList);

/* Edit keywords page */
router.get('/keywordEdit', checkSignIn, kwd.editKeyword);

/* Save the updated keywords */
router.post('/keywordUpdate', checkSignIn, kwd.updateKeywords);

router.get('/', function(req, res) {
	res.render('agprisSelectedFrameworkBoot');
});

/* GET one framework of agile principles */
router.get('/:framework', async function(req, res) {
    //console.log('in router get /:framework');
    const framework = req.params.framework;
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = await db.getPrinciplesArray(framework, '');
    const keywordItemFinderMap = await db.keywordItemFinderMap(); 
    //console.log('in router: len is ' + keywordItemFinderMap.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFrameworkBoot', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, principlesArray: principlesArray, keywordItemFinderMap: keywordItemFinderMap });
});

router.get('/:framework/:type', async function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework + ", " + type );
    const principlesArray = await db.getPrinciplesArray(framework, type);
    const keywordItemFinderMap = await db.keywordItemFinderMap(); 
    res.render('agprisSelectedFramework', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, type: type, principlesArray: principlesArray, keywordItemFinderMap: keywordItemFinderMap });
});

/* GET specific agile principle */
router.get('/:framework/:type/:id', function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    const id = req.params.id;
    
    if( !isNaN(id) ) {
        if(db.isIDInRange(framework, type, id)) {
            const principleObj = db.getPrincipleByID(framework, type, id);
            res.json({id: id, principle: principleObj.text });
        } else {
            res.render('agpris', {id: id, principle: "error: id out of range"});
        }
    } 
});

router.get('/**', function(req, res) {
	res.render('unknown', { title: "Unknown url", message: "You've reached a nonexistant page." });
});

module.exports = router;
