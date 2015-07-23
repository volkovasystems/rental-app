require( "gestalten" )( {
	"PORT": 15000,
	"DB_PORT": 15001,
	"DB_HOST": "localhost",
	"DB_NAME": "admindb",
	"DB_COLLECTION": "admin",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
