require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 18002,
	"DB_PORT": 18001,
	"DB_HOST": "localhost",
	"DB_NAME": "workerdb",
	"DB_COLLECTION": "worker",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
