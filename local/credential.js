require( "read-json-file-sync" ).globalize( );

module.exports = {
    "USERNAME": readJSONFileSync( "./local/username.json" ),
	"PASSWORD": readJSONFileSync( "./local/password.json" )
};
