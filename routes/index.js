var express = require('express');
var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('login', { title: 'ReceiptHub' })
  })

  .post('/login', function(req, res) {
    res.redirect('/transactions')
  })

  .get('/', function(req,res) {
    res.redirect('/login')
  })

module.exports = router;
