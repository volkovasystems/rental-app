var bodyParser = require( "body-parser" );
var compression = require( "compression" );
var express = require( "express" );
var session = require( "express-session" );

global.App = express( );

App.use( function queue( request, response, next ){
	process.nextTick( function onNextTick( ){
		next( );
	} );
} );

App.use( compression( ) );

App.use( bodyParser.json( { "limit": "50mb" } ) );

App.use( bodyParser.urlencoded( { "limit": "50mb", "extended": true } ) );
	
App.use( session( { 
	"secret": "t6v2busw2h&5i$mlzgqo-1((_c3pj9kg-^dh@lq(+7t5t%!zj^",
	"resave": true,
	"saveUninitialized": true
} ) );

/*:
	Solution taken from this:
	https://gist.github.com/cuppster/2344435
*/
App.use( function allowCrossDomain( request, response, next ){
	response.header( "Access-Control-Allow-Origin", "*" );
	response.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" );
	response.header( "Access-Control-Allow-Headers", "Content-Type, Accept, Server-Name" );
	response.header( "Access-Control-Allow-Credentials", true );
	response.header( "Access-Control-Max-Age", 10 );
	response.header( "Cache-Control", "no-cache, no-store, must-revalidate" );

	response.header( "Server-Name", "renter" );

	if( "OPTIONS" == request.method.toUpperCase( ) ){
		response.sendStatus( 200 );

	}else{
		next( );
	}
} );