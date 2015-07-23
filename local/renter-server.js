require( "gestalten" )( {
	"PORT": 10000,
	"DB_PORT": 10001,
	"DB_HOST": "localhost",
	"DB_NAME": "renterdb",
	"DB_COLLECTION": "renter",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
