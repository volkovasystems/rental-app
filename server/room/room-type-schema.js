var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var RoomTypeSchema = new ModelSchema( {
	"roomTypeID": {
		"type": String,
		"unique": true,
		"required": true,
		"index": true
	}
} );

mongoose.model( "Model" ).discriminator( "RoomType", RoomTypeSchema );

global.RoomTypeSchema = RoomTypeSchema;
module.exports = RoomTypeSchema;