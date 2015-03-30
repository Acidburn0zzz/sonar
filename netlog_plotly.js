(function() {
  'use strict';
  /*global require,phantom,console,WebSocket */
  var page = require('webpage').create(),
  system = require('system'),
  site, url, version, country;

  var plotly = new WebSocket('ws://127.0.0.1:9527/socket', {'plotly-streamtoken': 'f3zi2wjw0n'});

  function postData(site, loadTime, failed) {
    var data = JSON.stringify({
      time: Date.now(),
      version: version,
      country: country,
      site: site,
      failCount : failed ? 1 : 0,
      loadTime: loadTime
    });
    plotly.send(data + '\n');
    phantom.exit();
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
