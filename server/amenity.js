var _ = require( "lodash" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Amenity = function Amenity( ){
	if( this instanceof Amenity ){
		MODEL.call( this, "Amenity" );

		this.scopes = [ 
			"name", 
			"title", 
			"description", 
			"image", 
			"referenceID"
		];

		this.searches = [ 
			"name", 
			"title", 
			"description" 
		];

		this.domains = {

		};

	}else{
		return new Amenity( );
	}
};

util.inherits( Amenity, MODEL );

RESPONSIBLE( ).compose( Amenity );

Amenity.prototype.add = function add( amenity ){
	var amenityData = _.extend( {
		"amenityID": this.amenityID,
		
		"name": amenity.name,
		"title": amenity.title,
		"description": amenity.description,
		"image": amenity.image,
		
		"scopes": this.scopes,
		"searches": this.searches
	}, this.modelData );

	MODEL.prototype.add.call( this, amenityData );

	return this;
};

Amenity.prototype.update = function update( amenity, reference ){
	var amenityData = _.extend( {
		"name": amenity.name || null,
		"title": amenity.title || null,
		"description": amenity.description || null,
		"image": amenity.image || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null
	}, this.modelData );

	MODEL.prototype.update.call( this, amenityData, reference );

	return this;
};

Amenity.prototype.createReferenceID = function createReferenceID( amenity ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			amenity.name,
			amenity.title,
			amenity.image
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Amenity.prototype.createAmenityID = function createAmenityID( amenity ){
	var amenity = JSON.stringify( amenity );

	var amenityID = crypto.createHash( "sha512" )
		.update( amenity )
		.digest( "hex" )
		.toString( );

	this.references.push( amenityID );

	this.amenityID = amenityID;

	return this;
};

global.AMENITY = Amenity;