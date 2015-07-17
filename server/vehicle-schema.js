var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var vehicle = new MODEL_SCHEMA( {
	"vehicleID": String,

	"users": [ mongoose.Schema.Types.Mixed ],
	
	"plateNumber": String,

	"model": mongoose.Schema.Types.Mixed,
	"color": mongoose.Schema.Types.Mixed
} );

mongoose.model( "Model" ).discriminator( "Vehicle", vehicle );