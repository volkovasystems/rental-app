var fs = require( "fs" );
var os = require( "os" );

var local = {
	"HOST": "localhost",
	"PORT": 7002,
	"DB_PORT": 7001,
	"DB_NAME": "alldb",
	"DB_COLLECTION": "alls",
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