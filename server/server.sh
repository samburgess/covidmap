#!/bin/bash

#pull from nyt
cd ./data/nyt
git pull origin master
cd ../..

#parse data
node crunchData &
crunching=$! #get pid of crunchData
wait $crunching #wait on crunchData to return

#write to port
node server