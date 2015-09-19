var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Renter = function Renter( ){
	if( this instanceof Renter ){
		Model.call( this, "Renter" );

		this.setScopes( [
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

			"guests"
		] );

		this.setSearches( [
			"firstName",
			"middleName",
			"lastName",

			"displayName",
			"fullName",
			
			"address",
			"contactNumber",
			"eMail",
			
			"idNumber",
			"idType"
		] );

		this.setDomains( {

		} );

	}else{
		return new Renter( );
	}
};

util.inherits( Renter, Model );

Responsible( ).compose( Renter );

Renter.prototype.add = function add( renter ){
	var renterData = this.resolveAddData( renter )
		( {
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
				} )
		} );

	Model.prototype.add.call( this, renterData );

	return this;
};

Renter.prototype.update = function update( renter, reference ){
	var renterData = this.resolveUpdateData( renter )
		( {
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
			} )( renter )
		} );

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
module.exports = Renter;