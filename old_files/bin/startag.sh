#!/bin/bash
sudo forever start -a -l /home/bitnami/projects/agileprinciples/agprinc/logs/forever.log -o /home/bitnami/projects/agileprinciples/agprinc/logs/agp.log -e /home/bitnami/projects/agileprinciples/agprinc/logs/err.log ./bin/www
