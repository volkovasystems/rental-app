var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var roomItem = new ModelSchema( {
	"roomItemID": String,

	"name": String,
	"title": String,
    "description": String
} );

mongoose.model( "Model" ).discriminator( "RoomItem", roomItem );
