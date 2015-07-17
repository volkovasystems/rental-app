var _ = require( "lodash" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var PriceCategory = function PriceCategory( ){
	if( this instanceof PriceCategory ){
		MODEL.call( this, "PriceCategory" );

		this.scopes = [ 
			"name", 
			"title", 
			"description", 
			"referenceID"
		];

		this.searches = [
			"name",
			"title"
		];

		this.domains = {

		};

	}else{
		return new PriceCategory( );
	}
};

util.inherits( PriceCategory, MODEL );

RESPONSIBLE( ).compose( PriceCategory );

PriceCategory.prototype.add = function add( priceCategory ){
	var priceCategoryData = _.extend( {
		"priceCategoryID": this.priceCategoryID,
		
		"name": priceCategory.name,
		"title": priceCategory.title,
		"description": priceCategory.description,
		
		"scopes": this.scopes
	}, this.modelData );

	MODEL.prototype.add.call( this, priceCategoryData );

	return this;
};

PriceCategory.prototype.update = function update( priceCategory, reference ){
	var priceCategoryData = _.extend( {
		"name": priceCategory.name || null,
		"title": priceCategory.title || null,
		"description": priceCategory.description || null,

		"scopes": this.scopes || null
	}, this.modelData );

	MODEL.prototype.update.call( this, priceCategoryData, reference );

	return this;
};

PriceCategory.prototype.createReferenceID = function createReferenceID( priceCategory ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			priceCategory.name,
			priceCategory.title
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

PriceCategory.prototype.createPriceCategoryID = function createPriceCategoryID( priceCategory ){
	var priceCategory = JSON.stringify( priceCategory );

	var priceCategoryID = crypto.createHash( "sha512" )
		.update( priceCategory )
		.digest( "hex" )
		.toString( );

	this.references.push( priceCategoryID );

	this.priceCategoryID = priceCategoryID;

	return this;
};

global.PRICE_CATEGORY = PriceCategory;