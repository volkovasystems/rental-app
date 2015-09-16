var argv = require( "yargs" ).argv;
var fs = require( "fs" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.HOST = argv.host || "localhost";

	global.PORT = parseInt( argv.port ) || 14000;

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 14443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.CERTIFICATE_PASSWORD = argv.certificatePassword || "";
}

require( "../config/server-list.js" );