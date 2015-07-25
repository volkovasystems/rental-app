var express = require( "express" );
var URI = require( "URIjs" );

APP.use( function onRequest( request, response, next ){
	var subdomain = ( new URI( request.url ) ).subdomain( );

	var directory = STATIC_DIRECTORY;
	if( subdomain &&
		"STATIC_DIRECTORY_LIST" in global &&
		subdomain in STATIC_DIRECTORY_LIST )
	{
		directory = STATIC_DIRECTORY_LIST[ subdomain ];

	}else{
		response.redirect( "/#status=404" );
	}

	express[ "static" ]( directory )( request, response, next );
} );

/*:
	This will redirect your request to the site with status = 404
*/
APP.use( function onRequest( request, response, next ){
	response.redirect( "/#status=404" );
} );
