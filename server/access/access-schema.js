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

AccessSchema.initializeModel( "access" );

global.AccessSchema = AccessSchema;
module.exports = AccessSchema;
