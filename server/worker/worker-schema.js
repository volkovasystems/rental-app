var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var worker = new MODEL_SCHEMA( {
	"workerID": String,

	"URL": String,
	"method": String,
	"query": mongoose.Schema.Types.Mixed,
	"data": mongoose.Schema.Types.Mixed,
	
	"expirationDate": Number,
	"duration": Number,

	"accessID": String
} );

mongoose.model( "Model" ).discriminator( "Worker", worker );