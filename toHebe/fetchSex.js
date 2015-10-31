var cheerio = require('cheerio');
var superagent = require('superagent');
var fs = require('fs');
var mkdirp = require('mkdirp');
var crypto = require('crypto');
var async = require('async');

// 目标网址
var baseUrl = 'http://me2-sex.lofter.com/tag/美女摄影?page=';
// 本地存储目录
var dir = './images/sex';
var Sex = require('./data/sex.js');
var START_PAGE = 5;
var END_PAGE = 10;

var MAX_CURRENCY_COUNT = 5;
var concurrencyCount = 0;

//创建目录
mkdirp(dir, function (err) {
  if (err) {
    console.log(err);
  }
});

// 开始下载
var start = function () {
  fetchPage(START_PAGE);
};

var fetchPage = function (page) {
  console.log("=============page" + page + "==================");
  var url = baseUrl + page;
  superagent.get(encodeURI(url)).end(function (err, sres) {
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(sres.text);
    var urls = [];
    $('img').each(function (idx, element) {
      var $element = $(element);
      //console.log('$element===>' + $element);
      urls.push(
        $element.attr('src')
      );
    });

    console.log("page " + page + '共需下载' + urls.length);
    downloadUrls(page, urls);
  });
};

var fetchUrl = function (url, callback) {
  var delay = parseInt((Math.random() * 10000000) % 2000, 10);

  concurrencyCount++;
  var filePath = dir + "/" + getMd5(url) + ".jpg";
  console.log('现在的并发数是', concurrencyCount, url + " ----> " + filePath);
  saveToDb(url, filePath);
  var stream = fs.createWriteStream(filePath);
  superagent.get(url).pipe(stream);
  console.log('下载完成');

  setTimeout(function () {
    concurrencyCount--;
    callback(null, url);
  }, delay);
};

var downloadUrls = function (page, urls) {
  async.mapLimit(urls, MAX_CURRENCY_COUNT, function (url, callback) {
    fetchUrl(url, callback);
  }, function (err, result) {
    console.log('done: ' + page);
    if (++page <= END_PAGE) {
      var delay = parseInt((Math.random() * 10000000) % 20000, 10);
      setTimeout(function () {
        fetchPage(page);
      }, delay);
    }
    //console.log(result);
  });
};

var getMd5 = function (content) {
  return crypto.createHash('md5').update(content).digest('hex');
};

var saveToDb = function (url, filePath) {
  //存储数据
  var sex = new Sex({
    path: filePath,
    sourceUrl: url
  });
  //保存数据库
  sex.save(function (err) {
    if (err) {
      console.log('保存失败')
      return;
    }
  });
};

start();