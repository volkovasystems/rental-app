var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var reserve = new MODEL_SCHEMA( {
	"reserveID": String,

	"name": String,
	"title": String,
	"description": String,

	"states": [ mongoose.Schema.Types.Mixed ],

	//: These are references.
	"user": mongoose.Schema.Types.Mixed,
	"vehicle": mongoose.Schema.Types.Mixed,
	"place": mongoose.Schema.Types.Mixed,
	"park": mongoose.Schema.Types.Mixed,
	"slot": mongoose.Schema.Types.Mixed,

	"totalPrice": Number,

	//: When the user submits the reservation.
	"reservationDate": Number,
	"expectedParkInDate": Number,

	//: This is the reference to the payment server.
	"transaction": mongoose.Schema.Types.Mixed,

	"parkInDate": Number,
	"parkOutDate": Number
} );

mongoose.model( "Model" ).discriminator( "Reserve", reserve );