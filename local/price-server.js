var local = {
	"PORT": 18000,
	"DB_PORT": 18001,
	"DB_HOST": "localhost",
	"DB_NAME": "pricedb",
	"DB_COLLECTION": "prices",
	//"DB_USERNAME": JSON.parse( fs.readFileSync( "./local/username.json" ).toString( ) ),
	//"DB_PASSWORD": JSON.parse( fs.readFileSync( "./local/password.json" ).toString( ) )
	
	"USER_SERVER_URL": "http://user.parq.ph:9000",
	"VEHICLE_SERVER_URL": "http://vehicle.parq.ph:10000",
	"PLACE_SERVER_URL": "http://place.parq.ph:11000",
	"PARK_SERVER_URL": "http://park.parq.ph:12000",
	"SLOT_SERVER_URL": "http://slot.parq.ph:13000",
	"APP_SERVER_URL": "http://app.parq.ph:14000",
	"ADMIN_SERVER_URL": "http://admin.parq.ph:15000",
	"MEDIA_SERVER_URL": "http://media.parq.ph:16000",
	"PAY_SERVER_URL": "http://pay.parq.ph:17000",
	"PRICE_SERVER_URL": "http://price.parq.ph:18000",
	"DATA_SERVER_URL": "http://data.parq.ph:19000",
	"SOCIAL_SERVER_URL": "http://social.parq.ph:20000",
	"WORKER_SERVER_URL": "http://worker.parq.ph:21000",
	"ANALYTICS_SERVER_URL": "http://analytics.parq.ph:22000",
	"RESERVE_SERVER_URL": "http://reserve.parq.ph:23000"
};

for( var property in local ){
	global[ property ] = local[ property ];
}