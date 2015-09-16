var mongoose = require( "mongoose" );
var titlelize = require( "titlelize" );
var shardize = require( "shardize" );
var shortid = require( "shortid" );
var util = require( "util" );

require( "./change-schema.js" );

/*:
	Difference with the ObjectId of mongodb and other ids and references here.

		1. ObjectId of mongodb is for each document and we don't want
			to expose it or use it. Let mongodb use it.

		2. <model>ID of each model is unique id based on the data of the model.

		3. referenceID of each model is the unique id that we can share to other models.
			This can be used to link models.

		4. references are collections of referenceIDs linked together.

		5. reference is the short id. This is not indexed and useful for url 
			and querying.
*/
var model = function model( ){
	mongoose.Schema.apply( this, arguments );

	this.add( {
		"name": {
			"type": String,
			"index": true
		},
		"title": String,
		"description": String,

		"tags": [ String ],

		"referenceID": {
			"type": String,
			"unique": true,
			"required": true,
			"index": true
		},

		"reference": {
			"type": String,
			"unique": true,
			"default": shortid.generate
		},
		
		"references": [ 
			{
				"type": String,
				"ref": "Model"
			}
		],

		/*:
			Timestamps are list of logged events
		*/
		"changes": [ ChangeSchema ],

		"scopes": [ String ],
		"searches": [ String ],
		"domains": mongoose.Schema.Types.Mixed
	} );
};

util.inherits( model, mongoose.Schema );

global.ModelSchema = model;

ModelSchema.pre( "save",
	function onSave( next ){
		this.name = shardize( this.name );

		this.title = titlelize( this.title || this.name );

		next( );
	} );

if( "DB_COLLECTION" in global ){
	mongoose.model( "Model", new model( ), DB_COLLECTION );	
	
}else{
	mongoose.model( "Model", new model( ) );
}

