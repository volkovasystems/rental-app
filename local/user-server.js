require( "gestalten" )( {
	"PORT": 9000,
	"DB_PORT": 9001,
	"DB_HOST": "localhost",
	"DB_NAME": "userdb",
	"DB_COLLECTION": "users",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
