var argv = require( "yargs" ).argv;
var fs = require( "fs" );
var urlJoin = require( "./url-join.js" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.HOST = argv.host;

	global.PORT = parseInt( argv.port ) || 21000;

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 21443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.CERTIFICATE_PASSWORD = argv.certificatePassword || "";
}

urlJoin( global, "USER_SERVER_URL" );
urlJoin( global, "VEHICLE_SERVER_URL" );
urlJoin( global, "PLACE_SERVER_URL" );
urlJoin( global, "PARK_SERVER_URL" );
urlJoin( global, "SLOT_SERVER_URL" );
urlJoin( global, "APP_SERVER_URL" );
urlJoin( global, "ADMIN_SERVER_URL" );
urlJoin( global, "MEDIA_SERVER_URL" );
urlJoin( global, "PAY_SERVER_URL" );
urlJoin( global, "PRICE_SERVER_URL" );
urlJoin( global, "DATA_SERVER_URL" );
urlJoin( global, "SOCIAL_SERVER_URL" );
urlJoin( global, "WORKER_SERVER_URL" );
urlJoin( global, "ANALYTICS_SERVER_URL" );
urlJoin( global, "RESERVE_SERVER_URL" );
