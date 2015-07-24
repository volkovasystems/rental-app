var mongoose = require( "mongoose" );

require( "../model/model-schema.js" );

var invoice = new MODEL_SCHEMA( {
	"invoiceID": String,

} );

mongoose.model( "Model" ).discriminator( "Invoice", invoice );
