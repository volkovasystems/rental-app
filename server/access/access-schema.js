var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var access = new ModelSchema( {
	"accessID": String,
	"hash": String,
	"domain": String
} );

mongoose.model( "Model" ).discriminator( "Access", access );
