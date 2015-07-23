require( "gestalten" )( {
	"PORT": 13000,
	"DB_PORT": 13001,
	"DB_HOST": "localhost",
	"DB_NAME": "invoicedb",
	"DB_COLLECTION": "invoice",
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
