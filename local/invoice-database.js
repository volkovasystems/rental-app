require( "gestalten" )( {
    "HOST": "localhost",
	"PORT": 13002,
	"DB_PORT": 13001,
	"DB_HOST": "localhost",
	"DB_NAME": "invoicedb",
	"DB_COLLECTION": "invoice",
	"DB_PATH": require( "./db-path.js" ),
	"@require:credential": "./local/credential.js"
} );
