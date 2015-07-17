var unirest = require( "unirest" );

var Media = MEDIA;

Media.prototype.verifyMedia = function verifyMedia( accessID ){
	unirest.get( USER_SERVER_URL
		.join( "user/verify/@accessID".replace( "@accessID", accessID ) ) )
		.end( ( function onResponse( response ){
			var status = response.body.status;

			if( status == "error" ){
				var error = new Error( response.body.data );

				this.result( error );
				
			}else if( status == "failed" ){
				this.result( );

			}else{
				this.result( null, response.body.data );
			}
		} ).bind( this ) );
};

APP.use( "/api/:accessID/*",
	function onAPIAccess( request, response, next ){
		Media( )
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
			.verifyMedia( request.params.accessID );
	} );