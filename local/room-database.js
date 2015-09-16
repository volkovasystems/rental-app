require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 11002,
	"DB_PORT": 11001,
	"DB_HOST": "localhost",
	"DB_NAME": "roomdb",
	"DB_COLLECTION": "room",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
