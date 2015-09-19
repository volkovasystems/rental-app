require( "gestalten" )( {
	"PORT": 7000,
	"DB_PORT": 7001,
	"DB_HOST": "localhost",
	"DB_NAME": "alphadb",
	"DB_COLLECTION": "alpha",
	"NAMESPACED_COLLECTION": true,
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
