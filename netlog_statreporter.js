(function() {
  'use strict';
  /*global require,phantom,console */
  var page = require('webpage').create(),
  system = require('system'),
  site, url, version, country, instance;

  function postData(site, loadTime, failed) {
    var settings = {
      operation: 'POST',
      encoding: 'utf8',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        dims: {
          version: version,
          country: country,
          site: site
        },
        increments: { failCount : failed ? 1 : 0},
        gauges: { loadTime: loadTime}
      })
    };

    page.open('http://pure-journey-3547.herokuapp.com/stats/' + instance, settings, function(status) {
      console.log('Post sonar data status: ' + status);
      phantom.exit();
    });
  }

  if (system.args.length < 6) {
    console.log('Usage: netlog.js <site name> <url> <lantern version> <country> <instance id>');
    phantom.exit(1);
  } else {
    site = system.args[1];
    url = system.args[2];
    version = system.args[3];
    country = system.args[4];
    instance = system.args[5];

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
