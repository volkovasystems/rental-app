var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var secrets = require( "secrets.js" );

if( argv.phrase ){
	var share = argv.share || 5;

	var pad = argv.pad || 1024;

	var hexPhrase = secrets.str2hex( argv.phrase );

	var shares = secrets.share( hexPhrase, share, 2, pad );

	shares = _( shares ).shuffle( ).take( 2 ).value( );

	var pair = { };

	pair[ shares[ 0 ] ] = shares[ 1 ];

	console.log( JSON.stringify( pair ) );
}