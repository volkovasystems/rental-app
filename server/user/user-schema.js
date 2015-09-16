var legitMail = require( "legit-mail" );
var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var UserSchema = new ModelSchema( {
	"userID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	},

	"accessID": {
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

	"userName": String,
	"eMail": String
} );

UserSchema.pre( "save",
	function onSave( next ){
		this.displayName = this.displayName || 
			formatDisplayName( this.firstName, this.middleName, this.lastName );

		this.fullName = this.fullName ||
			formatFullName( this.firstName, this.middleName, this.lastName );

		next( );
	} );

UserSchema.pre( "save", true,
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

mongoose.model( "Model" ).discriminator( "User", UserSchema );

global.UserSchema = UserSchema;
module.exports = UserSchema;