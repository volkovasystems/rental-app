var http = require( "http" );
var https = require( "https" );
var secrets = require( "secrets.js" );

if( !( "APP" in global ) ){
	throw new Error( "app instance does not exists" );
}

if( !( "PORT" in global ) ){
	throw new Error( "server port does not exists" );
}

var server = http.createServer( APP );

server.on( "listening",
	function onListening( ){
		console.log( "server is listening" );
	} );

server.on( "error",
	function onError( error ){
		console.log( "server encountered an error", error.message );
	} );

server.on( "close",
	function onClose( ){
		console.log( "server closes" );
	} );

if( "HOST" in global ){
	server.listen( PORT, HOST );	

}else{
	server.listen( PORT );
}

console.log( "server created" );

global.SERVER = server;

if( "SECURE_PORT" in global &&
	"PRIVATE_KEY" in global &&
	"CERTIFICATE" in global &&
	"CERTIFICATE_PASSWORD" in global )
{
	var certificatePassword = secrets.combine( _( CERTIFICATE_PASSWORD ).pairs( ).flatten( ).value( ) );

	certificatePassword = secrets.hex2str( password );

	var credentials = {
		"key": PRIVATE_KEY,
		"cert": CERTIFICATE,
		"passphrase": certificatePassword	
	};

	var secureServer = https.createServer( credentials, APP );

	secureServer.on( "listening",
		function onListening( ){
			console.log( "server is listening" );
		} );

	secureServer.on( "error",
		function onError( error ){
			console.log( "server encountered an error", error.message );
		} );

	secureServer.on( "close",
		function onClose( ){
			console.log( "server closes" );
		} );

	if( "SECURE_HOST" in global ){
		secureServer.listen( SECURE_PORT, SECURE_HOST );


	}else{
		secureServer.listen( SECURE_PORT );
	}

	global.SECURE_SERVER = secureServer;
}

APP.use( "/ping",
	function onPing( request, response ){
		response
			.status( 200 )
			.json( {
				"status": "success",
				"data": {
					"timestamp": Date.now( ),
					"server": "room"
				}
			} );
	} );

APP.use( function onAllRequest( request, response ){
	response
		.status( 404 )
		.json( {
			"status": "failed",
			"data": "endpoint not supported"
		} );
} );