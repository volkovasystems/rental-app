var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var S = require( "string" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Price = function Price( ){
	if( this instanceof Price ){
		MODEL.call( this, "Price" );

		this.scopes = [
			"types",
			"bounds", 
			"amount", 
			"currency", 
			"currencies", 
			"duration", 
			"payOptions",
			"name", 
			"title", 
			"description", 
			"referenceID" 
		];

		this.searches = [ 
			"types", 
			"bounds", 
			"amount", 
			"currency", 
			"currencies", 
			"name", 
			"title", 
			"description", 
			"duration"
		];

		this.tap( function includeCurrency( container, callback ){
			var prices = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Price" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Price" )
					);
				} )
				.value( );

			this.appendCurrencies( _.flatten( [ prices ] ), callback );
		} );

		this.tap( function includePayOption( container, callback ){
			var prices = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Price" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Price" )
					);
				} )
				.value( );

			this.appendPayOptions( _.flatten( [ prices ] ), callback );
		} );

	}else{
		return new Price( );
	}
};

util.inherits( Price, MODEL );

RESPONSIBLE( ).compose( Price );

Price.prototype.add = function add( price ){
	var priceData = _.extend( {
		"priceID": this.priceID,
		
		"types": price.types,

		"bounds": price.bounds,

		"amount": price.amount,
		"currency": price.currency,
		"currencies": price.currencies,

		"duration": price.duration,

		"payOptions": price.payOptions,

		"name": price.name,
		"title": price.title,
		"description": price.description,

		"scopes": this.scopes,
		"searches": this.searches
	}, this.modelData );

	MODEL.prototype.add.call( this, priceData );

	return this;
};

Price.prototype.update = function update( price, reference ){
	var priceData = _.extend( {
		"types": price.types || null,

		"bounds": price.bounds || null,

		"amount": price.amount || null,
		"currency": price.currency || null,
		"currencies": price.currencies || null,

		"duration": price.duration || null,

		"payOptions": price.payOptions || null,

		"name": price.name || null,
		"description": price.description || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null
	}, this.modelData );

	MODEL.prototype.update.call( this, priceData, reference );

	return this;
};

Price.prototype.createReferenceID = function createReferenceID( price ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			price.name,
			price.bounds,
			price.duration
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Price.prototype.createPriceID = function createPriceID( price ){
	var price = JSON.stringify( price );

	var priceID = crypto.createHash( "sha512" )
		.update( price )
		.digest( "hex" )
		.toString( );

	this.references.push( priceID );

	this.priceID = priceID;

	return this;
};

Price.prototype.referenceBounds = function referenceBounds( price ){
	this.references = this.composeReferences( price.bounds );

	return this;
};

Price.prototype.appendCurrencies = function appendCurrency( prices, callback ){
	async.parallel( prices.map( ( function onEachPrice( price ){
		return ( function handler( callback ){
			if( _.isEmpty( price.currency ) ){
				callback( );

				return;
			}
			
			CURRENCY( )
				.once( "result",
					function onResult( error, currency ){
						currency = ( currency || [] )[ 0 ];

						if( error ){
							callback( error );

						}else if( _.isEmpty( currency ) ){
							price.currency = { };

							callback( );

						}else{
							price.currency = currency;

							callback( );
						}
					} )
				.get( "name", price.currency )
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

Price.prototype.appendPayOptions = function appendPayOptions( prices, callback ){
	async.parallel( prices.map( ( function onEachPrice( price ){
		return ( function handler( callback ){
			if( _.isEmpty( price.payOptions ) ){
				callback( );

				return;
			}

			var payOptions = price.payOptions.map( function onEachPayOption( payOption ){
				if( payOption in PAY_OPTIONS ){
					return PAY_OPTIONS[ payOption ];
				
				}else{
					return {
						"name": payOption,
						"title": S( payOption ).humanize( ).toString( )
					};
				}
			} );

			price.payOptions = payOptions;
			
			callback( );
			
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

global.PRICE = Price;