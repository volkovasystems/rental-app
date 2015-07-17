var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var user = new MODEL_SCHEMA( {
	"userID": String,
	"accessID": String,

	"firstName": String,
	"lastName": String,

	"birthDate": Number,
	
	"eMail": String,
	"mobileNumber": String,

	"profileImage": String,

	"socials": [ String ]
} );

mongoose.model( "Model" ).discriminator( "Users", user );