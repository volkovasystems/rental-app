var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Social = function Social( ){
	if( this instanceof Social ){
		MODEL.call( this, "Social" );

		this.scopes = [ 
			"type",
			"accessToken",
			"accountID",
			"eMail",
			"mobileNumber",
			"birthDate",
			"profileURL",
			"profileImage",
			"user"
		];

		this.searches = [ 
			"type",
			"eMail",
			"mobileNumber",
			"birthDate",
			"user"
		];

		this.domains = {

		};

	}else{
		return new Social( );
	}
};

util.inherits( Social, MODEL );

RESPONSIBLE( ).compose( Social );

Social.prototype.add = function add( social ){
	var socialData = _.extend( {
		"socialID": this.socialID,

		"type": social.type,
		"accountID": social.accountID,

		"accessToken": social.accessToken,
		
		"eMail": social.eMail,
		"mobileNumber": social.mobileNumber,
		"birthDate": social.birthDate,
		
		"profileURL": social.profileURL,
		"profileImage": social.profileImage,
		
		"user": social.user,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, socialData );

	return this;
};

Social.prototype.update = function update( social, reference ){
	var socialData = _.extend( {
		"type": social.type,
		"accountID": social.accountID,

		"accessToken": social.accessToken,
		
		"eMail": social.eMail,
		"mobileNumber": social.mobileNumber,
		"birthDate": social.birthDate,
		
		"profileURL": social.profileURL,
		"profileImage": social.profileImage,
		
		"user": social.user,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.update.call( this, socialData, reference );

	return this;
};

Social.prototype.createReferenceID = function createReferenceID( social ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			social.type,
			social.accountID
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Social.prototype.createSocialID = function createSocialID( social ){
	var socialData = JSON.stringify( social );

	var socialID = crypto.createHash( "sha512" )
		.update( socialData )
		.digest( "hex" )
		.toString( );

	this.references.push( socialID );

	this.socialID = socialID;

	return this;
};

global.SOCIAL = Social;



