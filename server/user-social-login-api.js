var _ = require( "lodash" );
var chance = require( "chance" ).Chance( );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

var User = USER;

/*:
	This will be used to reference the user using email and account id.
*/
User.prototype.createSocialReferenceID = function createSocialReferenceID( account ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [ 
			account.eMail, 
			account.accountID 
		] ).join( ":" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

/*:
	The access id will be the hash using PBKDF2
*/
User.prototype.createSocialAccessID = function createSocialAccessID( account ){
	try{
		var accessID = crypto.pbkdf2Sync( account.accessToken, 
			chance.paragraph( { "sentences": 10 } ), 
			chance.integer( { "min": 9000, "max": 10000 } ),
			64, "sha512" );

		accessID = new Buffer( accessID ).toString( "hex" );

		this.references.push( accessID );

		this.accessID = accessID;

	}catch( error ){
		this.result( error );
	}
	
	return this;
};

/*:
	@todo:
		Check if the user is already logged in.

		Ensure that only the social server can access this.

		Also check if the eMail is already taken we just need to bind the data.
	@end-todo
*/
APP.all( "/user/social/login",
	function onLoginUserSocial( request, response, next ){
		var account = request.body;

		if( _.isEmpty( account ) ){
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
	This will check if the user already registered and we just need to bind
		the social data.
*/
APP.all( "/user/social/login",
	function onLoginUserSocial( request, response, next ){
		var account = request.body;

		User( )
			.clone( )
			.once( "error",
				function onError( error ){
					this.self.flush( ).reply( response, 500, "error", error.message );
				} )
			.once( "result",
				function onResult( error, hasEMail ){
					if( error ){
						this.self.flush( ).reply( response, 500, "error", error.message );
					
					}else if( hasEMail ){
						this.self.flush( );

						next( );
						
					}else{
						this.self.notify( );
					}
				} )
			.has( account.eMail, "eMail" )
			.self
			.wait( )
			.once( "result",
				function onResult( error, user ){
					if( error ){
						this.reply( response, 500, "error", error.message );

					}else{
						this.reply( response, 200, "success", user );
					}
				} )
			.createSocialReferenceID( account )
			.createSocialAccessID( account )
			.update( account );
	} );
APP.all( "/user/social/login",
	function onLoginUserSocial( request, response, next ){
		var account = request.body;

		User( )
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
						next( );
					}
				} )
			.createSocialReferenceID( account )
			.exists( )
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
			.createSocialReferenceID( account )
			.createSocialAccessID( account )
			.update( account );
	} );
APP.post( "/user/social/login",
	function onLoginUserSocial( request, response ){
		var account = request.body;

		User( )
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
			.createSocialReferenceID( account )
			.createSocialAccessID( account )
			.add( account );
	} );