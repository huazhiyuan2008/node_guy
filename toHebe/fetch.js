//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var crypto = require('crypto');

//目标网址
var url = 'http://me2-sex.lofter.com/tag/美女摄影?page=1';

//本地存储目录
var dir = './images';

//创建目录
mkdirp(dir, function(err) {
  console.log('mkdir===' + dir);
  if(err){
    console.log(err);
  }
});

//发送请求
request(url, function(error, response, body) {
  if(!error && response.statusCode == 200) {
    var $ = cheerio.load(body);
    var max = 2;
    var index = 0;

    $('.img img').each(function() {
      if (index++ >= max && max > 0) {
        console.log('=======over max return=====');
        return;
      }
      var src = $(this).attr('src');
      console.log('正在下载' + src);
      download(src, dir);
      console.log('下载完成');
    });
  }
});

//下载方法
var download = function(url, dir){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(dir + "/" + getMd5(url)));
  });
};

var getMd5 = function(content) {
  var md5 = crypto.createHash('md5');
  md5.update(content);
  var d = md5.digest('hex');  //MD5值是5f4dcc3b5aa765d61d8327deb882cf99
  console.log(d);
  return d;
};