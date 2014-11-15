var express = require('express'),
    exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer');
var Firebase = require("firebase");


//FIREBASE
fbRef = new Firebase("https://receipthub.firebaseio.com/");

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
app.use(multer({ dest: './uploads'}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

//Routes
var index = require('./routes/index');
var receipt = require('./routes/receipt');
var transaction = require('./routes/transaction');

app.use('/', index);
app.use('/receipt', receipt);
app.use('/transaction', transaction);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
// // error handlers
//
// // development error handler
// // will print stacktrace
// if (app.get('env') === 'development') {
//     app.use(function(err, req, res, next) {
//         res.status(err.status || 500);
//         res.render('error', {
//             message: err.message,
//             error: err
//         });
//     });
// }
//
// // production error handler
// // no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });
//

module.exports = app;
