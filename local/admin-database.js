require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 15002,
	"DB_PORT": 15001,
	"DB_NAME": "admindb",
	"DB_COLLECTION": "admin",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
