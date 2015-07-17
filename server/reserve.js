var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Reserve = function Reserve( ){
	if( this instanceof Reserve ){
		MODEL.call( this, "Reserve" );

		this.scopes = [ 
			"referenceID",
			"name",
			"title",
			"description",
			"states",
			"user",
			"vehicle",
			"place",
			"park",
			"slot",
			"totalPrice",
			"reservationDate",
			"expectedParkInDate",
			"transaction",
			"parkInDate",
			"parkOutDate"
		];

		this.searches = [ 
			"referenceID",
			"name",
			"title",
			"description",
			"states",
			"totalPrice",
			"reservationDate",
			"expectedParkInDate",
			"parkInDate",
			"parkOutDate"
		];

		this.domains = {

		};

		this.tap( function includeUser( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendUsers( _.flatten( [ reserves ] ), callback );
		} );

		this.tap( function includeVehicle( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendVehicles( _.flatten( [ reserves ] ), callback );
		} );

		this.tap( function includePlace( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendPlaces( _.flatten( [ reserves ] ), callback );
		} );

		this.tap( function includePark( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendParks( _.flatten( [ reserves ] ), callback );
		} );

		this.tap( function includeSlot( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendSlots( _.flatten( [ reserves ] ), callback );
		} );

		this.tap( function includeTransaction( container, callback ){
			var reserves = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Reserve" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Reserve" )
					);
				} )
				.value( );

			this.appendTransactions( _.flatten( [ reserves ] ), callback );
		} );
		
	}else{
		return new Reserve( );
	}
};

util.inherits( Reserve, MODEL );

RESPONSIBLE( ).compose( Reserve );

Reserve.prototype.add = function add( reserve ){
	if( "state" in reserve ){
		reserve.states = [ reserve.state ];
	}

	var reserveData = _.extend( {
		"reserveID": this.reserveID,

		"name": reserve.name,
		"title": reserve.title,
		"description": reserve.description,

		"states": reserve.states,

		"user": reserve.user,
		"vehicle": reserve.vehicle,
		"place": reserve.place,
		"park": reserve.park,
		"slot": reserve.slot,

		"reservationDate": reserve.reservationDate,
		"expectedParkInDate": reserve.expectedParkInDate,

		"totalPrice": reserve.totalPrice,
		"transaction": reserve.transaction,

		"parkInDate": reserve.parkInDate,
		"parkOutDate": reserve.parkOutDate,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, reserveData );

	return this;
};

Reserve.prototype.update = function update( reserve, reference ){
	if( "state" in reserve ){
		reserve.states = [ reserve.state ];
	}

	var reserveData = _.extend( {
		"name": reserve.name || null,
		"title": reserve.title || null,
		"description": reserve.description || null,

		"states": reserve.states || null,

		"user": reserve.user || null,
		"vehicle": reserve.vehicle || null,
		"place": reserve.place || null,
		"park": reserve.park || null,
		"slot": reserve.slot || null,

		"reservationDate": reserve.reservationDate || null,
		"expectedParkInDate": reserve.expectedParkInDate || null,

		"totalPrice": reserve.totalPrice || null,
		"transaction": reserve.transaction || null,

		"parkInDate": reserve.parkInDate || null,
		"parkOutDate": reserve.parkOutDate || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, reserveData, reference );

	return this;
};

Reserve.prototype.createReferenceID = function createReferenceID( reserve ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			reserve.user,
			reserve.vehicle,
			reserve.slot,
			reserve.reservationDate
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Reserve.prototype.createReserveID = function createReserveID( reserve ){
	var reserve = JSON.stringify( reserve );

	var reserveID = crypto.createHash( "sha512" )
		.update( reserve )
		.digest( "hex" )
		.toString( );

	this.references.push( reserveID );

	this.reserveID = reserveID;

	return this;
};

Reserve.prototype.appendUsers = function appendUsers( reserves, callback ){
	if( this.disableAppendUsers ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.user ) ){
				var error = new Error( "reservation without user data" );

				callback( error );

				return;
			}

			unirest
				.get( USER_SERVER_URL
						.join( "api/@accessID/user/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.user ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting user" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var user = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.user = { };

						callback( );

					}else{
						reserve.user = user;
						
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

Reserve.prototype.appendVehicles = function appendVehicles( reserves, callback ){
	if( this.disableAppendVehicles ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.vehicle ) ){
				var error = new Error( "reservation without vehicle data" );

				callback( error );

				return;
			}

			unirest
				.get( VEHICLE_SERVER_URL
						.join( "api/@accessID/vehicle/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.vehicle ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting vehicle" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var vehicle = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.vehicle = { };

						callback( );

					}else{
						reserve.vehicle = vehicle;
						
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

Reserve.prototype.appendPlaces = function appendPlaces( reserves, callback ){
	if( this.disableAppendPlaces ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.place ) ){
				var error = new Error( "reservation without place data" );

				callback( error );

				return;
			}

			unirest
				.get( PLACE_SERVER_URL
						.join( "api/@accessID/place/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.place ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting place" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var place = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.place = { };

						callback( );

					}else{
						reserve.place = place;
						
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

Reserve.prototype.appendParks = function appendParks( reserves, callback ){
	if( this.disableAppendParks ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.slot ) ){
				reserve.park = { };

				callback( );

				return;
			}

			unirest
				.get( PARK_SERVER_URL
						.join( "api/@accessID/park/only/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.park ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting park" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var park = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.park = { };

						callback( );

					}else{
						reserve.park = park;
						
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

Reserve.prototype.appendSlots = function appendSlots( reserves, callback ){
	if( this.disableAppendSlots ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.slot ) ){
				var error = new Error( "reservation without slot data" );

				callback( error );

				return;
			}

			unirest
				.get( SLOT_SERVER_URL
						.join( "api/@accessID/slot/only/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.slot ) )
						.path( ) )

				.end( ( function onResponse( response ){
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						callback( response.error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting slot" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var slot = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.slot = { };

						callback( );

					}else{
						reserve.slot = slot;
						
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

Reserve.prototype.appendTransactions = function appendTransactions( reserves, callback ){
	if( this.disableAppendTransactions ||
		_.isEmpty( this.accessID ) )
	{
		callback( );

		return;
	}

	async.parallel( reserves.map( ( function onEachReserve( reserve ){
		return ( function handler( callback ){
			if( _.isEmpty( reserve.transaction ) ){
				reserve.transaction = { };

				callback( );

				return;
			}

			console.log( PAY_SERVER_URL
						.join( "api/@accessID/transaction/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.transaction ) )
						.path( ) );

			unirest
				.get( PAY_SERVER_URL
						.join( "api/@accessID/transaction/@referenceID"
							.replace( "@accessID", this.accessID )
							.replace( "@referenceID", reserve.transaction ) )
						.path( ) )

				.end( ( function onResponse( response ){
					console.log( "TRANSACTION!", util.inspect( arguments ) );
					
					if( "error" in response && 
						response.error &&
						response.status >= 500 )
					{
						var error = new Error( response.error );
						
						callback( error );

						return;
					}

					if( _.isEmpty( response.body ) ){
						var error = new Error( "empty response data from getting transaction" );
						
						callback( error );

						return;
					}

					var status = response.body.status;
					var transaction = response.body.data;

					if( status == "error" ){
						var error = new Error( response.body.data );

						callback( error );
						
					}else if( status == "failed" ){
						reserve.transaction = { };

						callback( );

					}else{
						reserve.transaction = transaction;
						
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

Reserve.prototype.getReservedSlot = function getReservedSlot( slot ){
	unirest
		.get( SLOT_SERVER_URL
			.join( "api/@accessID/slot/@slot"
				.replace( "@accessID", this.accessID )
				.replace( "@slot", slot ) )
			.path( ) )

		.end( ( function onResponse( response ){
				if( "error" in response && 
					response.error &&
					response.status >= 500 )
				{
					var error = new Error( response.error );
					this.result( error );

					return;
				}

				if( _.isEmpty( response.body ) ){
					var error = new Error( "empty response data" );

					this.result( error );

					return;
				}

				var status = response.body.status;
				var slot = response.body.data;

				if( slot.status != "pending" ){
					this.result( null, false, "the reserved slot was not in pending state" );
				
				}else if( status == "error" ){
					var error = new Error( response.body.data );

					this.result( error );
					
				}else if( status == "failed" ){
					this.result( null, false, "failed to retrieve slot data" );

				}else{
					this.result( null, slot );
				}
			} ).bind( this ) );

	return this;
};

global.RESERVE = Reserve;