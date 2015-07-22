var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Rent = function Rent( ){
	if( this instanceof Rent ){
		MODEL.call( this, "Rent" );

		this.scopes = [
			"referenceID",
			"roomPrice",

			"moveInDate",
			"moveOutDate",
			"duration",

			"depositPayment",
			"waterMeterValue",
			"electricMeterValue",

			"occupants"
		];

		this.searches = [

		];

		this.domains = {

		};

	}else{
		return new Rent( );
	}
};

util.inherits( Rent, MODEL );

RESPONSIBLE( ).compose( Rent );

Rent.prototype.add = function add( rent ){
	var rentData = _.extend( {
		"rentID": this.rentID,



		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, rentData );

	return this;
};

Rent.prototype.update = function update( rent, reference ){
	var rentData = _.extend( {


		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.update.call( this, rentData, reference );

	return this;
};

Rent.prototype.createReferenceID = function createReferenceID( rent ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [


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

global.RENT = Rent;
