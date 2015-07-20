var _ = require( "lodash" );
var util = require( "util" );

var decodePassphrase = require( "./decode-passphrase.js" );

User.prototype.register = function register( user ){
	this
		.createReferenceID( user )
		.createUserID( user )
		.createAccessID( user )
		.add( user );

	return this;
};

/*:
	This will check if the login data was empty.
*/
APP.all( "/user/register",
	function onRegisterUser( request, response, next ){
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
	This will check if the eMail already exists.
*/
APP.all( "/user/register",
	function onUserRegister( request, response, next ){
		var user = request.body;

		User( )
			.once( "error",
				function onError( error ){
					this.reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, hasEmail ){
					if( error ){
						this.reply( response, 500, "error", error.message );
					
					}else if( hasEmail ){
						this.reply( response, 403, "failed", "email is already taken" );
						
					}else{
						next( );
					}
				} )
			.has( user.eMail, "eMail" );
	} );
APP.all( "/user/register",
	function onUserRegister( request, response, next ){
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
						this.reply( response, 403, "failed", "user is already registered" );
						
					}else{
						next( );
					}
				} )
			.createReferenceID( user )
			.exists( );
	} );
APP.post( "/user/register",
	function onRegisterUser( request, response ){
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
			.register( user );
	} );