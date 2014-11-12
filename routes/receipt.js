var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract');
var fs = require('fs');
var exec = require('child_process').exec;
var google = require('googlemaps');
var util = require('util');
var fs = require('fs')
  , gm = require('gm');


  router.get('/', function(req,res) {
    res.render('upload', { title: 'upload'})
  })

  .post('/parse', function(req, res) {
   var ex_script = __dirname+"/../scripts/ocr.sh "+__dirname+"/../"+req.files.image.path
   exec(ex_script, function(error, stdout, stderr) {
    tesseract.process(req.files.image.path, function (err,text) {
      var pretty_text = text.split("\n").join(" ");
      fs.unlink(req.files.image.path);
      console.log(pretty_text);
      });
    });
  })

  .post('/gps', function(req,res) {
    gm(req.files.image.path)
    .options({imageMagick: true})
    .identify('%[EXIF:*GPSLongitude*]%[EXIF:*GPSLatitude*]%[EXIF:*DateTime*]', function(err,exif) {
      fs.unlink(req.files.image.path);
      var meta = parseMetaData(exif);
      google.reverseGeocode(meta.gps, function(err, data){
        meta.address = data.results[0].formatted_address;
        res.send(meta);
      });
    });
  });

function parseMetaData(exif) {

  var meta = exif.split("\n");

  var lon = meta[0].replace("exif:GPSLongitude=","").split(",");
  var lat = meta[2].replace("exif:GPSLatitude=","").split(",");

  var lon_d = meta[1].replace("exif:GPSLongitudeRef=","");
  var lat_d = meta[3].replace("exif:GPSLatitudeRef=","");

  var dd_lat = DMStoDD(lat,lat_d);
  var dd_lon = DMStoDD(lon,lon_d);

  var time = meta[4].replace("exif:DateTime=","");

  var data = { gps: dd_lat+", "+dd_lon, time: time };
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
