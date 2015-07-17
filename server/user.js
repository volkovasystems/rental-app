var _ = require( "lodash" );
var async = require( "async" );
var chance = require( "chance" ).Chance( );
var crypto = require( "crypto" );
var secrets = require( "secrets.js" );
var unirest = require( "unirest" );
var util = require( "util" );

var encodePassphrase = require( "./encode-passphrase.js" );
var decodePassphrase = require( "./decode-passphrase.js" );

require( "./model.js" );

require( "./responsible.js" );

var User = function User( ){
	if( this instanceof User ){
		MODEL.call( this, "Users" );
		
		this.scopes = [ 
			"referenceID",
			"accessID",

			"firstName", 
			"lastName", 
			
			"birthDate", 
			"eMail", 
			"mobileNumber", 
			
			"profileImage",

			"socials"
		];

		this.searches = [ 
			"firstName", 
			"lastName", 
			"birthDate", 
			"eMail", 
			"mobileNumber"
		];
		
		this.domains = {
			"user": [
				"/api/:accessID/user",
				"/api/:accessID/user/update",
				"/api/:accessID/user/edit",
				"/user/login",
				"/user/register"
			],

			"vehicle": [
			],

			"place": [
				"/api/:accessID/place/all",
				"/api/:accessID/place/:referenceID"
			]
		};

		this.tap( function includeSocialData( container, callback ){
			var users = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Users" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Users" )
					);
				} )
				.value( );

			this.appendSocialData( _.flatten( [ users ] ), callback );
		} );

	}else{
		return new User( );
	}
};

util.inherits( User, MODEL );

RESPONSIBLE( ).compose( User );

User.prototype.add = function add( user ){
	if( "social" in user &&
		user.social &&
		typeof user.social == "string" &&
		!( "socials" in user ) )
	{
		user.socials = [ user.social ];

	}else if( "socials" in user &&
		user.socials &&
		typeof user.socials == "string" &&
		!( user.socials instanceof Array ) )
	{
		user.socials = [ user.socials ];

	}else{
		user.socials = [ ];
	}

	if( "mobileNumber" in user &&
		user.mobileNumber )
	{
		user.mobileNumber = user.mobileNumber.toString( ).replace( /\-/g, "" );
	}

	var userData = _.extend( {
		"userID": this.userID,
		"accessID": this.accessID,

		"firstName": user.firstName,
		"lastName": user.lastName,

		"birthDate": user.birthDate,
		
		"eMail": user.eMail,
		"mobileNumber": user.mobileNumber,

		"profileImage": user.profileImage,

		"socials": user.socials,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, userData );

	return this;
};

User.prototype.update = function update( user, reference ){
	if( "social" in user &&
		user.social &&
		typeof user.social == "string" &&
		!( "socials" in user ) )
	{
		user.socials = [ user.social ];

	}else if( "socials" in user &&
		user.socials &&
		typeof user.socials == "string" &&
		!( user.socials instanceof Array ) )
	{
		user.socials = [ user.socials ];

	}else{
		user.socials = null;
	}

	if( "mobileNumber" in user &&
		user.mobileNumber )
	{
		user.mobileNumber = user.mobileNumber.toString( ).replace( /\-/g, "" );
	}

	var userData = _.extend( {
		"accessID": this.accessID,
		
		"firstName": user.firstName || null,
		"lastName": user.lastName || null,
		"middleName": user.middleName || null,

		"birthDate": user.birthDate || null,
		
		"eMail": user.eMail || null,
		"mobileNumber": user.mobileNumber || null,

		"profileImage": user.profileImage || null,

		"socials": user.socials || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null
	}, this.modelData );

	MODEL.prototype.update.call( this, userData, reference );

	return this;
};

/*:
	This will be used to reference the user 
		using email and passphrase.

	First we need to extract the secretReference.

	This will then be used to create the referenceID.

	The secret reference will then be stored with
		the user document.
*/
User.prototype.createReferenceID = function createReferenceID( user ){
	var secretReference = "";
	
	try{
		secretReference = this.extractSecretReference( user );
	
	}catch( error ){
		this.result( error );

		return this;
	}
	
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [ 
			user.eMail, 
			secretReference 
		] ).join( ":" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( secretReference );
	this.references.push( referenceID );

	this.reference = referenceID;
	this.referenceID = referenceID;

	return this;
};

/*:
	The user id is the hash of the user without the passphrase.
		Because the passphrase uses secret sharing algorithm and
		I found out that the hashes there changes even though
		we have the same threshold.
*/
User.prototype.createUserID = function createUserID( user ){
	var userData = JSON.stringify( _.omit( user, "passphrase" ) );

	var userID = crypto.createHash( "sha512" )
		.update( userData )
		.digest( "hex" )
		.toString( );

	this.references.push( userID );

	this.userID = userID;

	return this;
};

/*:
	The access id will be the hash using PBKDF2
*/
User.prototype.createAccessID = function createAccessID( user ){
	var passphrase = "";

	if( user.passphrase instanceof Array ){
		passphrase = JSON.stringify( user.passphrase );	
	
	}else if( typeof user.passphrase == "string" ){
		passphrase = user.passphrase;
	
	}else{
		this.result( new Error( "invalid passphrase" ) );

		return this;
	}
	
	try{
		var accessID = crypto.pbkdf2Sync( passphrase, 
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

User.prototype.extractSecretReference = function extractSecretReference( user ){
	if( user.passphrase instanceof Array ){
		return decodePassphrase( user.passphrase, user.eMail );

	}else if( typeof user.passphrase == "string" ){
		return user.passphrase;

	}else{
		throw new Error( "invalid passphrase" );
	}
};

User.prototype.encodePassphrase = function encodePassphrase( user ){
	var secretPhrases = encodePassphrase( user.passphrase, user.eMail );
};

User.prototype.determinePassphrase = function determinePassphrase( user ){

};

User.prototype.appendSocialData = function appendSocialData( users, callback ){
	if( this.disableAppendSocialData ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( users.map( ( function onEachUser( user ){
		return ( function handler( callback ){
			if( _.isEmpty( user.socials ) ){
				user.socials = [ ];

				callback( );

				return;
			}

			unirest
				.get( SOCIAL_SERVER_URL
						.join( "api/@accessID/social/account/all/of/owner"
							.replace( "@accessID", this.accessID ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status <= 500 )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var socials = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						user.socials = [ ];

						callback( );

					}else{
						user.socials = socials
						
						callback( );
					}
				} ).bind( this ) );
		} ).bind( this );
	} ).bind( this ) ),
	
	function onAppended( error ){
		if( error ){
			callback( error );

		}else{
			callback( );
		}
	} );
	
	return this;
};

global.USER = User;