var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var Vehicle = function Vehicle( ){
	if( this instanceof Vehicle ){
		MODEL.call( this, "Vehicle" );

		this.scopes = [
			"users",
			"plateNumber",
			"model", 
			"color", 
			"referenceID"
		];

		this.searches = [ 
			"users",
			"plateNumber",
			"model", 
			"color" 
		];

		this.domains = {

		};

		this.tap( function includeVehicleColor( container, callback ){
			var vehicles = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Vehicle" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Vehicle" )
					);
				} )
				.value( );

			this.appendVehicleColor( _.flatten( [ vehicles ] ), callback );
		} );

		this.tap( function includeVehicleModel( container, callback ){
			var vehicles = _( container.parameters )
				.filter( function onEachParameter( parameter ){
					return (
						( parameter &&
							typeof parameter == "object" &&
							"__t" in parameter &&
							parameter.__t == "Vehicle" ) ||

						( parameter instanceof Array &&
							typeof parameter[ 0 ] == "object" &&
							"__t" in parameter[ 0 ] &&
							parameter[ 0 ].__t == "Vehicle" )
					);
				} )
				.value( );

			this.appendVehicleModel( _.flatten( [ vehicles ] ), callback );
		} );
		
	}else{
		return new Vehicle( );
	}
};

util.inherits( Vehicle, MODEL );

RESPONSIBLE( ).compose( Vehicle );

Vehicle.prototype.add = function add( vehicle ){
	if( "user" in vehicle ){
		vehicle.users = [ vehicle.user ];
	}

	var vehicleData = _.extend( {
		"vehicleID": this.vehicleID,

		"users": vehicle.users,

		"plateNumber": vehicle.plateNumber,

		"model": vehicle.model,
		"color": vehicle.color,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, vehicleData );

	return this;
};

Vehicle.prototype.update = function update( vehicle, reference ){
	if( "user" in vehicle ){
		vehicle.users = [ vehicle.user ];
	}

	var vehicleData = _.extend( {
		"plateNumber": vehicle.plateNumber || null,

		"users": vehicle.users || null,

		"model": vehicle.model || null,
		"color": vehicle.color || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, vehicleData, reference );

	return this;
};

Vehicle.prototype.createReferenceID = function createReferenceID( vehicle ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			vehicle.plateNumber,
			vehicle.model,
			vehicle.color 
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Vehicle.prototype.createVehicleID = function createVehicleID( vehicle ){
	vehicle = JSON.stringify( vehicle );

	var vehicleID = crypto.createHash( "sha512" )
		.update( vehicle )
		.digest( "hex" )
		.toString( );

	this.references.push( vehicleID );

	this.vehicleID = vehicleID;

	return this;
};

Vehicle.prototype.appendVehicleModel = function appendVehicleModel( vehicles, callback ){
	async.parallel( vehicles.map( ( function onEachVehicle( vehicle ){
		return ( function handler( callback ){
			if( _.isEmpty( vehicle.model ) ){
				callback( );

				return;
			}

			VEHICLE_MODEL( )
				.once( "result",
					function onResult( error, vehicleModel ){
						if( error ){
							callback( error );

						}else if( _.isEmpty( vehicleModel ) ){
							vehicle.model = { };

							callback( );

						}else{
							vehicle.model = _.first( vehicleModel );

							callback( );
						}
					} )
				.get( "referenceID", vehicle.model );
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

Vehicle.prototype.appendVehicleColor = function appendVehicleColor( vehicles, callback ){
	async.parallel( vehicles.map( ( function onEachVehicle( vehicle ){
		return ( function handler( callback ){
			if( _.isEmpty( vehicle.color ) ){
				callback( );

				return;
			}

			if( vehicle.color in VEHICLE_COLORS ){
				vehicle.color = VEHICLE_COLORS[ vehicle.color ];

				callback( );

				return;

			}else{
				callback( );

				return;
			}
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

Vehicle.prototype.ownedByUser = function ownedByUser( user ){

};

Vehicle.prototype.addUser = function addUser( user ){

	return this;
};

Vehicle.prototype.removeUser = function removeUser( user ){

	return this;
};

Vehicle.prototype.getUserVehicles = function( user ){

	return this;
};

global.VEHICLE = Vehicle;



