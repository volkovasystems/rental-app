var _ = require( "lodash" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Currency = function Currency( ){
	if( this instanceof Currency ){
		MODEL.call( this, "Currency" );

		this.scopes = [ 
			"name", 
			"title", 
			"description", 
			"symbol", 
			"referenceID"
		];

		this.searches = [ 
			"name", 
			"title", 
			"description", 
			"symbol" 
		];

		this.domains = {

		};

	}else{
		return new Currency( );
	}
};

util.inherits( Currency, MODEL );

RESPONSIBLE( ).compose( Currency );

Currency.prototype.add = function add( currency ){
	var currencyData = _.extend( {
		"currencyID": this.currencyID,
		
		"name": currency.name,
		"title": currency.title,
		"description": currency.description,

		"symbol": currency.symbol,
		
		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, currencyData );

	return this;
};

Currency.prototype.update = function update( currency, reference ){
	var currencyData = _.extend( {
		"name": currency.name || null,
		"title": currency.title || null,
		"description": currency.description || null,

		"symbol": currency.symbol || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null
	}, this.modelData );

	MODEL.prototype.update.call( this, currencyData, reference );

	return this;
};

Currency.prototype.createReferenceID = function createReferenceID( currency ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			currency.name,
			currency.symbol
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Currency.prototype.createCurrencyID = function createCurrencyID( currency ){
	var currency = JSON.stringify( currency );

	var currencyID = crypto.createHash( "sha512" )
		.update( currency )
		.digest( "hex" )
		.toString( );

	this.references.push( currencyID );

	this.currencyID = currencyID;

	return this;
};

global.CURRENCY = Currency;