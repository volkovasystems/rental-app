var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var rent = new MODEL_SCHEMA( {
	"rentID": String,
	
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

mongoose.model( "Model" ).discriminator( "Rent", rent );