var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var mongoose = require( "mongoose" );
var secrets = require( "secrets.js" );

require( "./database-option.js" );

if( !( "DB_PORT" in global ) &&
	!( "DB_NAME" in global ) )
{
	throw new Error( "database options are incomplete" )
}

var dbHost = "";
if( "DB_HOST" in global ){
	dbHost = DB_HOST;

}else{
	dbHost = "localhost";
}

var connection = argv.connection || [ "mongodb://", dbHost, ":", DB_PORT, "/", DB_NAME ].join( "" );

var dbOptions = { };

if( "DB_USERNAME" in global &&
	"DB_PASSWORD" in global )
{
	var username = secrets.combine( _( DB_USERNAME ).pairs( ).flatten( ).value( ) );

	username = secrets.hex2str( username );

	var password = secrets.combine( _( DB_PASSWORD ).pairs( ).flatten( ).value( ) );

	password = secrets.hex2str( password );

	dbOptions.user = username;

	dbOptions.pass = password;
}

if( "DB_CERTIFICATE" in global &&
	"DB_PRIVATE_KEY" in global &&
	"DB_CERTIFICATE_PASSWORD" in global )
{
	dbOptions.ssl = true;

	dbOptions.sslValidate = true;

	dbOptions.sslCert = DB_CERTIFICATE;

	dbOptions.sslKey = DB_PRIVATE_KEY;

	var dbCertificatePassword = secrets.combine( _( DB_CERTIFICATE_PASSWORD ).pairs( ).flatten( ).value( ) );

	dbCertificatePassword = secrets.hex2str( dbCertificatePassword );

	dbOptions.sslPass = dbCertificatePassword;
}

if( "DB_POOL_SIZE" in global ){
	dbOptions.poolSize = DB_POOL_SIZE;
}

if( _.isEmpty( dbOptions ) ){
	mongoose.connect( connection );	

}else{
	mongoose.connect( connection, dbOptions );
}
