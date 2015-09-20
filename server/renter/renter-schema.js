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
		"index": true,
		"default": ""
	},
	"middleName": {
		"type": String,
		"default": ""
	},
	"lastName": {
		"type": String,
		"required": true,
		"index": true,
		"default": ""
	},
	"displayName": {
		"type": String,
		"required": true,
		"default": ""
	},
	"fullName": {
		"type": String,
		"required": true,
		"default": ""
	},
	"address": {
		"type": String,
		"required": true,
		"default": ""
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
		"default": ""
	},
	"idType": {
		"type": String,
		"required": true,
		"default": ""
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
				"required": true,
				"default": ""
			},
			"middleName": {
				"type": String,
				"default": ""
			},
			"lastName": {
				"type": String,
				"required": true,
				"default": ""
			},
			"displayName": {
				"type": String,
				"required": true,
				"default": ""
			},
			"fullName": {
				"type": String,
				"required": true,
				"default": ""
			},
			"contactNumber": {
				"type": String,
				"required": true,
				"default": ""
			}
		}
	]
} );

RenterSchema.pre( "validate",
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

		this.name = this.name || shardize( this.displayName, true );

		next( );
	} );

RenterSchema.pre( "validate", true,
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

RenterSchema.initializeModel( "renter" );

global.RenterSchema = RenterSchema;
module.exports = RenterSchema;

