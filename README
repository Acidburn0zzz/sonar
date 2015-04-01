#Sonar

Simple script deployed in each country to test performance accessing major sites simulating a real user

# Deploy
It requires PhantomJS to work

```
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-1.9.8-linux-x86_64.tar.bz2
tar jxvf phantomjs-1.9.8-linux-x86_64.tar.bz2
sudo ln -s `pwd`/phantomjs-1.9.8-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
```

To test performance of Lantern network, headless version of Lantern is required.

Under [flash-build](https://github.com/getlantern/flashlight-build) repo, run

```
. setenv.sh
HEADLESS_BUILD=true ./linuxcompile.bash
```

# Run

We can run several instance to test performace of different Lantern versions
```
lantern_linux_headless_v2.0.0 -port "localhost:8787" &
lantern_linux_headless_v2.0.1 -port "localhost:8989" &
while true; do phantomjs --web-security=false --proxy localhost:8787 sonar.js 2.0.0; done &
while true; do phantomjs --web-security=false --proxy localhost:8989 sonar.js 2.0.1; done &
```

The collected data will be shown at http://lantern-dashboard.s3-website-us-east-1.amazonaws.com/sonar.html
