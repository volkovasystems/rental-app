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

forever start -l appdb.log -o appdb.out -e appdb.err -m 3 server/database-main.js --option=../local/app-database.js;
forever start -l userdb.log -o userdb.out -e userdb.err -m 3 server/database-main.js --option=../local/user-database.js;
forever start -l vehicledb.log -o vehicledb.out -e vehicledb.err -m 3 server/database-main.js --option=../local/vehicle-database.js;
forever start -l placedb.log -o placedb.out -e placedb.err -m 3 server/database-main.js --option=../local/place-database.js;
forever start -l parkdb.log -o parkdb.out -e parkdb.err -m 3 server/database-main.js --option=../local/park-database.js;
forever start -l slotdb.log -o slotdb.out -e slotdb.err -m 3 server/database-main.js --option=../local/slot-database.js;
forever start -l pricedb.log -o pricedb.out -e pricedb.err -m 3 server/database-main.js --option=../local/price-database.js;

forever start -l app.log -o app.out -e app.err -m 3 server/parq-main.js --option=../local/app-server.js;
forever start -l user.log -o user.out -e user.err -m 3 server/user-main.js --option=../local/user-server.js;
forever start -l vehicle.log -o vehicle.out -e vehicle.err -m 3 server/vehicle-main.js --option=../local/vehicle-server.js;
forever start -l place.log -o place.out -e place.err -m 3 server/place-main.js --option=../local/place-server.js;
forever start -l park.log -o park.out -e park.err -m 3 server/park-main.js --option=../local/park-server.js;
forever start -l slot.log -o slot.out -e slot.err -m 3 server/slot-main.js --option=../local/slot-server.js;
forever start -l price.log -o price.out -e price.err -m 3 server/price-main.js --option=../local/price-server.js;

forever start -l static.log -o static.out -e static.err -m 3 server/static-main.js --option=../local/static-server.js;
