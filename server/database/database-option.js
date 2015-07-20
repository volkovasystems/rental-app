var argv = require( "yargs" ).argv;
var fs  = require( "fs" );
var path = require( "path" );

if( "option" in argv ){
	require( argv.option );

}else{
	global.PORT = parseInt( argv.port ) || 8000;

	global.HOST = argv.host || "localhost";

	global.SECURE_HOST = argv.secureHost || "localhost";

	global.SECURE_PORT = parseInt( argv.securePort ) || 8443;

	global.PRIVATE_KEY = fs.readyFileSync( argv.privateKeyFile, "utf8" ) || "";

	global.CERTIFICATE = fs.readyFileSync( argv.certificateFile, "utf8" ) || "";

	global.DB_PORT = parseInt( argv.dbPort ) || 8001;

	global.DB_HOST = argv.dbHost || HOST || "localhost";

	global.DB_PRIVATE_KEY = fs.readyFileSync( argv.dbPrivateKeyFile, "utf8" ) || "";

	global.DB_CERTIFICATE = fs.readyFileSync( argv.dbCertificateFile, "utf8" ) || "";

	global.DB_CERTIFICATE_PASSWORD = fs.readyFileSync( argv.dbCertificatePassword, "utf8" ) || "";

	global.DB_NAME = argv.dbName || "db";

	global.DB_PATH = argv.dbPath || ".";

	global.DB_COLLECTION = argv.dbCollection || "models";
}

if( "DB_PATH" in global &&
	"DB_NAME" in global )
{
	global.DB_DIRECTORY = path.resolve( DB_PATH, DB_NAME );	
}
