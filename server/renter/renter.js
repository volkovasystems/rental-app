var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Renter = function Renter( ){
	if( this instanceof Renter ){
		Model.call( this, "Renter" );

		this.scopes = [
			"referenceID",
			"reference",

			"firstName",
			"middleName",
			"lastName",
			"displayName",
			"fullName",

			"address",
			"contactNumber",
			"eMail",

			"idNumber",
			"idType",

			"profilePicture",
			"idImage",

			"guests",

			"name",
			"title",
			"description"
		];

		this.searches = [
			"firstName",
			"middleName",
			"lastName",

			"displayName",
			"fullName",
			
			"address",
			"contactNumber",
			"eMail",
			
			"idNumber",
			"idType",
			
			"name",
			"title",
			"description"
		];

		this.domains = {

		};

	}else{
		return new Renter( );
	}
};

util.inherits( Renter, Model );

Responsible( ).compose( Renter );

Renter.prototype.add = function add( renter ){
	var renterData = _.extend( {
		"renterID": this.renterID,

		"firstName": renter.firstName,
		"middleName": renter.middleName,
		"lastName": renter.lastName,

		"address": renter.address,
		"contactNumber": renter.contactNumber,
		"eMail": renter.eMail,

		"idNumber": renter.idNumber,
		"idType": renter.idType,

		"profilePicture": renter.profilePicture,
		"idImage": renter.idImage,

		"guests": ( renter.guests || [ ] )
			.map( function onEachGuest( guest ){
				return {
					"firstName": guest.firstName,
					"middleName": guest.middleName,
					"lastName": guest.lastName,

					"contactNumber": guest.contactNumber
				};
			} ),

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, renterData );

	return this;
};

Renter.prototype.update = function update( renter, reference ){
	var renterData = _.extend( {
		"firstName": renter.firstName || null,
		"lastName": renter.lastName || null,

		"address": renter.address || null,
		"contactNumber": renter.contactNumber || null,
		"eMail": renter.eMail || null,

		"idNumber": renter.idNumber || null,
		"idType": renter.idType || null,

		"profilePicture": renter.profilePicture || null,
		"idImage": renter.idImage || null,

		"guests": ( function resolveGuests( renter ){
			if( _.isEmpty( renter.guests ) ){
				return null;
			
			}else{
				return renter.guests
					.map( function onEachGuest( guest ){
						return {
							"firstName": guest.firstName,
							"middleName": guest.middleName,
							"lastName": guest.lastName,

							"contactNumber": guest.contactNumber
						};
					} );
			}
		} )( renter ),

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	Model.prototype.update.call( this, renterData, reference );

	return this;
};

Renter.prototype.createReferenceID = function createReferenceID( renter ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			renter.firstName,
			renter.middleName,
			renter.lastName,
			renter.idType,
			renter.idNumber
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Renter.prototype.createRenterID = function createRenterID( renter ){
	var renterData = JSON.stringify( renter );

	var renterID = crypto.createHash( "sha512" )
		.update( renterData )
		.digest( "hex" )
		.toString( );

	this.references.push( renterID );

	this.renterID = renterID;

	return this;
};

global.Renter = Renter;
