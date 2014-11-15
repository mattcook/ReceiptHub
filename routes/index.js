var express = require('express');
var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('/login/login', { layout: 'login', title: 'ReceiptHub' })
  })

  .post('/login', function(req, res) {
    res.redirect('/transaction')
  })

  .get('/', function(req,res) {
    res.redirect('/login')

  })

  .get('/budget', function(req,res){
    res.render('budget/spending');
  });

module.exports = router;
