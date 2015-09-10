var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var AccessSchema = new ModelSchema( {
	"accessID": {
		"type": String,
		"unique": true,
		"required": true
	},
	"hash": String,
	"domain": String
} );

mongoose.model( "Model" ).discriminator( "Access", AccessSchema );

global.AccessSchema = AccessSchema;
module.exports = AccessSchema;
