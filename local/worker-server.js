require( "gestalten" )( {
	"PORT": 18000,
	"DB_PORT": 18001,
	"DB_HOST": "localhost",
	"DB_NAME": "workerdb",
	"DB_COLLECTION": "worker",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
