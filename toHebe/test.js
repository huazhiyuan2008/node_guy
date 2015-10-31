/**
 * Created by jameson on 10/31/15.
 * fs superagent stream
 */

var superagent = require('superagent')
  , fs = require('fs');
var crypto = require('crypto');

var url = 'http://imgsrc.baidu.com/forum/w%3D580/sign=5b8b0c23f003738dde4a0c2a831ab073/fffb81cb39dbb6fdb0ec96a50f24ab18962b379b.jpg';

//var req = superagent.get('http://imgsrc.baidu.com/forum/w%3D580/sign=f8ea25ea232dd42a5f0901a3333a5b2f/a4f062d9f2d3572c3e1fec5f8c13632763d0c351.jpg');
//var req = superagent.get('http://imgsrc.baidu.com/forum/w%3D580/sign=5b8b0c23f003738dde4a0c2a831ab073/fffb81cb39dbb6fdb0ec96a50f24ab18962b379b.jpg');
//  .end(function (err, res) {
//  console.log("err=" + err);
//  console.log("res=" + res);
//});

//req.type('json');
//stream.pipe(req);

//
//superagent.get('http://www.baidu.com')
//  .end(function (err, res) {
//  console.log("err=" + err);
//  console.log("res=" + res.text);
//});

var dir = './images';

var start = function(url) {
  var filePath = dir + "/" + getMd5(url) + ".jpg";
  console.log('正在下载' + url + "---->" + filePath);
  var stream = fs.createWriteStream(filePath);
  //var stream = fs.createWriteStream('./output/' + getMd5(url) + '.jpg');
  superagent.get(url).pipe(stream);
};

var downloadUrl = function(url) {
  var filePath = dir + "/" + getMd5(url) + ".jpg";
  console.log('正在下载' + url + "---->" + filePath);
  var stream = fs.createWriteStream(filePath);
  superagent.get(url).pipe(stream);
  console.log('下载完成');
};

var getMd5 = function(content) {
  var md5 = crypto.createHash('md5');
  md5.update(content);
  var d = md5.digest('hex');
  return d;
};

downloadUrl(url);
//start(url);