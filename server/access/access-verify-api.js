var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

/*:
	Note that these methods are placed here because
		this should be accessible even if the
		global api endpoint for accessID verification is not present.
*/

/*:
	Verify if the user to server interaction is applicable.
*/
Access.prototype.verifyUserAccess = function verifyUserAccess( accessID ){
	unirest
		.get( USER_SERVER_URL
			.join( "user/verify/@accessID"
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

/*:
	Verify if the server to server interaction is applicable.
*/
Access.prototype.verifyDomainAccess = function verifyDomainAccess( reference ){
	this.clone( )
		.once( "result", ( this.result ).bind( this ) )
		.exists( reference );

	return this;
};

/*:
	We have to determine if the accessID is a domain type.
*/
Access.prototype.verifyAccess = function verifyAccess( accessID ){
	Access( )
		.set( "mainSelf", this )
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, result, state ){
				if( error ){
					this.self.flush( ).mainSelf.result( error );

				}else if( result ){
					this.self.flush( ).mainSelf.result( null, result );

				}else{
					this.self.notify( );
				}
			} )
		.verifyUserAccess( accessID )
		.self
		.wait( )
		.once( "error",
			function onError( error ){
				this.mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, result, state ){
				if( error ){
					this.mainSelf.result( error );

				}else if( result ){
					this.mainSelf.result( null, result );

				}else{
					this.mainSelf.result( null, false, state );
				}
			} )
		.verifyDomainAccess( accessID );

	return this;
};

APP.get( "/access/verify/:accessID",
	function onVerifyAccess( request, response ){
		var accessID = request.params.accessID;

		Access( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, accessData ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( accessData ){
						this.reply( response, 200, "success", accessData );

					}else{
						this.reply( response, 403, "failed", "invalid access" );
					}
				} )
			.verifyAccess( accessID );
	} );
