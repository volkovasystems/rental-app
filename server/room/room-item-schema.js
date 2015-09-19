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

RoomItemSchema.initializeModel( "room-item" );

global.RoomItemSchema = RoomItemSchema;
module.exports = RoomItemSchema;