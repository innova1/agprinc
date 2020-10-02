#!/bin/bash
sudo forever start -a -l /home/bitnami/projects/agileprinciples/agprinc/logs/forever.log -o /home/bitnami/projects/agileprinciples/agprinc/logs/fbk.log -e /home/bitnami/projects/agileprinciples/agprinc/logs/logs/err.log ./bin/www
