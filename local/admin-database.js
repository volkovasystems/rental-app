require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 15002,
	"DB_PORT": 15001,
	"DB_NAME": "admindb",
	"DB_COLLECTION": "admin",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
