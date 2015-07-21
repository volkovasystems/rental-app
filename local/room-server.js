var fs = require( "fs" );

var local = {
	"PORT": 12000,
	"DB_PORT": 12001,
	"DB_HOST": "localhost",
	"DB_NAME": "roomdb",
	"DB_COLLECTION": "rooms",
	//"DB_USERNAME": JSON.parse( fs.readFileSync( "./local/username.json" ).toString( ) ),
	//"DB_PASSWORD": JSON.parse( fs.readFileSync( "./local/password.json" ).toString( ) ),
	
	"USER_SERVER_URL": "http://user.rental.ph:9000",
	"RENTER_SERVER_URL": "http://renter.rental.ph:10000",
	"RENT_SERVER_URL": "http://rent.rental.ph:11000",
	"ROOM_SERVER_URL": "http://room.rental.ph:12000",
	"INVOICE_SERVER_URL": "http://invoice.rental.ph:13000",
	"WORKER_SERVER_URL": "http://worker.rental.ph:14000",
	"ADMIN_SERVER_URL": "http://admin.rental.ph:15000"
	"ANALYTICS_SERVER_URL": "http://analytics.rental.ph:16000"
};

for( var property in local ){
	global[ property ] = local[ property ];
}