require( "gestalten" )( {
	"PORT": 16000,
	"DB_PORT": 16001,
	"DB_HOST": "localhost",
	"DB_NAME": "staffdb",
	"DB_COLLECTION": "staff",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
