var fs = require( "fs" );
var os = require( "os" );

var local = {
	"DB_PORT": 13001,
	"DB_HOST": "localhost",
	"DB_NAME": "slotdb",
	"DB_PATH": 
		( /^Windows/ ).test( os.type( ) )? 
			"C:\\db\\parq":
			"~/db/parq",

	//"DB_USERNAME": JSON.parse( fs.readFileSync( "./local/username.json" ).toString( ) ),
	//"DB_PASSWORD": JSON.parse( fs.readFileSync( "./local/password.json" ).toString( ) ),
	"DB_COLLECTION": "slots"
};

for( var property in local ){
	global[ property ] = local[ property ];
}