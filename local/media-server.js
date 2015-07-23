require( "gestalten" )( {
	"PORT": 14000,
	"DB_PORT": 14001,
	"DB_HOST": "localhost",
	"DB_NAME": "mediadb",
	"DB_COLLECTION": "media",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
