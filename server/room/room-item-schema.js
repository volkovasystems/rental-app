var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var RoomItemSchema = new ModelSchema( {
	"roomItemID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	}
} );

mongoose.model( "Model" ).discriminator( "RoomItem", RoomItemSchema );

global.RoomItemSchema = RoomItemSchema;
module.exports = RoomItemSchema;