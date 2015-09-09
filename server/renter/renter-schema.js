var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var RenterSchema = new ModelSchema( {
	"renterID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"firstName": {
		"type": String,
		"required": true,
		"index": true
	},
	"middleName": String,
	"lastName": {
		"type": String,
		"required": true,
		"index": true
	},

	"displayName": String,
	"fullName": String,

	"address": String,
	"contactNumber": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},
	"eMail": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"idNumber": {
		"type": String,
		"required": true,
	},
	"idType": {
		"type": String,
		"required": true
	},

	"profilePicture": {
		"type": String,
		"ref": "Media"
	},
	"idImage": {
		"type": String,
		"ref": "Media"
	},

	"guests": [
		{
			"firstName": String,
			"middleName": String,
			"lastName": String,

			"displayName": String,
			"fullName": String,

			"contactNumber": String
		}
	]
} );

RenterSchema.pre( "save",
	function onSave( ){

	} );

mongoose.model( "Model" ).discriminator( "Renter", RenterSchema );

global.RenterSchema = RenterSchema;
module.exports = RenterSchema;

