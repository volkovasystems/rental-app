var express = require( "express" );

APP.use( express[ "static" ]( STATIC_DIRECTORY ) );

/*:
	This will redirect your request to the site with status = 404
*/
APP.use( function onRequest( request, response, next ){
	response.redirect( "/#status=404" );
} );