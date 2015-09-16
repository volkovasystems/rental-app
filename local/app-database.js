require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 20002,
	"DB_PORT": 20001,
	"DB_HOST": "localhost",
	"DB_NAME": "rentaldb",
	"DB_COLLECTION": "rental",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
