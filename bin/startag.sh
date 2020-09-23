#!/bin/bash
sudo forever start -a -l /home/bitnami/todo/logs/forever.log -o /home/bitnami/todo/logs/fbk.log -e /home/bitnami/tod
o/logs/err.log ./bin/www
