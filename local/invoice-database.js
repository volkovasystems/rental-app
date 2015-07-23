require( "gestalten" )( {
    "HOST": "localhost",
	"PORT": 13002,
	"DB_PORT": 13001,
	"DB_HOST": "localhost",
	"DB_NAME": "invoicedb",
	"DB_COLLECTION": "invoice",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
