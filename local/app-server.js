require( "gestalten" )( {
	"PORT": 20000,
	"DB_PORT": 20001,
	"DB_HOST": "localhost",
	"DB_NAME": "rentaldb",
	"DB_COLLECTION": "rentals",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );