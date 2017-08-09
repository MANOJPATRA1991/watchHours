var express = require('express');
var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var TVDB = require('node-tvdb');
var async = require('async');
var mongoose = require('mongoose');
//set up passport
var passport = require('passport');
var config = require('./config');
//require authenticate.js file
var authenticate = require('./authenticate');


mongoose.connect(config.mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    //we're connected
    console.log("Connected correctly to the server");
});


var index = require('./routes/index');
var users = require('./routes/users');
var showRouter = require('./routes/showRouter');
var episodeRouter = require('./routes/episodeRouter');
var actorsRouter = require('./routes/actorsRouter');
var posterRouter = require('./routes/posterRouter');
var subscription = require('./routes/subscription');
var app = express();

//Secure traffic only
app.all('*', function(req, res, next){
   if(req.secure){
       return next();
   };
    res.redirect('https://watch-hours.herokuapp.com');
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//passport config
//middleware required to initialize passport
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));


// define routes
app.use('/', index);
app.use('/users', users);
app.use('/shows', showRouter);
app.use('/episodes', episodeRouter);
app.use('/actors', actorsRouter)
app.use('/posters', posterRouter);
app.use('/subscription', subscription);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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