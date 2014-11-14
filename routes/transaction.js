var express = require('express');
var router = express.Router();
var transRef = fbRef.child("transactions");
var userRef = fbRef.child("users/1");

router
 .get('/', function(req, res) {
   res.render('transactions/', { title: 'User Transactions'})
  })

  .get('/add', function(req,res) {
    res.render('transactions/new', { title: 'Add Transaction'})
  })

  .post('/add', function(req,res) {
    var newTrans = transRef.push(req.body);
    userRef.child("transactions").child(newTrans.key()).set(true);

    connectReceipt(req.body.price, newTrans.key())
    res.redirect('/transaction');

  });

function connectReceipt( price, transactionID ) {
   userRef.child('receipts').once('value', function(snap) {
       if (snap.numChildren() == 1) {
         snap.forEach(function(receiptSnap){
           var receiptID = receiptSnap.key();
           transRef.child(transactionID).child('receipt').set(receiptID);
           userRef.child('receipts').child(receiptID).remove();
           return true;
         });
       }
   });
}

module.exports = router;
