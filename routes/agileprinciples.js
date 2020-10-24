var express = require('express');
var router = express.Router();
const db = require('../controllers/dataController');
const kwd = require('../controllers/keywordController');
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

var Users = [];

app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup', function(req, res){
   if(!req.body.id || !req.body.password){
      res.status("400");
      res.send("Invalid details!");
   } else {
      Users.filter(function(user){
         if(user.id === req.body.id){
            res.render('signup', {
               message: "User Already Exists! Login or choose another user id"});
         }
      });
      var newUser = {id: req.body.id, password: req.body.password};
      Users.push(newUser);
      req.session.user = newUser;
      res.redirect('/protected_page');
   }
});

function checkSignIn(req, res){
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

app.get('/login', function(req, res){
   res.render('login');
});

app.post('/login', function(req, res){
   console.log(Users);
   if(!req.body.id || !req.body.password){
      res.render('login', {message: "Please enter both id and password"});
   } else {
      Users.filter(function(user){
         if(user.id === req.body.id && user.password === req.body.password){
            req.session.user = user;
            res.redirect('/protected_page');
         }
      });
      res.render('login', {message: "Invalid credentials!"});
   }
});

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/agileframeworks');
});

/* GET all agile principles */
router.get('/', function(req, res) {
    console.log('in router get /' );
    const frameworksArray = db.getFrameworksArray();
    //db.getframeworks();
    //db.isIDInRange(framework, 30);
    //res.render('agpris2', { title: 'Agile principles', frameworks: frameworksArray });
    res.redirect('/agileframeworks/all');
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
router.get('/keywords', kwd.displayKeywordList);

/* Edit keywords page */
router.get('/keywordEdit', kwd.editKeyword);

/* Save the updated keywords */
router.post('/keywordUpdate', kwd.updateKeywords);

/* search */
/* transferring to searchController
router.get('/search', async function(req, res) {
    const framework = req.params.framework;
    const searchterms = req.query.searchterms;
    //console.log('in search with framework-' + framework + ' and searchterms-' + decodeURI(searchterms));
	searchtermsArray = searchterms.split(',');
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = await db.getMatchedItems(searchtermsArray);
    //console.log('in router: len is ' + searchMap.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFrameworkBoot', { title: 'Agile Principles', searchterms: searchtermsArray, frameworks: frameworksArray, framework: framework, principlesArray: principlesArray });
});
*/

/* GET one framework of agile principles */
router.get('/all', async function(req, res) {
	const debug = false;
    //console.log('in router get /:framework');
    const framework = req.params.framework;
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = await db.getPrinciplesArray('', '');
    if(debug) { console.log('test length of array: ' + principlesArray.length); }
    const searchMap = await db.getSearchMap();
    //console.log('in router: len is ' + searchMap.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFrameworkBoot', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, principlesArray: principlesArray, searchMap: searchMap });
});

/* GET one framework of agile principles */
router.get('/:framework', async function(req, res) {
    //console.log('in router get /:framework');
    const framework = req.params.framework;
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework );
    //console.log('in router get /:framework with first frameworks principle ' + frameworksArray[0] );
    const principlesArray = await db.getPrinciplesArray(framework, '');
    const searchMap = await db.getSearchMap(); 
    //console.log('in router: len is ' + searchMap.length);
    //console.log('in :framework ' + principlesArray[1].text);
    res.render('agprisSelectedFrameworkBoot', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, principlesArray: principlesArray, searchMap: searchMap });
});

router.get('/:framework/:type', async function(req, res) {
    const framework = req.params.framework;
    const type = req.params.type;
    const frameworksArray = await db.getFrameworksArray();
    //console.log('in router get /:framework with ' + framework + ", " + type );
    const principlesArray = await db.getPrinciplesArray(framework, type);
    const searchMap = await db.getSearchMap(); 
    res.render('agprisSelectedFramework', { title: 'Agile Principles', frameworks: frameworksArray, framework: framework, type: type, principlesArray: principlesArray, searchMap: searchMap });
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

/* GET agile principles */
/*
router.get('/', function(req, res) {
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
*/

module.exports = router;
