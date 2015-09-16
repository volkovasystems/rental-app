require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 12002,
	"DB_PORT": 12001,
	"DB_HOST": "localhost",
	"DB_NAME": "rentdb",
	"DB_COLLECTION": "rent",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
