var mongoose = require( "mongoose" );
var util = require( "util" );

var model = function model( ){
	mongoose.Schema.apply( this, arguments );

	this.add( {
		"referenceID": String,
		
		"references": [ String ],
		"timestamps": [ Date ],
		"scopes": [ String ],
		"searches": [ String ],
		"domains": mongoose.Schema.Types.Mixed
	} );
};

util.inherits( model, mongoose.Schema );

global.MODEL_SCHEMA = model;

if( "DB_COLLECTION" in global ){
	mongoose.model( "Model", new model( ), DB_COLLECTION );	
	
}else{
	mongoose.model( "Model", new model( ) );
}

