var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract');
var fs = require('fs');
var exec = require('child_process').exec;
var google = require('googlemaps');
var util = require('util');
var fs = require('fs')
  , gm = require('gm');

var receiptRef = fbRef.child("receipts");
var userRef = fbRef.child('users/1');

  router.get('/upload', function(req,res) {
    res.render('receipt/upload', { title: 'Upload'})
  })

  //Not needed for demo

  // .post('/ocr', function(req, res) {
  //   var ex_script = __dirname+"/../scripts/ocr.sh "+__dirname+"/../"+req.files.image.path
  //   exec(ex_script, function(error, stdout, stderr) {
  //   tesseract.process(req.files.image.path, function (err,text) {
  //     var pretty_text = text.split("\n").join(" ");
  //     fs.unlink(req.files.image.path);
  //     res.send(pretty_text);
  //     });
  //   });
  // })

  .post('/meta', function(req,res) {
    var tmp_file = req.files.image.path;

    gm(tmp_file)
    .options({imageMagick: true})
    .identify('%[EXIF:*GPSLongitude*]%[EXIF:*GPSLatitude*]%[EXIF:*DateTime*]', function(err,exif) {
      var meta = parseMetaData(exif);
      //add upload time
      google.reverseGeocode(meta.gps, function(err, data){
        meta.address = data.results[0].formatted_address;
        meta.upload = new Date();

        //Push receipt info to Firebase
        var newReceipt = receiptRef.push(meta);

        //create user receipt to attach when transaction is added
        userRef.child("receipts").child(newReceipt.key()).set(req.body.price);

        //upload image
        uploadImage(tmp_file, newReceipt.key());

        res.redirect("/transaction");
      });
    });
  });

function uploadImage(tmp_file, fileName){
  fs.readFile(tmp_file , function(err, data) {
    fs.writeFile("./uploads/"+fileName+".jpg", data, function(err) {
        fs.unlink(tmp_file, function(){
            if(err) throw err;
            return true;
        });
    });
  });
}

function parseMetaData(exif) {

  var meta = exif.split("\n");

  var lon = meta[0].replace("exif:GPSLongitude=","").split(",");
  var lat = meta[2].replace("exif:GPSLatitude=","").split(",");

  var lon_d = meta[1].replace("exif:GPSLongitudeRef=","");
  var lat_d = meta[3].replace("exif:GPSLatitudeRef=","");

  var dd_lat = DMStoDD(lat,lat_d);
  var dd_lon = DMStoDD(lon,lon_d);

  var date = meta[4].replace("exif:DateTime=","");

  var data = { gps: dd_lat+", "+dd_lon, date: date };
  return data;
}

function DMStoDD(dms, direction) {
  var d = dms[0].split('/');
  var m = dms[1].split('/');
  var s = dms[2].split('/');
  var dd = (d[0]/d[1] + (m[0]/m[1])/60 + (s[0]/s[1])/3600);

  if (direction == "S" || direction == "W"){
    dd = dd * -1
  }
  return dd;
}

module.exports = router;
