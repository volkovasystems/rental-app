var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var renter = new MODEL_SCHEMA( {
	"renterID": String,
	
} );

mongoose.model( "Model" ).discriminator( "Renter", renter );