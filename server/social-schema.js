var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var social = new MODEL_SCHEMA( {
	"socialID": String,
	
	/*:
		This determines what social app we get the data.
	*/
	"type": String,
	"accessToken": String,
	"accountID": String,

	"firstName": String,
	"lastName": String,

	"birthDate": Number,

	"eMail": String,
	"mobileNumber": String,
	
	"profileURL": String,
	"profileImage": String,

	"user": mongoose.Schema.Types.Mixed
} );

mongoose.model( "Model" ).discriminator( "Social", social );