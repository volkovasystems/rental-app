var _ = require( "lodash" );
var async = require( "async" );
var chance = require( "chance" ).Chance( );
var crypto = require( "crypto" );
var secrets = require( "secrets.js" );
var unirest = require( "unirest" );
var util = require( "util" );

var encodePassphrase = require( "encode-passphrase" );
var decodePassphrase = require( "decode-passphrase" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var User = function User( ){
	if( this instanceof User ){
		Model.call( this, "User" );

		this.setScopes( [
			"accessID",

			"firstName",
			"middleName",
			"lastName",

			"fullName",
			"displayName",

			"userName"
		] );

		this.setSearches( [
			"firstName",
			"middleName",
			"lastName",
			"fullName",
			"displayName",
			"userName"
		] );

		this.setDomains( { } );

	}else{
		return new User( );
	}
};

util.inherits( User, Model );

Responsible( ).compose( User );

User.prototype.add = function add( user ){
	var userData = this.resolveAddData( {
		"userID": this.userID,
		"accessID": this.accessID,

		"firstName": user.firstName,
		"middleName": user.middleName,
		"lastName": user.lastName,

		"userName": user.userName,
		"eMail": user.eMail
	} );

	Model.prototype.add.call( this, userData );

	return this;
};

User.prototype.update = function update( user, reference ){
	var userData = this.resolveUpdateData( {
		"accessID": this.accessID,

		"firstName": user.firstName,
		"middleName": user.middleName,
		"lastName": user.lastName,

		"userName": user.userName,
		"eMail": user.eMail
	} );

	Model.prototype.update.call( this, userData, reference );

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

	if( !secretReference ){
		this.result( new Error( "secret reference is empty" ) );
	}

	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			user.userName,
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

	if( Array.isArray( user.passphrase ) ){
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
	if( Array.isArray( user.passphrase ) ){
		return decodePassphrase( user.passphrase, user.eMail );

	}else if( typeof user.passphrase == "string" ){
		return user.passphrase;

	}else{
		throw new Error( "invalid passphrase" );
	}
};

global.User = User;
module.exports = User;