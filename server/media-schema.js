var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var image = new MODEL_SCHEMA( {
	"imageID": String,

	"hash": String,
	"raw": String,
	"URL": String
} );

mongoose.model( "Model" ).discriminator( "Image", image );