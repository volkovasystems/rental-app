cd ~/rental;

forever stopall;

pkill -f gulp;
pkill -f mongod;
pkill -f node;

forever list;