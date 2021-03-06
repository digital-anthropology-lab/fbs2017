require('dotenv').config()

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var exphbs = require('express-handlebars')
var handlebars = require('handlebars')
handlebars.registerHelper('date', require('helper-date'));
var helpers = require('handlebars-helpers')({
  handlebars: handlebars
});

var hbs = exphbs.create({
  helpers: helpers,
  defaultLayout: 'main.hbs'
});

var app = express();
var io = app.io = require("socket.io")();

// App wide view variables
app.locals.port = process.env.PORT

// routes
var routes = require('./routes/index')(io);
var assets = require('./routes/assets')(io);
var users = require('./routes/users')(io);
var streams = require('./routes/streams')(io);
var jobs = require('./routes/jobs')(io);

// view engine setup
app.engine('.hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/assets', assets);
app.use('/users', users);
app.use('/streams', streams);
app.use('/jobs', jobs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
