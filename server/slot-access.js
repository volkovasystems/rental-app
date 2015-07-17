var unirest = require( "unirest" );

var Slot = SLOT;

Slot.prototype.verifyAccess = function verifyAccess( accessID ){
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

		Slot( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, result ){
					if( error ){
						this.reply( response, 500, "error", error.message );
						
					}else if( result ){
						request.session.user = result;
						next( );
					
					}else{
						this.reply( response, 403, "failed" );
					}
				} )
			.verifyAccess( accessID );
	} );