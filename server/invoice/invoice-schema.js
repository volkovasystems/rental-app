var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var InvoiceSchema = new ModelSchema( {
	"invoiceID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"rent": {
		"reference": {
			"type": String,
			"ref": "Rent",
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
		"moveInDate": {
			"type": Date,
			"required": true
		},
		"moveOutDate": {
			"type": Date,
			"required": true
		},
		"duration": {
			"range": {
				"type": Number,
				"default": 0
			},
			"description": {
				"type": String,
				"default": ""
			}
		},
		"waterMeterValue": {
			"type": Number,
			"required": true,
			"default": 0.0
		},
		"electricMeterValue": {
			"type": Number,
			"required": true,
			"default": 0.0
		},
		"depositPayment": {
			"type": Number,
			"required": true,
			"default": 0.0
		},
		"roomPrice": {
			"type": Number,
			"required": true,
			"default": 0.0
		},
		"renter": {
			"reference": {
				"type": String,
				"ref": "Renter",
				"required": true,
				"index": true
			},
			"fullName": {
				"type": String,
				"required": true,
				"index": true,
				"default": ""
			},
			"idNumber": {
				"type": String,
				"required": true,
				"index": true,
				"default": ""
			},
			"eMail": {
				"type": String,
				"required": true,
				"index": true,
				"default": ""
			},
			"contactNumber": {
				"type": String,
				"required": true,
				"index": true,
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
			},
			"guests": [ 
				{
					"displayName": {
						"type": String,
						"required": true,
						"index": true,
						"default": ""
					},
					"fullName": {
						"type": String,
						"required": true,
						"index": true,
						"default": ""
					},
					"contactNumber": {
						"type": String,
						"required": true,
						"index": true,
						"default": ""
					}
				}
			]
		}
	},

	"invoiceNumber": {
		"type": String,
		"unique": true,
		"requrired": true,
		"index": true
	},

	"invoiceDate": {
		"type": Date,
		"required": true
	},

	"dueDate": {
		"type": Date,
		"required": true
	},

	"waterMeterValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	},

	"electricMeterValue": {
		"type": Number,
		"required": true,
		"default": 0.0
	}

} );

InvoiceSchema.initializeModel( "invoice" );

global.InvoiceSchema = InvoiceSchema;
module.exports = InvoiceSchema;
