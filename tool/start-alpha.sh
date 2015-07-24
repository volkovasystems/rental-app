cd ~/rental;

forever stopall;

pkill -f gulp;
pkill -f mongod;
pkill -f node;

gulp --development --administrator > gulp.log;

if [ ! -d "../logs/$(echo `date +%Y-%m-%d`)" ]; then
	mkdir -p "../logs/$(echo `date +%Y-%m-%d`)";
fi

mv *.log *.err *.out ~/.forever/*.log "../logs/$(echo `date +%Y-%m-%d`)";

forever start -l alphadb.log -o alphadb.out -e alphadb.err -m 3 server/database/database-main.js --option=../../local/alpha-database.js;

forever start -l alpha.log -o alpha.out -e alpha.err -m 3 server/alpha/alpha-main.js --option=../../local/alpha-server.js;

forever start -l static.log -o static.out -e static.err -m 3 server/static/static-main.js --option=../../local/static-server.js;
