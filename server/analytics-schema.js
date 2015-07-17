var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var analytics = new MODEL_SCHEMA( {
	"parkID": String,

	"name": String,
	"title": String,
	"description": String,

	"directions": [ String ],
	"instructions": [ String ],

	"place": mongoose.Schema.Types.Mixed,
} );

mongoose.model( "Model" ).discriminator( "Analytics", analytics );