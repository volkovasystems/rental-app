var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var amenity = new MODEL_SCHEMA( {
	"amenityID": String,
	
	"name": String,
	"title": String,
	"description": String,
	"image": String
} );

mongoose.model( "Model" ).discriminator( "Amenity", amenity );