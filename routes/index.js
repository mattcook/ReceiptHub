var express = require('express');
var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('login', { title: 'ReceiptHub' })
  })

  .post('/login', function(req, res) {
    //login AUTH
    res.redirect('/transactions')
  })

 .get('/transactions', function(req, res) {
   res.render('transactions', { title: 'Transactions'})
  })

  .get('/', function(req,res) {
    res.send('ReceiptHub')
  })

module.exports = router;
