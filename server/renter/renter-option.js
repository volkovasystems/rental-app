var argv = require( "yargs" ).argv;
var fs = require( "fs" );
var urlJoin = require( "../utility/url-join.js" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.HOST = argv.host || "localhost";

	global.PORT = parseInt( argv.port ) || 10000;

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 10443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.CERTIFICATE_PASSWORD = argv.certificatePassword || "";
}

urlJoin( global, "USER_SERVER_URL" );
urlJoin( global, "RENTER_SERVER_URL" );
urlJoin( global, "RENT_SERVER_URL" );
urlJoin( global, "ROOM_SERVER_URL" );
urlJoin( global, "INVOICE_SERVER_URL" );
urlJoin( global, "WORKER_SERVER_URL" );
urlJoin( global, "ADMIN_SERVER_URL" );
urlJoin( global, "ANALYTICS_SERVER_URL" );