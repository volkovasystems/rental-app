var argv = require( "yargs" ).argv;
var fs = require( "fs" );
var urlJoin = require( "../utility/url-join.js" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.HOST = argv.host || "localhost";

	global.PORT = parseInt( argv.port ) || 11000;

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 11443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.CERTIFICATE_PASSWORD = argv.certificatePassword || "";
}

require( "../config/server-list.js" );
