#!/bin/bash
clear
echo "Good morning, world."
git pull origin changes1
echo "git done, now installing..."
npm install --production
echo "npm done, now running..."
sudo forever restart ./bin/www

