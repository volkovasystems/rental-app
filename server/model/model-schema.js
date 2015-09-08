var moment = require( "moment" );
var mongoose = require( "mongoose" );
var util = require( "util" );

var model = function model( ){
	mongoose.Schema.apply( this, arguments );

	this.add( {
		"referenceID": String,
		
		"references": [ 
			{
				"type": String,
				"ref": ModelSchema
			} 
		],

		//: This will be in UTC format.
		"timestamps": [ Date ],

		"scopes": [ String ],
		"searches": [ String ],
		"domains": mongoose.Schema.Types.Mixed
	} );
};

util.inherits( model, mongoose.Schema );

global.ModelSchema = model;

if( "DB_COLLECTION" in global ){
	mongoose.model( "Model", new model( ), DB_COLLECTION );	
	
}else{
	mongoose.model( "Model", new model( ) );
}

