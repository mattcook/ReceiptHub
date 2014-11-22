var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var Firebase = require("firebase");
var session = require('express-session')

//FIREBASE
fbRef = new Firebase("https://receipthub.firebaseio.com");

var app = express();

// view engine setup
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'index'}));
app.set('view engine', '.hbs');

app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './public/uploads'}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({secret: 'Receipt123',
                saveUninitialized: true,
                 resave: true
               }
               ));

//Routes
var index = require('./routes/index');
var receipt = require('./routes/receipt');
var transaction = require('./routes/transaction');

app.use('/', index);
app.use('/receipt', receipt);
app.use('/transaction', transaction);

module.exports = app;
