var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Park = function Park( ){
	if( this instanceof Park ){
		MODEL.call( this, "Park" );

		this.scopes = [ 
			"referenceID",
			"title",
			"name",
			"description",
			"directions",
			"instructions",
			"place",
			"price",
			"prices"
		];

		this.searches = [ 
			"title",
			"name",
			"description"	 
		];

		this.domains = {

		};

		this.tap( function includePrice( container, callback ){
			var parks = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Park" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Park" )
					);
				} )
				.value( );

			this.appendPrices( _.flatten( [ parks ] ), callback );
		} );

		this.tap( function includePlace( container, callback ){
			var parks = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Park" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Park" )
					);
				} )
				.value( );

			this.appendPlaces( _.flatten( [ parks ] ), callback );
		} );
		
	}else{
		return new Park( );
	}
};

util.inherits( Park, MODEL );

RESPONSIBLE( ).compose( Park );

Park.prototype.add = function add( park ){
	this.listDirections( park );

	this.listInstructions( park );

	var parkData = _.extend( {
		"parkID": this.parkID,

		"title": park.title,
		"name": park.name,
		"description": park.description,

		"directions": park.directions,
		"instructions": park.instructions,

		"place": park.place,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, parkData );

	return this;
};

Park.prototype.update = function update( reference, park ){
	this.listDirections( park );

	this.listInstructions( park );

	var parkData = _.extend( {
		"title": park.title || null,
		"name": park.name || null,
		"description": park.description || null,

		"directions": park.directions || null,
		"instructions": park.instructions || null,

		"place": park.place || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, reference, parkData );

	return this;
};

Park.prototype.createReferenceID = function createReferenceID( park ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			park.name,
			park.title,
			park.place
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Park.prototype.createParkID = function createParkID( park ){
	var park = JSON.stringify( park );

	var parkID = crypto.createHash( "sha512" )
		.update( park )
		.digest( "hex" )
		.toString( );

	this.references.push( parkID );

	this.parkID = parkID;

	return this;
};

Park.prototype.appendPlaces = function appendPlaces( parks, callback ){
	if( this.parkOnly ||
		this.disableAppendPlaces ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return this;
	}

	async.parallel( parks.map( ( function onEachPark( park ){
		return ( function handler( callback ){
			if( _.isEmpty( park.place ) ){
				callback( );

				return;
			}

			unirest
				.get( PLACE_SERVER_URL
						.join( "api/@accessID/place/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", park.place ) )
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
					var place = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						park.place = { };

						callback( );

					}else{
						park.place = place;
						
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

Park.prototype.appendPrices = function appendPrices( parks, callback ){
	if( this.disableAppendPrices ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( parks.map( ( function onEachPark( park ){
		return ( function handler( callback ){
			unirest
				.get( PRICE_SERVER_URL
						.join( "api/@accessID/price/bound/to/@bound"
							.replace( "@accessID", this.accessID )
							.replace( "@bound", park.referenceID ) )
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
						park.price = { };
						park.prices = [ ];

						callback( );

					}else{
						if( data instanceof Array ){
							park.price = data.pop( );
							park.prices = data;

						}else{
							park.price = data;
							park.prices = [ ];
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
	This will split the directions string by periods.
*/
Park.prototype.listDirections = function listDirections( park ){
	if( !( park.directions instanceof Array ) ){
		park.directions = park.directions.split( "." )
			.map( function onEachDirection( direction ){
				return direction.trim( ) + ".";
			} );
	}

	return this;
};

/*:
	This will split the instructions string by periods.
*/
Park.prototype.listInstructions = function listInstructions( park ){
	if( !( park.instructions instanceof Array ) ){
		park.instructions = park.instructions.split( "." )
			.map( function onEachInstruction( instruction ){
				return instruction.trim( ) + ".";
			} );
	}

	return this;
};

global.PARK = Park;