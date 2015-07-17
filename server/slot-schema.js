var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var slot = new MODEL_SCHEMA( {
	"slotID": String,

	"name": String,
	"title": String,
	"description": String,

	"status": String,

	"park": mongoose.Schema.Types.Mixed,
	"place": mongoose.Schema.Types.Mixed
} );

mongoose.model( "Model" ).discriminator( "Slot", slot );