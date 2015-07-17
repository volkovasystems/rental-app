var argv = require( "yargs" ).argv;
var fs = require( "fs" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.HOST = argv.host;

	global.PORT = parseInt( argv.port ) || 80;

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.CERTIFICATE_PASSWORD = argv.certificatePassword || "";

	global.STATIC_DIRECTORY = argv.directory || "deploy";
}
