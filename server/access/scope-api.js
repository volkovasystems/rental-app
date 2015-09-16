var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var ScopeSchema = new ModelSchema( {
	"scopeID": {
		"type": String,
		"unique": true,
		"required": true
	}

	
} );

mongoose.model( "Model" ).discriminator( "Scope", ScopeSchema );

global.ScopeSchema = ScopeSchema;
module.exports = ScopeSchema;
