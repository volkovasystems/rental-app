require( "gestalten" )( {
	"PORT": 19000,
	"DB_PORT": 19001,
	"DB_HOST": "localhost",
	"DB_NAME": "analyticsdb",
	"DB_COLLECTION": "analytics",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
