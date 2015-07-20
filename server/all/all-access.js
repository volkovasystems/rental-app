var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

APP.use( "/api/:accessID/*",
	function onAPIAccess( request, response, next ){
		var rootResponse = response;

		var accessID = request.params.accessID;

		unirest
			.get( APP_SERVER_URL
				.join( "access/verify/@accessID"
					.replace( "@accessID", accessID ) )
				.path( ) )

			.end( function onResponse( response ){
				if( "error" in response && 
					response.error &&
					response.status >= 500 )
				{
					var error = new Error( response.error );

					rootResponse
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

					return;
				}

				if( _.isEmpty( response.body ) ){
					var error = new Error( "empty response data" );
					
					rootResponse
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

					return;
				}

				var status = response.body.status;

				if( status == "error" ){
					var error = new Error( response.body.data );

					rootResponse
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );
					
				}else if( status == "failed" ){
					var failureMessage = response.body.data;

					rootResponse
						.status( 403 )
						.json( {
							"status": "failed",
							"data": failureMessage
						} );

				}else{
					var user = response.body.data;

					request.session.user = user;

					next( );
				}
			} );
	} );