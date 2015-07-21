var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var rent = new MODEL_SCHEMA( {
	"rentID": String,
	
} );

mongoose.model( "Model" ).discriminator( "Rent", rent );