var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');

// 目标网址
var url = 'http://tieba.baidu.com/p/4114929893?fr=ala0&pstaala=1';
//url = 'http://me2-sex.lofter.com/tag/美女摄影?page=1';

// 本地存储目录
var dir = './images';

//创建目录
mkdirp(dir, function (err) {
  if (err) {
    console.log(err);
  }
});

// 开始下载
var start = function () {
  superagent.get(encodeURI(url)).end(function (err, sres) {
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(sres.text);
    var urls = [];
    $('img.BDE_Image').each(function (idx, element) {
      var $element = $(element);
      //console.log('$element===>' + $element);
      urls.push(
        $element.attr('src')
      );
    });

    console.log('共需下载' + urls.length);

    var i = 0;
    downloadUrls(urls, function () {
      if (++i == urls.length) {
        console.log('所有下载完成');
      }
    })
  });
};

var downloadUrls = function (urls, callback) {
  urls.forEach(function (url) {
    var filePath = dir + "/" + getMd5(url) + ".jpg";
    console.log('正在下载' + url + "---->" + filePath);
    var stream = fs.createWriteStream(filePath);
    superagent.get(url).pipe(stream);
    console.log('下载完成');
    callback();
  });
};

var getMd5 = function (content) {
  return crypto.createHash('md5').update(content).digest('hex');
};

start();