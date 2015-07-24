require( "gestalten" )( {
	"PORT": 6003,
	"DB_PORT": 6004,
	"DB_HOST": "localhost",
	"DB_NAME": "rootdb",
	"DB_COLLECTION": "root",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
