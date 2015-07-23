require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 12002,
	"DB_PORT": 12001,
	"DB_HOST": "localhost",
	"DB_NAME": "rentdb",
	"DB_COLLECTION": "rent",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
