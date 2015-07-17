var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var currency = new MODEL_SCHEMA( {
	"currencyID": String,
	
	"name": String,
	"title": String,
	"description": String,
	"symbol": String
} );

mongoose.model( "Model" ).discriminator( "Currency", currency );