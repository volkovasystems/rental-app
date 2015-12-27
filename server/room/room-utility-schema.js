var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var RoomUtilitySchema = new ModelSchema( {
	"roomUtilityID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"room": {
		"reference": {
			"type": String,
			"ref": "Room",
			"required": true,
			"index": true
		},
		"buildingNumber": {
			"type": String,
			"required": true,
			"index": true,
			"default": ""
		},
		"roomNumber": {
			"type": String,
			"required": true,
			"index": true,
			"default": ""
		},
		"roomType": {
			"reference": {
				"type": String,
				"ref": "RoomType",
				"required": true
			},
			"name": {
				"type": String,
				"required": true,
				"default": ""
			},
			"title": {
				"type": String,
				"required": true,
				"default": ""
			},
			"description": {
				"type": String,
				"default": ""
			},
			"tags": {
				"type": [ String ],
				"default": [ ]
			}
		},
		"roomSize": {
			"type": Number,
			"required": true,
			"index": true,
			"default": 0.0
		},
		"name": {
			"type": String,
			"required": true,
			"default": ""
		},
		"title": {
			"type": String,
			"required": true,
			"default": ""
		},
		"description": {
			"type": String,
			"default": ""
		},
		"tags": {
			"type": [ String ],
			"default": [ ]
		}
	},

	"roomUtilityType": {
		"reference": {
			"type": String,
			"ref": "RoomUtilityType",
			"required": true,
			"default": ""
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
		},
		"name": {
			"type": String,
			"required": true,
			"default": ""
		},
		"title": {
			"type": String,
			"required": true,
			"default": ""
		},
		"description": {
			"type": String,
			"default": ""
		},
		"tags": {
			"type": [ String ],
			"default": [ ]
		}
	},

	"utilityReadings": [
		{
			"reference": {
				"type": String,
				"ref": "UtilityReading"
			}	
		}
	]
} );

RoomUtilityScheMa.initializeModel( "room-utility" );

global.RoomUtilitySchema = RoomUtilitySchema;
module.exports = RoomUtilitySchema;