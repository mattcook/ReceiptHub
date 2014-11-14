var express = require('express');
var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('login', { title: 'ReceiptHub' })
  })

  .post('/login', function(req, res) {
    res.redirect('/transaction')
  })

  .get('/', function(req,res) {
    //res.redirect('/login')
    res.render('login', { layout: 'login', title: 'ReceiptHub' })
  })

module.exports = router;
