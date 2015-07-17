var mongoose = require( "mongoose" );

require( "./model-schema.js" );

var price = new MODEL_SCHEMA( {
	"priceID": String,
	
	//: If we have price category then this will be applied.
	//: Note that price category may be bound to a data model.
	"types": [ String ],

	//: This will be used as outside reference where the price is bound.
	"bounds": [ String ],

	"amount": Number,
	//: This is the base currency.
	"currency": mongoose.Schema.Types.Mixed,
	//: These are the supported currencies.
	"currencies": [ mongoose.Schema.Types.Mixed ],

	//: This is the duration in days or 0 if infinite.
	"duration": Number,

	"payOptions": [ mongoose.Schema.Types.Mixed ],

	"name": String,
	"title": String,
	"description": String
} );

mongoose.model( "Model" ).discriminator( "Price", price );