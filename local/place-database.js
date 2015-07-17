var fs = require( "fs" );
var os = require( "os" );

var local = {
	"HOST": "localhost",
	"PORT": 11002,
	"DB_PORT": 11001,
	"DB_HOST": "localhost",
	"DB_NAME": "placedb",
	"DB_COLLECTION": "places",
	"DB_PATH": 
		( /^Windows/ ).test( os.type( ) )? 
			"C:\\db\\parq":
			"~/db/parq",

	//"DB_USERNAME": JSON.parse( fs.readFileSync( "./local/username.json" ).toString( ) ),
	//"DB_PASSWORD": JSON.parse( fs.readFileSync( "./local/password.json" ).toString( ) )
};

for( var property in local ){
	global[ property ] = local[ property ];
}