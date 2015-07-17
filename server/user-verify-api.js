var _ = require( "lodash" );
var util = require( "util" );

var User = USER;

/*:
	This will check if the accessID exists and it
		will return the user data in full mode.
*/
APP.get( "/user/verify/:accessID",
	function onVerifyAccess( request, response ){
		var accessID = request.params.accessID;

		User( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, verified ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else if( verified ){
						this.self.notify( );

					}else{
						this.self.flush( ).reply( response, 403, "failed", "invalid access" );
					}
				} )
			.exists( accessID )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", user );
					}
				} )
			.set( "disableScope", true )
			.pick( "accessID", accessID );
	} );