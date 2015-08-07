var _ = require( "lodash" );
var util = require( "util" );

var decodePassphrase = require( "decode-passphrase" );

User.prototype.login = function login( user ){
	this
		.createReferenceID( user )
		.createAccessID( user )
		.update( user );

	return this;
};

/*:
	This will check the scope.
*/
APP.all( "/user/login",
 	function onUserLogin( request, response, next ){

	} );
/*:
	This will check if the login data was empty.
*/
APP.all( "/user/login",
	function onLoginUser( request, response, next ){
		var user = request.body;

		if( _.isEmpty( user ) ){
			response
				.status( 403 )
				.json( {
					"status": "failed",
					"data": "request data is empty"
				} );

		}else{
			next( );
		}
	} );
/*:
	This will check if the user name exists.
*/
APP.all( "/user/login",
	function onLoginUser( request, response, next ){
		var user = request.body;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, hasUserName ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( hasUserName ){
						next( );

					}else{
						this.reply( response, 403, "failed", "user name is not associated with any user" );
					}
				} )
			.has( user.userName, "userName" );
	} );
/*:
	This will check if the user already exists
		using the referenceID.
*/
APP.all( "/user/login",
	function onLoginUser( request, response, next ){
		var user = request.body;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, existing ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( existing ){
						next( );

					}else{
						this.reply( response, 403, "failed", "user is not yet registered" );
					}
				} )
			.createReferenceID( user )
			.exists( );
	} );
/*:
	This will check if the secretReference
		matches the given user name.

	Then it will place the user data in a session.
*/
APP.all( "/user/login",
	function onLoginUser( request, response, next ){
		var user = request.body;

		var secretReference = "";
		try{
			secretReference = User( ).extractSecretReference( user );

		}catch( error ){
			this.reply( response, 500, "error", error.message );

			return;
		}

		User( )
			.createReferenceID( user )
			.clone( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, userNameMatches ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );

					}else if( userNameMatches ){
						this.self.notify( );

					}else{
						this.self.flush( ).reply( response, 403, "failed", "user does not match the given passphrase" );
					}
				} )
			.set( "reference", secretReference )
			.confirm( {
				"userName": user.userName
			}, 1 )
			.self
			.wait( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, thisUser ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else if( !_.isEmpty( thisUser ) ){
						request.session.user = user;

						next( );

					}else{
						this.reply( response, 403, "failed", "user data is empty" );
					}
				} )
			.pick( );
	} );
APP.post( "/user/login",
	function onLoginUser( request, response ){
		var user = request.body;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", { "accessID": this.accessID } );
					}
				} )
			.login( user );
	} );
