var mongoose = require( "mongoose" );
var formatDisplayName = require( "../utility/format-display-name.js" );
var formatFullName = require( "../utility/format-full-name.js" );

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
	function onSave( next ){
		this.displayName = this.displayName || 
			formatDisplayName( this.firstName, this.middleName, this.lastName );

		this.fullName = this.fullName ||
			formatFullName( this.firstName, this.middleName, this.lastName );

		this.guests = ( this.guests || [ ] )
			.map( function onEachGuest( ){

			} )
	} );

mongoose.model( "Model" ).discriminator( "Renter", RenterSchema );

global.RenterSchema = RenterSchema;
module.exports = RenterSchema;

