var _ = require( "lodash" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "./model.js" );

require( "./responsible.js" );

var VehicleModel = function VehicleModel( ){
	if( this instanceof VehicleModel ){
		MODEL.call( this, "VehicleModel" );

		this.scopes = [ 
			"name", 
			"title", 
			"description", 
			"brand", 
			"referenceID" 
		];

		this.searches = [ 
			"name", 
			"title", 
			"description",
			"brand" 
		];

		this.domains = {

		};

	}else{
		return new VehicleModel( );
	}
};

util.inherits( VehicleModel, MODEL );

RESPONSIBLE( ).compose( VehicleModel );

VehicleModel.prototype.add = function add( vehicleModel ){
	var vehicleModelData = _.extend( {
		"vehicleModelID": this.vehicleModelID,
		
		"name": vehicleModel.name,
		"title": vehicleModel.title,
		"description": vehicleModel.description,

		"brand": vehicleModel.brand,
		
		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, vehicleModelData );

	return this;
};

VehicleModel.prototype.update = function update( vehicleModel, reference ){
	var vehicleModelData = _.extend( {
		"name": vehicleModel.name || null,
		"title": vehicleModel.title || null,
		"description": vehicleModel.description || null,

		"brand": vehicleModel.brand || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	MODEL.prototype.update.call( this, vehicleModelData, reference );

	return this;
};

VehicleModel.prototype.createReferenceID = function createReferenceID( vehicleModel ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			vehicleModel.name,
			vehicleModel.title,
			vehicleModel.brand
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

VehicleModel.prototype.createVehicleModelID = function createVehicleModelID( vehicleModel ){
	var vehicleModel = JSON.stringify( vehicleModel );

	var vehicleModelID = crypto.createHash( "sha512" )
		.update( vehicleModel )
		.digest( "hex" )
		.toString( );

	this.references.push( vehicleModelID );

	this.vehicleModelID = vehicleModelID;

	return this;
};

global.VEHICLE_MODEL = VehicleModel;