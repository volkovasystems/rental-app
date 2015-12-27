var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var RoomUtilityTypeSchema = new ModelSchema( {
	"roomUtilityTypeID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"unitValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	},

	"unitSuffix": {
		"type": String,
		"required": true,
		"default": ""
	},

	"unitName": {
		"type": String,
		"required": true,
		"default": ""
	},

	"unitTitle": {
		"type": String,
		"required": true,
		"default": ""
	}
} );

RoomUtilityTypeSchema.initializeModel( "room-utility-type" );

global.RoomUtilityTypeSchema = RoomUtilityTypeSchema;
module.exports = RoomUtilityTypeSchema;