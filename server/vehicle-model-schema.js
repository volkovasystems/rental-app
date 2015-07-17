var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var vehicleModel = new MODEL_SCHEMA( {
	"vehicleModelID": String,
	
	"name": String,
	"title": String,
	"description": String,

	"brand": String
} );

mongoose.model( "Model" ).discriminator( "VehicleModel", vehicleModel );