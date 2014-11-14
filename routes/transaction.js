var express = require('express');
var router = express.Router();
var transRef = fbRef.child("transactions");
var userRef = fbRef.child("users/1");

router
 .get('/', function(req, res) {
   res.render('transactions/', { title: 'User Transactions'})
  })

  .get('/add', function(req,res) {
    res.render('transactions/add', { title: 'Add Transaction'})
  })

  .post('/add', function(req,res) {
    var newTrans = transRef.push(req.body);
    userRef.child("transactions").child(newTrans.key()).set(true);
    res.redirect("/transaction");
  });

module.exports = router;
