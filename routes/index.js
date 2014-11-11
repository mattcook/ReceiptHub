var express = require('express');
var tesseract = require('node-tesseract');
var fs = require('fs');
var exec = require('child_process').exec;
var router = express.Router();

router.post('/parse', function(req, res) {
   var ex_script = __dirname+"/../scripts/ocr.sh "+__dirname+"/../"+req.files.image.path
   exec(ex_script, function(error, stdout, stderr) {
    tesseract.process(req.files.image.path, function (err,text) {
      var pretty_text = text.split("\n").join(" ");

      fs.unlink(req.files.image.path);

      console.log(pretty_text);

    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'ReceiptHub' });
});

router.post('/login', function(req, res) {
  res.redirect('/transactions');
});

router.get('/transactions', function(req, res) {
    res.render('transactions', { title: 'Transactions'})
});

module.exports = router;
