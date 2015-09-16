var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var image = new MODEL_SCHEMA( {
	"mediaID": String,
	
	//: This is the mime type of the media.
	"type": {
		"type": String,
		"enum": [ "image/png", "image/jpeg" ]
	},

	"hash": String,
	"raw": String,
	"URL": String
} );

mongoose.model( "Model" ).discriminator( "Media", media );