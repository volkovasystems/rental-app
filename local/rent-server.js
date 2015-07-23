require( "gestalten" )( {
	"PORT": 12000,
	"DB_PORT": 12001,
	"DB_HOST": "localhost",
	"DB_NAME": "rentdb",
	"DB_COLLECTION": "rent",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
