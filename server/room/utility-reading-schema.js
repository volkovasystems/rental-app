var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var UtilityReading = new ModelSchema( {
	"utilityReadingID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"referenceChain": {
		"type": String,
		"ref": "RoomUtility",
		"required": true,
		"index": true,
		"default": ""
	},

	//: This is the current reading.
	"readingValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	},

	//: This is the aggregation of the past values.
	"readingRange": {
		"type": Number,
		"required": true,
		"default": 0.0
	},

	"readingDate": {
		"type": Date,
		"required": true,
		"default": 0.0,
		"index": true
	}
} );

UtilityReading.initializeModel( "utility-reading" );

global.UtilityReading = UtilityReading;
module.exports = UtilityReading;