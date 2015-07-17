var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

var User = USER;

User.prototype.verifyAccess = function verifyAccess( accessID ){
	unirest
		.get( APP_SERVER_URL
			.join( "access/verify/@accessID"
				.replace( "@accessID", accessID ) )
			.path( ) )

		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error &&
				response.status >= 500 )
			{
				var error = new Error( response.error );

				this.result( error );

				return;
			}

			if( _.isEmpty( response.body ) ){
				var error = new Error( "empty response data" );
				this.result( error );

				return;
			}

			var status = response.body.status;

			if( status == "error" ){
				var error = new Error( response.body.data );

				this.result( error );
				
			}else if( status == "failed" ){
				this.result( null, false, response.body.data );

			}else{
				this.result( null, response.body.data );
			}
		} ).bind( this ) );

	return this;
};

APP.use( "/api/:accessID/*",
	function onAPIAccess( request, response, next ){
		var accessID = request.params.accessID;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, verified ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( verified ){
						next( );

					}else{
						this.reply( response, 403, "failed", "invalid access" );
					}
				} )
			.verifyAccess( accessID );
	} );