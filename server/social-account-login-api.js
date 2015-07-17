var _ = require( "lodash" );
var unirest = require( "unirest" );
var util = require( "util" );

var Social = SOCIAL;

/*:
	This is a special delete we used when
		the integration with the user server failed.
*/
Social.prototype.retractSocialAccount = function retractSocialAccount( reason ){
	Social( )
		.set( "mainSelf", this )
		.clone( )
		.once( "result",
			function onResult( error ){
				if( error ){
					this.self
						.flush( )
						.mainSelf
						.result( new Error( [
								reason,
								error.message
							] ) );

				}else{
					this.self.notify( );
				}
			} )
		.remove( this.referenceID )
		.self
		.wait( )
		.once( "result",
			function onResult( error, existing ){
				if( error ){
					this
						.mainSelf
						.result( new Error( [
							reason,
							error.message
						] ) );

				}else if( existing ){
					this
						.mainSelf
						.result( new Error( [
							reason,
							"failed to delete social data"
						] ) );

				}else{
					this
						.mainSelf
						.result( new Error( reason ) );
				}
			} )
		.exists( this.referenceID );

	return this;
};

/*:
	This will pair and request accessID from the user server.
*/
Social.prototype.integrateUser = function integrateUser( account ){
	account.social = this.referenceID;

	unirest
		.post( USER_SERVER_URL
			.join( "user/social/login" )
			.path( ) )

		.send( account )
		
		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error &&
				response.status <= 500 )
			{
				//: I'm not sure if this is an error instance.
				this.retractSocialAccount( response.error );

				return;
			}

			if( _.isEmpty( response.body ) ){
				var error = new Error( "empty response data" );
				this.result( error );

				return;
			}

			var status = response.body.status;
			var user = response.body.data;

			if( status == "error" ){
				this.retractSocialAccount( response.body.data );

			}else if( status == "failed" ){
				this.retractSocialAccount( "failed to integrate user" );				

			}else{
				this
					.clone( )
					.once( "result",
						function onResult( error ){
							if( error ){
								this.self.retractSocialAccount( error.message );

							}else{
								this.self.result( null, user );
							}
						} )
					.edit( "user", user.referenceID );
			}
			
		} ).bind( this ) );

	return this;
};

/*:
	This will just request accessID from the user server.
*/
Social.prototype.loginUser = function loginUser( account ){
	account.social = this.referenceID;

	unirest
		.post( USER_SERVER_URL
			.join( "user/social/login" )
			.path( ) )

		.send( account )
		
		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error &&
				response.status <= 500 )
			{
				this.result( response.error );

				return;
			}

			var status = response.body.status;
			var user = response.body.data;

			if( status == "error" ||
				status == "failed" )
			{
				this.result( response.body.data );

			}else{
				this.result( null, user );
			}
			
		} ).bind( this ) );

	return this;
};

Social.prototype.checkFacebookAccess = function checkFacebookAccess( account ){
	var accessToken = account.accessToken;

	unirest
		.get( [ 
				"https://graph.facebook.com/me",
				[ "access_token", accessToken ].join( "=" )
			].join( "?" ) )

		.end( ( function onResponse( response ){
			if( "error" in response && 
				response.error &&
				response.status <= 500 )
			{
				var error = new Error( response.error );

				this.result( error );

				return;
			}

			/*:
				@todo:
					We should check if the passed data
						matches the retrieved data.
				@end-todo
			*/
			var data = JSON.parse( response.body );

			if( "error" in data ){
				var error = new Error( data.error );

				this.result( error );

			}else{
				this.result( );
			}
		} ).bind( this ) );

	return this;
};

Social.prototype.checkAccountAccess = function checkAccountAccess( type, account ){
	if( type == "facebook" ){
		this.checkFacebookAccess( account );
		
	}else{
		this.result( new Error( "social account not currently supported" ) );
	}

	return this;
};

/*:
	First we need to check if the social data
		already exists.

	If it exists, we should proceed with login.

	If it does not exists, we should proceed with integration.
*/
APP.all( "/social/:type/account/login",
	function onLoginSocialAccount( request, response, next ){
		var account = request.body;

		var type = request.params.type;
		
		Social( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else{
						next( );
					}
				} )
			.checkAccountAccess( type, account );
	} )
APP.all( "/social/:type/account/login",
	function onLoginSocialAccount( request, response, next ){
		var account = request.body;

		Social( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( existing ){
						this.self.notify( );
						
					}else{
						this.self.flush( );

						next( );
					}
				} )
			.createReferenceID( account )
			.exists( )
			.wait( )
			.self
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else{
						this.reply( response, 200, "success", { "accessID": user.accessID } );
					}
				} )
			.loginUser( account );
	} );
APP.post( "/social/:type/account/login",
	function onLoginSocialAccount( request, response ){
		var account = request.body;

		Social( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, account ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else{
						this.self.referenceID = account.referenceID;

						this.self.notify( );
					}
				} )
			.createReferenceID( account )
			.createSocialID( account )
			.add( account )
			.wait( )
			.self
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else{
						this.reply( response, 200, "success", { "accessID": user.accessID } );
					}
				} )
			.integrateUser( account );
	} );