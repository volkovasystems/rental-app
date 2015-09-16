var legitMail = require( "legit-mail" );
var mongoose = require( "mongoose" );
var formatDisplayName = require( "../utility/format-display-name.js" );
var formatFullName = require( "../utility/format-full-name.js" );
var shardize = require( "shardize" );

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

	"displayName": {
		"type": String,
		"required": true
	},
	"fullName": {
		"type": String,
		"required": true
	},

	"address": {
		"type": String,
		"required": true
	},
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
			"firstName": {
				"type": String,
				"required": true
			},
			"middleName": String,
			"lastName": {
				"type": String,
				"required": true
			},

			"displayName": {
				"type": String,
				"required": true
			},
			"fullName": {
				"type": String,
				"required": true
			},

			"contactNumber": {
				"type": String,
				"required": true
			}
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
			.map( function onEachGuest( guest ){
				guest.displayName = guest.displayName || 
					formatDisplayName( this.firstName, this.middleName, this.lastName );

				guest.fullName = guest.fullName ||
					formatFullName( this.firstName, this.middleName, this.lastName );					

				return guest;
			} );

		this.name = shardize( this.fullName );

		next( );
	} );

RenterSchema.pre( "save", true,
	function onSave( next, done ){
		legitMail( this.eMail,
			function onLegitCheck( error, isLegit ){
				if( error ){
					done( error );
				
				}else if( isLegit ){
					done( );

				}else{
					done( new Error( "invalid e-mail address" ) );
				}
			} );

		next( );
	} );

mongoose.model( "Model" ).discriminator( "Renter", RenterSchema );

global.RenterSchema = RenterSchema;
module.exports = RenterSchema;

