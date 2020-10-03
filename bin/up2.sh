#!/bin/bash
clear
echo "Good morning, world."
git pull origin master 
echo "git done, now installing..."
npm install --production
sudo DEBUG=agprinc:* node ./bin/www
/*DEBUG=agprinc:* npm start*/
