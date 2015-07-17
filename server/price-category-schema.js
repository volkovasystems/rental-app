var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var priceCategory = new MODEL_SCHEMA( {
	"priceCategoryID": String,
	
	"name": String,
	"title": String,
	"description": String
} );

mongoose.model( "Model" ).discriminator( "PriceCategory", priceCategory );