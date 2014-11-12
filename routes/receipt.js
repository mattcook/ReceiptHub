var express = require('express');
var router = express.Router();
var tesseract = require('node-tesseract');
var fs = require('fs');
var exec = require('child_process').exec;
var fs = require('fs')
  , gm = require('gm');

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

router.post('/gps', function(req,res) {
  gm(req.files.image.path)
  .options({imageMagick: true})
  .identify('%[EXIF:*GPSLongitude*], %[EXIF:*GPSLatitude*]', function(err,gps) {
    fs.unlink(req.files.image.path);
    res.send(''+parseGPS(gps));
  });
});

router.get('/', function(req,res) {
  res.render('upload', { title: 'upload'})
});

function parseGPS(gps) {
  var jgps = gps.split("\n");

  var lon = jgps[0].replace("exif:GPSLongitude=","").split(",");
  var lat = jgps[2].replace(", ",'').replace("exif:GPSLatitude=","").split(",");

  var lon_d = jgps[1].replace("exif:GPSLongitudeRef=","");
  var lat_d = jgps[3].replace("exif:GPSLatitudeRef=","");

  var dd_lat = DMStoDD(lat,lat_d);
  var dd_lon = DMStoDD(lon,lon_d);

  return dd_lat+", "+dd_lon;
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
