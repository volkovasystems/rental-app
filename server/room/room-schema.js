var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var room = new MODEL_SCHEMA( {
	"roomID": String,

	"buildingNumber": String,
	"roomNumber": String,

	"roomType": String,
	"roomSize": Number,

	"roomItems": [ String ],

	"occupantLimit": Number,

	

} );

mongoose.model( "Model" ).discriminator( "Room", room );
