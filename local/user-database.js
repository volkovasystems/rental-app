require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 9002,
	"DB_PORT": 9001,
	"DB_HOST": "localhost",
	"DB_NAME": "userdb",
	"DB_COLLECTION": "user",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
