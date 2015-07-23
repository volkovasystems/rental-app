require( "gestalten" )( {
    "HOST": "localhost",
	"PORT": 14002,
	"DB_PORT": 14001,
	"DB_HOST": "localhost",
	"DB_NAME": "mediadb",
	"DB_COLLECTION": "media",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
