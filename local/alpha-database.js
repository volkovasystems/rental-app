require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 7002,
	"DB_PORT": 7001,
	"DB_NAME": "alphadb",
	"DB_COLLECTION": "alpha",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
