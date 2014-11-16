var express = require('express');
var router = express.Router();

router
  .get('/login', function(req, res) {
    res.render('login', { layout: 'login', title: 'ReceiptHub' })
  })

  .post('/login', function(req, res) {
    if (req.body.email == "matt@receipthub.com"){
      req.session.uid = '1'
      res.redirect('/')
    }else {
      res.redirect('/login');
    }
  })

  .get('/', function(req,res) {
    if (req.session.uid){
      res.redirect('/transaction');
    }else{
      res.redirect('/login');
    }
  })

  .get('/logout', function(req,res){
    req.session.destroy(function(err) {
      res.redirect('/login');
    })
  })

  .get('/budget', function(req,res){
    res.render('budget/spending');
  });

module.exports = router;
