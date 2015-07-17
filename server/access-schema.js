var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var access = new MODEL_SCHEMA( {
	"accessID": String,
	"hash": String,
	"domain": String
} );

mongoose.model( "Model" ).discriminator( "Access", access );