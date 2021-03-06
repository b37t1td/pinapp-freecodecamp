var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var db = null;

app.use(session({ secret: 'PinAppCampsSess',
  saveUninitialized: true,
  resave : true,
   cookie: {
     secure: false,
     maxAge: 22909943600
   }
 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(function(req, res, next) {
	res.setHeader('Content-Type', 'application/json');
	next();
});

app.get('/', function(req,res) {
  res.redirect('/app/');
});


db = new require('./database')(function() {

  require('./auth')(app, db);
  require('./user')(app, db);
  require('./pins')(app, db);

  app.listen(process.env.PORT, function() {
    console.log('Application started on :' + process.env.PORT);
  });
});
