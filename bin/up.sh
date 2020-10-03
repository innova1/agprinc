#!/bin/bash
clear
echo "pull from github..."
git pull origin master
echo "git done, now installing..."
npm install --production
sudo DEBUG=agprin:* node ./bin/www

