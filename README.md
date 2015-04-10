#Sonar

Simple script deployed in each country to test performance accessing major sites simulating a real user.
Data is reported to [statshub](https://github.com/getlantern/statshub) and shown at [lantern-dashboard](http://lantern-dashboard.s3-website-us-east-1.amazonaws.com/sonar.html).

# Deploy

[PhantomJS](http://phantomjs.org/) is required to test the sites and report to statshub.

### Linux 64 bit

```
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2
tar jxvf phantomjs-1.9.8-linux-x86_64.tar.bz2
sudo ln -s `pwd`/phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
```

### Linux 32 bit

```
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-i686.tar.bz2
tar jxvf phantomjs-1.9.8-linux-i686.tar.bz2
sudo ln -s `pwd`/phantomjs-1.9.8-linux-i686/bin/phantomjs /usr/bin/phantomjs
```

To test performance of Lantern network, headless version of Lantern is required.

See [flash-build repo](https://github.com/getlantern/flashlight-build#building-headless-version) for details.

# Run

PhantomJS is not considered pretty stable. It may crashes or takes unrealistic long time to load a page. So instead of run one phantomjs instance forever, we can run it periodly. Below is an example to run it every 5 minutes.

```
[fffw@hyperion ~]$ crontab -l
0-59/5  *       *       *       *       (cd /home/fffw/sonar/; phantomjs --proxy localhost:8787 sonar.js 2.0.0-beta4 >> 2.0.0-beta4.log 2>&1)
```

We can run several instances of sonar to test performace of different Lantern versions. Just run lantern at different proxy port and set PhantomJS proxy url accordingly.
```
lantern_linux_headless_v2.0.0 -addr="localhost:8787" -configdir="previous_config"
lantern_linux_headless_v2.0.1 -addr="localhost:8989" -configdir="new_config"
```
