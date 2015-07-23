require( "gestalten" )( {
	"HOST": "localhost",
	"PORT": 19002,
	"DB_PORT": 19001,
	"DB_HOST": "localhost",
	"DB_NAME": "analyticsdb",
	"DB_COLLECTION": "analytics",
	"DB_PATH": require( "select-path" )( "C:\\db\\rental", "~/db/rental" ),
	"@require:credential": "./local/credential.js"
} );
