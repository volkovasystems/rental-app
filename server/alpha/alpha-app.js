var bodyParser = require( "body-parser" );
var compression = require( "compression" );
var express = require( "express" );
var keygen = require( "keygenerator" );
var session = require( "express-session" );
var util = require( "util" );

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
	"secret": keygen.generate( { "specials": true } ),
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

	response.header( "Server-Name", "alpha" );  

	if( "OPTIONS" == request.method.toUpperCase( ) ){
		response.sendStatus( 200 );

	}else{
		next( );
	}
} );
