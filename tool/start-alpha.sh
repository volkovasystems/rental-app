cd ~/rental;

printf "\nstopping alpha servers";
forever stopall;

printf "\nkilling required processes";
pkill -f gulp;
pkill -f mongod;
pkill -f node;

printf "\nrunning gulp";
gulp --development --administrator > gulp.log;

if [ ! -d "../logs/$(echo `date +%Y-%m-%d`)" ]; then
	printf "\ncreating backup directory for logs";
	mkdir -p "../logs/$(echo `date +%Y-%m-%d`)";
fi

printf "\nmoving logs to backup directory";
mv *.log *.err *.out ~/.forever/*.log "../logs/$(echo `date +%Y-%m-%d`)";

printf "\nstarting mongodb server";
forever start -l alphadb.log -o alphadb.out -e alphadb.err -m 3 server/database/database-main.js --option=../../local/alpha-database.js;

sleep 20;

printf "\nstarting alpha server";
forever start -l alpha.log -o alpha.out -e alpha.err -m 3 server/alpha/alpha-main.js --option=../../local/alpha-server.js;

printf "\nstarting static server";
forever start -l static.log -o static.out -e static.err -m 3 server/static/static-main.js --option=../../local/static-server.js;

sleep 3;

printf "\nprinting server statuses"
forever list;

sleep 3;

printf "\nprinting alpha error logs";
printf '%b\n' "$(cat ./alpha.err)";

sleep 3;

printf "\nprinting alpha output logs";
printf '%b\n' "$(cat ./alpha.out)";

sleep 3;

printf "\nprinting static error logs";
printf '%b\n' "$(cat ./static.err)";

sleep 3;

printf "\nprinting static output logs";
printf '%b\n' "$(cat ./static.out)";