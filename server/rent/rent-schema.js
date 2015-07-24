var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var rent = new ModelSchema( {
	"rentID": String,

	"room": String,
	"roomPrice": Number,

	"moveInDate": Number,
	"moveOutDate": Number,
	"duration": String,

	"depositPayment": Number,
	"waterMeterValue": Number,
	"electricMeterValue": Number,

	"occupants": [ String ]
} );

mongoose.model( "Model" ).discriminator( "Rent", rent );
