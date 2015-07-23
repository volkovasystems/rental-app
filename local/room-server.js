require( "gestalten" )( {
	"PORT": 11000,
	"DB_PORT": 11001,
	"DB_HOST": "localhost",
	"DB_NAME": "roomdb",
	"DB_COLLECTION": "room",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
