var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var room = new MODEL_SCHEMA( {
	"roomID": String,
	
} );

mongoose.model( "Model" ).discriminator( "Room", room );