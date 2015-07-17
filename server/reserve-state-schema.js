var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var reserveState = new MODEL_SCHEMA( {
	"reserveStateID": String,

	"name": String,
	"title": String,
	"description": String
} );

mongoose.model( "Model" ).discriminator( "ReserveState", reserveState );