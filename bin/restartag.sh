#!/bin/bash
clear
echo "Good morning, world."
git pull origin master 
echo "git done, now installing..."
npm install --production
echo "npm done, now running..."
sudo forever restart ./bin/www

