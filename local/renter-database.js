require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 10002,
	"DB_PORT": 10001,
	"DB_HOST": "localhost",
	"DB_NAME": "renterdb",
	"DB_COLLECTION": "renter",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
