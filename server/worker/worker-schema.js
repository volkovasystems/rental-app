var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var worker = new ModelSchema( {
	"workerID": String,

	"URL": String,
	"method": String,
	"query": mongoose.Schema.Types.Mixed,
	"data": mongoose.Schema.Types.Mixed,

	"startDate": Number,
	"expirationDate": Number,
	"duration": Number,

	"accessID": String
} );

mongoose.model( "Model" ).discriminator( "Worker", worker );
