#!/usr/bin/env sh
while true; do phantomjs --web-security=false --proxy localhost:8787 sonar.js 2.0.0-beta4; sleep 300; done
