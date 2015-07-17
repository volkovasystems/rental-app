cd ~/parq;

forever stopall;

pkill -f gulp;
pkill -f mongod;
pkill -f node;

gulp --development --administrator > gulp.log;

if [ ! -d "../logs/$(echo `date +%Y-%m-%d`)" ]; then
	mkdir -p "../logs/$(echo `date +%Y-%m-%d`)";
fi

mv *.log *.err *.out ~/.forever/*.log "../logs/$(echo `date +%Y-%m-%d`)";

forever start -l alldb.log -o alldb.out -e alldb.err -m 3 server/database-main.js --option=../local/all-database.js;

forever start -l all.log -o all.out -e all.err -m 3 server/all-main.js --option=../local/all-server.js;

forever start -l static.log -o static.out -e static.err -m 3 server/static-main.js --option=../local/static-server.js;
