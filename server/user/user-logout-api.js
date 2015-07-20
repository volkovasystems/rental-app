User.prototype.logout = function logout( reference ){
	this.clone( )
		.once( "result",
		( function onResult( error ){
			if( error ){
				this.result( error ).block( );
			}else{
				this.notify( )	
			}
			
		} ).bind( this ) )
		.execute( reference, { "$pull": { "references": reference } } )
		.wait( )
		.once( "result",
		function onResult( ){
			
		} )
		.exists( );
};

/*:
	{
		"access": String
	}
*/
APP.post( "/user/logout",
	function onLogoutUser( request, response ){
		User( )
			.once( "result",
				function onResult( error, hasLoggedOut ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( hasLoggedOut ){
						this.reply( response, 200, "success" );

					}else{
						this.reply( response, 403, "failed", "logout process failed" );
					}
				} )
			.logout( request.body.accessID );
	} );
