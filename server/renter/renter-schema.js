var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var renter = new ModelSchema( {
	"renterID": String,

	"firstName": String,
	"lastName": String,

	"address": String,
	"contactNumber": String,
	"eMail": String,

	"idNumber": String,
	"idType": String,

	"profilePicture": String,
	"idImage": String
} );

mongoose.model( "Model" ).discriminator( "Renter", renter );
