var harden = require( "harden" );
var llamalize = require( "llamalize" );
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
var ModelSchema = function ModelSchema( ){
	mongoose.Schema.apply( this, arguments );

	this.add( {
		"name": {
			"type": String,
			"index": true,
			"default": ""
		},
		"title": {
			"type": String,
			"default": ""
		},
		"description": {
			"type": String,
			"default": ""
		},

		"tags": {
			"type": [ String ],
			"default": [ ]
		},

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
		"changes": [ 
			{
				"reference": {
					"type": String,
					"ref": "Change"
				},
				"timestamp": Date
			}
		],

		"scopes": [ String ],
		"searches": [ String ],
		"domains": mongoose.Schema.Types.Mixed
	} );
};

util.inherits( ModelSchema, mongoose.Schema );

ModelSchema.prototype.initializeModel = function initializeModel( collection ){
	var collectionTitle = llamalize( collection, true );

	if( "NAMESPACED_COLLECTION" in global &&
		global.NAMESPACED_COLLECTION &&
		typeof collection == "string" &&
		collection )
	{
		var baseCollection = [ collectionTitle, "Model" ].join( "" );

		mongoose.model( baseCollection, ModelSchema.Model, collection );

		mongoose.model( baseCollection ).discriminator( collectionTitle, this );

	}else if( "DB_COLLECTION" in global ){
		mongoose.model( "Model", ModelSchema.Model, DB_COLLECTION );

		mongoose.model( "Model" ).discriminator( collectionTitle, this );
		
	}else{
		mongoose.model( "Model", ModelSchema.Model );

		mongoose.model( "Model" ).discriminator( collectionTitle, this );
	}
};

global.ModelSchema = ModelSchema;
module.exports = ModelSchema;

harden.bind( ModelSchema )
	( "Model", new ModelSchema( ) );

ModelSchema.Model.pre( "save",
	function onSave( next ){
		this.name = this.name.toLowerCase( );

		this.name = shardize( this.name, true );

		this.title = titlelize( this.title || this.name );

		next( );
	} );