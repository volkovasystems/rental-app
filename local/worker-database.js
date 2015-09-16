require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 18002,
	"DB_PORT": 18001,
	"DB_HOST": "localhost",
	"DB_NAME": "workerdb",
	"DB_COLLECTION": "worker",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
