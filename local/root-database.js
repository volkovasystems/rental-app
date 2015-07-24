require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 6005,
	"DB_PORT": 6004,
	"DB_HOST": "localhost",
	"DB_NAME": "rootdb",
	"DB_COLLECTION": "root",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
