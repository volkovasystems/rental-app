var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Slot = function Slot( ){
	if( this instanceof Slot ){
		MODEL.call( this, "Slot" );

		this.scopes = [ 
			"referenceID",
			"name",
			"title",
			"description",
			"status",
			"park",
			"place",
			"price",
			"prices"
		];

		this.searches = [ 
			"name",
			"title",
			"description",
			"status"	 
		];

		this.domains = {

		};

		this.tap( function includePrice( container, callback ){
			var slots = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Slot" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Slot" )
					);
				} )
				.value( );

			this.appendPrices( _.flatten( [ slots ] ), callback );
		} );

		this.tap( function includePark( container, callback ){
			var slots = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Slot" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Slot" )
					);
				} )
				.value( );

			this.appendParks( _.flatten( [ slots ] ), callback );
		} );

		this.tap( function includePlace( container, callback ){
			var slots = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Slot" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Slot" )
					);
				} )
				.value( );

			this.appendPlaces( _.flatten( [ slots ] ), callback );
		} );
		
	}else{
		return new Slot( );
	}
};

util.inherits( Slot, MODEL );

RESPONSIBLE( ).compose( Slot );

Slot.prototype.add = function add( slot ){
	var slotData = _.extend( {
		"slotID": this.slotID,

		"name": slot.name,
		"title": slot.title,
		"description": slot.description,

		"status": slot.status,

		"park": slot.park,
		"place": slot.place,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, slotData );

	return this;
};

Slot.prototype.update = function update( reference, slot ){
	var slotData = _.extend( {
		"name": slot.name || null,
		"title": slot.title || null,
		"description": slot.description || null,

		"status": slot.status || null,

		"park": slot.park || null,
		"place": slot.place || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, reference, slotData );

	return this;
};

Slot.prototype.createReferenceID = function createReferenceID( slot ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			slot.name,
			slot.title,
			slot.place
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Slot.prototype.createSlotID = function createSlotID( slot ){
	var slot = JSON.stringify( slot );

	var slotID = crypto.createHash( "sha512" )
		.update( slot )
		.digest( "hex" )
		.toString( );

	this.references.push( slotID );

	this.slotID = slotID;

	return this;
};

Slot.prototype.appendPrices = function appendPrices( slots, callback ){
	if( this.disableAppendPrices ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( slots.map( ( function onEachSlot( slot ){
		return ( function handler( callback ){
			unirest
				.get( PRICE_SERVER_URL
						.join( "api/@accessID/price/bound/to/@bound"
							.replace( "@accessID", this.accessID )
							.replace( "@bound", slot.referenceID ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var price = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						slot.price = { };
						slot.prices = [ ];

						callback( );

					}else{
						if( price instanceof Array ){
							slot.price = price.pop( );
							slot.prices = price;

						}else{
							slot.price = price;
							slot.prices = [ ];
						}
						
						callback( );
					}
				} ).bind( this ) );
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

Slot.prototype.appendParks = function appendParks( slots, callback ){
	if( this.slotOnly ||
		this.disableAppendParks ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( slots.map( ( function onEachSlot( slot ){
		return ( function handler( callback ){
			if( _.isEmpty( slot.park ) ){
				callback( );

				return;
			}

			unirest
				.get( PARK_SERVER_URL
						.join( "api/@accessID/park/only/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", slot.park ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var park = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						slot.park = { };

						callback( );

					}else{
						slot.park = park;
						
						callback( );
					}
				} ).bind( this ) );
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

Slot.prototype.appendPlaces = function appendPlaces( slots, callback ){
	if( this.slotOnly ||
		this.disableAppendPlaces ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( slots.map( ( function onEachSlot( slot ){
		return ( function handler( callback ){
			if( _.isEmpty( slot.place ) ){
				callback( );

				return;
			}

			unirest
				.get( PLACE_SERVER_URL
						.join( "api/@accessID/place/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", slot.place ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var place = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						slot.place = { };

						callback( );

					}else{
						slot.place = place;
						
						callback( );
					}
				} ).bind( this ) );
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

global.SLOT = Slot;