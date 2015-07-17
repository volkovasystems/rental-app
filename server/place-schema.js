var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var place = new MODEL_SCHEMA( {
	"placeID": String,
	
	"name": String,
	"title": String,
	"description": String,
	"address": String,

	"latitude": Number,
	"longitude": Number,
	"zoom": Number,

	"amenities": [ mongoose.Schema.Types.Mixed ],
	"images": [ String ],
	"instructions": [ String ],
	"rate": String
} );

mongoose.model( "Model" ).discriminator( "Place", place );