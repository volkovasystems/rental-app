var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Rent = function Rent( ){
	if( this instanceof Rent ){
		Model.call( this, "Rent" );

		this.setScopes( [
			"room",
			"renter",

			"moveInDate",
			"moveOutDate",
			
			"waterMeterValue",
			"electricMeterValue",

			"depositPayment",
			"roomPrice"
		] );

		this.setSearches( [
		] );

		this.setDomains( { } );

	}else{
		return new Rent( );
	}
};

util.inherits( Rent, Model );

Responsible( ).compose( Rent );

Rent.prototype.add = function add( rent ){
	var rentData = this.resolveAddData( rent )
		( {
			"rentID": this.rentID,

			"room": rent.room,
			"renter": rent.renter,

			"moveInDate": rent.moveInDate,
			"moveOutDate": rent.moveOutDate,
			
			"waterMeterValue": rent.waterMeterValue,
			"electricMeterValue": rent.electricMeterValue,

			"depositPayment": rent.depositPayment,
			"roomPrice": rent.roomPrice
		} );

	Model.prototype.add.call( this, rentData );

	return this;
};

Rent.prototype.update = function update( rent, reference ){
	var rentData = this.resolveUpdateData( rent )
		( {
			"room": rent.room,
			"renter": rent.renter,

			"moveInDate": rent.moveInDate,
			"moveOutDate": rent.moveOutDate,
			
			"waterMeterValue": rent.waterMeterValue,
			"electricMeterValue": rent.electricMeterValue,

			"depositPayment": rent.depositPayment,
			"roomPrice": rent.roomPrice
		} );

	Model.prototype.update.call( this, rentData, reference );

	return this;
};

Rent.prototype.createReferenceID = function createReferenceID( rent ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			rent.room,
			rent.renter,
			rent.moveInDate,
			rent.moveOutDate
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Rent.prototype.createRentID = function createRentID( rent ){
	var rentData = JSON.stringify( rent );

	var rentID = crypto.createHash( "sha512" )
		.update( rentData )
		.digest( "hex" )
		.toString( );

	this.references.push( rentID );

	this.rentID = rentID;

	return this;
};

global.Rent = Rent;
module.exports = Rent;