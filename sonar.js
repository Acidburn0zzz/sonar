(function() {
  'use strict';
  /*global require,phantom,console,setInterval,clearInterval */

  /**
   * Borrowed from https://github.com/ariya/phantomjs/blob/master/examples/waitfor.js
   *
   * Wait until the test condition is true or a timeout occurs. Useful for waiting
   * on a server response or for a ui change (fadeIn, etc.) to occur.
   *
   * @param testFx javascript condition that evaluates to a boolean,
   * it can be passed in as a string (e.g.: '1 == 1' or '$('#bar').is(':visible')' or
   * as a callback function.
   * @param onReady what to do when testFx condition is fulfilled,
   * it can be passed in as a string (e.g.: '1 == 1' or '$('#bar').is(':visible')' or
   * as a callback function.
   * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
   */
  function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = testFx(); //< defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          console.log('"waitFor()" timeout');
          phantom.exit(1);
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          console.log('"waitFor()" finished in ' + (new Date().getTime() - start) + 'ms.');
          onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 10000); //< repeat check every 10s
  }


  var poster = require('webpage').create(),
  system = require('system'), fs = require('fs');

  var processedCount = 0;

  poster.onResourceError = function(resourceError) {
    console.log('Error submit data to ' + resourceError.url + ', error ' + resourceError.errorCode + ': ' + resourceError.errorString);
  };

  function postData(country, site, version, loadTime, failed, size) {
    var instance = country + '-' + site + '-' + version;
    var settings = {
      operation: 'POST',
      encoding: 'utf8',
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        dims: {
          sonar: instance
        },
        increments: { failCount : failed ? 1 : 0, totalSize: size },
        gauges: { loadTime: loadTime}
      })
    };

    poster.open('http://pure-journey-3547.herokuapp.com/stats/' + instance, settings, function(postStatus) {
      console.log('Submit to statshub: ' + postStatus + ', data = ' + settings.data);
      processedCount = processedCount + 1;
    });
  }

  function process(country, site, url, version) {
    var page = require('webpage').create();
    var size = 0;

    page.onResourceError = function(resourceError) {
      console.log('Error load resource #' + resourceError.id + ', ' + resourceError.url + ', error ' + resourceError.errorCode + ': ' + resourceError.errorString);
      page.stop();
      processedCount = processedCount + 1;
    };
    page.onResourceReceived = function(response) {
      if (response.bodySize !== undefined) {
        size = size + response.bodySize;
      }
    };
    var started = Date.now();
    page.onLoadFinished = function (status) {
      var loadTime = Date.now() - started;
      console.log(site + ' (' + url + '): ' + status + ', takes ' + loadTime + 'ms, size = ' + size + ' bytes');
      postData(country, site, version, loadTime, status === 'fail', size);
    };
    page.open(url);
  }

  if (system.args.length < 1) {
    console.log('Usage: sonar.js <lantern version>');
    phantom.exit(1);
  } else {
    var version = system.args[1];

    var content = fs.read('config.json');
    var config = JSON.parse(content);
    var country = config.country;
    if (country === undefined) {
      console.log('Please specify country in config');
      phantom.exit(1);
    }
    for (var i in config.sites) {
      process(country, config.sites[i][0], config.sites[i][1], version);
    }
    waitFor(function() {
      return processedCount === config.sites.length;
    }, function() { phantom.exit(); },
    4*60*1000); // wait for at most 4 min
  }

}());
