var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var agprisRouter = require('./routes/agileprinciples');
var agprisApiRouter = require('./routes/apAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.basedir = '/projects/agileprinciples/agprinc';
app.use('/bootstrap', express.static(__dirname + '/node_modules/jade-bootstrap/'));

//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/agileframeworks/', agprisApiRouter);
app.use('/agileframeworks/', agprisRouter);

app.get('/**', function(req, res) {
	res.render('unknown', { title: "Unknown url", message: "You've reached a nonexistant page." });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
