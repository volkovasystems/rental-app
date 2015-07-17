var fs = require( "fs" );
var os = require( "os" );

var local = {
	"HOST": "localhost",
	"PORT": 14002,
	"DB_PORT": 14001,
	"DB_HOST": "localhost",
	"DB_NAME": "parqdb",
	"DB_COLLECTION": "parq",
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