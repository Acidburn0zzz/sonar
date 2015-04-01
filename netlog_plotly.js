(function() {
  'use strict';
  /*global require,phantom,console*/
  var page = require('webpage').create(),
  system = require('system'),
  site, url, version, country;

  var serialize = function(obj) {
    var str = [];
    for(var p in obj){
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  };

  function postData(site, loadTime, failed) {
    var settings = {
      operation: 'POST',
      encoding: 'utf8',
      headers: {
        'Content-Type': 'application/json'
      },
      data: serialize({
        un: 'fffw',
        key: 'artnefz9r7',
        origin: 'plot',
        platform: 'js',
        version: '0.1'
      })
    };
    var now = new Date();
    settings.data += '&args='+JSON.stringify([{
      x: [now.toISOString()],
      y: [loadTime]
    }]);
    settings.data += '&kwargs=' + JSON.stringify({
      filename: country + '-' + site + '-' + version,
      fileopt: 'extend'
    });

    console.log(settings.data);
    page.open('https://plot.ly/clientresp', settings, function(status) {
      console.log('Post sonar data status: ' + status);
      phantom.exit();
    });
  }

  if (system.args.length < 5) {
    console.log('Usage: netlog.js <site name> <url> <lantern version> <country>');
    phantom.exit(1);
  } else {
    site = system.args[1];
    url = system.args[2];
    version = system.args[3];
    country = system.args[4];

    page.onResourceError = function(resourceError) {
      console.log('Unable to load resource (#' + resourceError.id + ' URL:' + resourceError.url + ')');
      console.log('Error code: ' + resourceError.errorCode + ', Description: ' + resourceError.errorString);
    };
    var started = Date.now();
    page.open(url, function (status) {
      var loadTime = Date.now() - started;
      console.log('Access ' + site + ': ' + status + ', takes ' + loadTime + 'ms');
      postData(site, loadTime, status === 'fail');
    });
  }
}());
