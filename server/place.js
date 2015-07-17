var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Place = function Place( ){
	if( this instanceof Place ){
		MODEL.call( this, "Place" );

		this.scopes = [ 
			"referenceID",
			"name", 
			"title", 
			"description", 
			"address", 
			"latitude", 
			"longitude", 
			"zoom", 
			"amenities", 
			"images", 
			"instructions",
			"rate",

			"price",
			"prices",
			
			"park",
			"parks",
			
			"slot",
			"slots",
			"availableSlotCount"
		];

		this.searches = [ 
			"name", 
			"title", 
			"description", 
			"address", 
			"latitude", 
			"longitude", 
			"amenities",
			"rate"
		];

		this.domains = {

		};

		this.tap( function includeAmenity( container, callback ){
			var places = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Place" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Place" )
					);
				} )
				.value( );

			this.appendAmenities( _.flatten( [ places ] ), callback );
		} );

		this.tap( function includePrice( container, callback ){
			var places = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Place" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Place" )
					);
				} )
				.value( );

			this.appendPrices( _.flatten( [ places ] ), callback );
		} );

		this.tap( function includeAvailableSlotCount( container, callback ){
			var places = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Place" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Place" )
					);
				} )
				.value( );

			this.appendAvailableSlotCount( _.flatten( [ places ] ), callback );
		} );		

	}else{
		return new Place( );
	}
};

util.inherits( Place, MODEL );

RESPONSIBLE( ).compose( Place );

Place.prototype.add = function add( place ){
	this.listInstructions( place );

	var placeData = _.extend( {
		"placeID": this.placeID,

		"name": place.name,
		"title": place.title,
		"description": place.description,
		"address": place.address,

		"latitude": place.latitude,
		"longitude": place.longitude,
		"zoom": place.zoom,

		"amenities": place.amenities,
		"images": place.images,
		"instructions": place.instructions,

		"rate": place.rate,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, placeData );

	return this;
};

Place.prototype.update = function update( place, reference ){
	this.listInstructions( place );
	
	var placeData = _.extend( {
		"name": place.name || null,
		"title": place.title || null,
		"description": place.description || null,
		"address": place.address || null,

		"latitude": place.latitude || null,
		"longitude": place.longitude || null,
		"zoom": place.zoom || null,

		"amenities": place.amenities || null,
		"images": place.images || null,
		"instructions": place.instructions || null,

		"rate": place.rate || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, placeData, reference );

	return this;
};

Place.prototype.createReferenceID = function createReferenceID( place ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			place.name,
			place.address,
			place.latitude,
			place.longitude 
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Place.prototype.createPlaceID = function createPlaceID( place ){
	var place = JSON.stringify( place );

	var placeID = crypto.createHash( "sha512" )
		.update( place )
		.digest( "hex" )
		.toString( );

	this.references.push( placeID );

	this.placeID = placeID;

	return this;
};

Place.prototype.appendAmenities = function appendAmenities( places, callback ){
	async.parallel( places.map( ( function onEachPlace( place ){
		return ( function handler( callback ){
			if( _.isEmpty( place.amenities ) ){
				callback( );

				return;
			}
			
			async.parallel( place.amenities
				.map( function onEachAmenity( amenity ){
					return function handler( callback ){
						AMENITY( )
							.once( "result",
								function onResult( error, amenity ){
									if( error ){
										callback( error );

									}else{
										callback( null, amenity );
									}
								} )
							.get( "name", amenity )
					};
				} ), 

			function onRetrieved( error, amenities ){
				if( error ){
					callback( error );
				
				}else{
					place.amenities = _.compact( amenities );

					callback( );
				}
			} );
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

Place.prototype.appendPrices = function appendPrices( places, callback ){
	if( this.disableAppendPrices ){
		callback( );

		return;
	}

	var url = "";
	if( _.isEmpty( this.accessID ) ){
		url = "price/bound/to/@bound";
	
	}else{
		url = "api/@accessID/price/bound/to/@bound"
			.replace( "@accessID", this.accessID );
	}

	async.parallel( places.map( ( function onEachPlace( place ){
		return ( function handler( callback ){
			unirest
				.get( PRICE_SERVER_URL
						.join( url
							.replace( "@bound", place.referenceID ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var data = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						place.price = { };
						place.prices = [ ];

						callback( );

					}else{
						if( data instanceof Array ){
							place.price = data.pop( );
							place.prices = data;

						}else{
							place.price = data;
							place.prices = [ ];
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

/*:
	This will return the park and slot only data including the prices.
*/
Place.prototype.getAllParkAndSlot = function getAllParkAndSlot( place ){
	if( _.isEmpty( this.accessID ) ){
		this.result( );

		return this;
	}

	var placeData = { };

	async.parallel( [
		function onGetAllParkInPlace( callback ){
			unirest
				.get( PARK_SERVER_URL
						.join( "api/@accessID/park/all/in/place/@place"
							.replace( "@accessID", this.accessID )
							.replace( "@place", place ) )
						.path( ) )

				.end( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var parks = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						placeData.parks = [ ];

						callback( );

					}else{
						placeData.parks = parks;
						
						callback( );
					}
				} );
		},

		function onGetAllSlotInPlace( callback ){
			unirest
				.get( SLOT_SERVER_URL
						.join( "api/@accessID/slot/all/in/place/@place"
							.replace( "@accessID", this.accessID )
							.replace( "@place", place ) )
						.path( ) )

				.end( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var slots = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						placeData.slots = [ ];

						callback( );

					}else{
						placeData.slots = slots;
						
						callback( );
					}
				} );
		}
	],
		( function lastly( error ){
			if( error ){
				this.result( error );

			}else{
				this.result( null, placeData );
			}
		} ).bind( this ) );

	return this;
};

/*:
	This will split the instructions string by periods.
*/
Place.prototype.listInstructions = function listInstructions( place ){
	if( !( place.instructions instanceof Array ) &&
		!_.isEmpty( place.instructions ) )
	{
		place.instructions = place.instructions.split( "." )
			.map( function onEachInstruction( instruction ){
				return instruction.trim( ) + ".";
			} );
	
	}else if( !( place.instructions instanceof Array ) ){
		place.instructions = [ ];
	}

	return this;
};

/*:
	This supports two endpoints.

	The purposes was to enable the feature to load the place data
		with slot counts for the user to see the preview of parking
		places even he is not logged in.
*/
Place.prototype.appendAvailableSlotCount = function appendAvailableSlotCount( places, callback ){
	if( !this.enableAppendAvailableSlotCount ||
		this.disableAppendAvailableSlotCount )
	{
		callback( );

		return;
	}

	var url = "";
	if( _.isEmpty( this.accessID ) ){
		url = "slot/count/available/at/place/@place";
	
	}else{
		url = "api/@accessID/slot/count/available/at/place/@place"
			.replace( "@accessID", this.accessID );
	}

	async.parallel( places.map( ( function onEachPlace( place ){
		return ( function handler( callback ){
			unirest
				.get( SLOT_SERVER_URL
					.join( url
						.replace( "@place", place.referenceID ) )
					.path( ) )
				
				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					var status = response.body.status;
					var slot = response.body.data;

					var availableSlotCount = 0;
					if( slot && 
						typeof slot == "object" &&
						"availableSlotCount" in slot )
					{
						availableSlotCount = slot.availableSlotCount;
					}

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						place.availableSlotCount = -1;

						callback( );

					}else{
						place.availableSlotCount = availableSlotCount;
						
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

global.PLACE = Place;