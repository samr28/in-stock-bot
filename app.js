var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var schedule = require('node-schedule');
var slack = require('slack-incoming-webhook');
var app     = express();
var client = slack({
  url: 'process.env.WEBHOOK_URL',
});

let version = require('./package.json').version;

function check() {
  console.log('Checking at: ' + new Date());
  url = 'process.env.PRODUCT_URL';
  var data = "";
  var inStock;
  request(url, function(error, response, html){
      if(!error){
          var $ = cheerio.load(html);

      $('#options-550-list').filter(function(){
          data = $(this);

          var item = data.children().last().children().last().html();
          console.log(item);
          console.log(item.includes("in-stock"));
          if (item.includes("in-stock")) {
            client('Gearboxes are in stock!');
          }
        });
      }
    });
  }

client(`Bot v${version} started @ ${new Date()}`);

var j = schedule.scheduleJob('0 * * * *', check);

exports = module.exports = app;
