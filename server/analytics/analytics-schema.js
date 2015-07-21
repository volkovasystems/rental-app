var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var analytics = new MODEL_SCHEMA( {
	"analyticsID": String,

	"name": String,
	"title": String,
	"description": String,

	
} );

mongoose.model( "Model" ).discriminator( "Analytics", analytics );