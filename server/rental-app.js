var bodyParser = require( "body-parser" );
var compression = require( "compression" );
var express = require( "express" );
var session = require( "express-session" );

global.APP = express( );

APP.use( function queue( request, response, next ){
	process.nextTick( function onNextTick( ){
		next( );
	} );
} );

APP.use( compression( ) );

APP.use( bodyParser.json( { "limit": "50mb" } ) );

APP.use( bodyParser.urlencoded( { "limit": "50mb", "extended": true } ) );
	
APP.use( session( { 
	"secret": "tm%rv2+)=7+7&f)lf+n-(kpv_i5dv)+l#r)x9+oe8)!+eq5gig",
	"resave": true,
	"saveUninitialized": true
} ) );

/*:
	Solution taken from this:
	https://gist.github.com/cuppster/2344435
*/
APP.use( function allowCrossDomain( request, response, next ){
	response.header( "Access-Control-Allow-Origin", "*" );
	response.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" );
	response.header( "Access-Control-Allow-Headers", "Content-Type, Accept, Server-Name" );
	response.header( "Access-Control-Allow-Credentials", true );
	response.header( "Access-Control-Max-Age", 10 );
	response.header( "Cache-Control", "no-cache, no-store, must-revalidate" );
	  
	response.header( "Server-Name", "app" );

	if( "OPTIONS" == request.method.toUpperCase( ) ){
		response.sendStatus( 200 );

	}else{
		next( );
	}
} );