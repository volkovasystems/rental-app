require( "gestalten" )( {
	"PORT": 9000,
	"DB_PORT": 9001,
	"DB_HOST": "localhost",
	"DB_NAME": "userdb",
	"DB_COLLECTION": "users",
	//: The user scopes define the level of access to the user server.
	"USER_SCOPES": [
		"root",
		"admin",
		"staff"
	],
	"@require:credential": "./local/credential.js",
	"@require:server-list": "./local/server-list.js"
} );
