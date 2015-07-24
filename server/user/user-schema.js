var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var user = new ModelSchema( {
	"userID": String,
	"accessID": String,

	"firstName": String,
	"lastName": String,

	"userName": String
} );

mongoose.model( "Model" ).discriminator( "User", user );
