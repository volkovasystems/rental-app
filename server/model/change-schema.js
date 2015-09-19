var lzString = require( "lz-string" );
var mongoose = require( "mongoose" );
var shortid = require( "shortid" );
var svo = require( "../utility/svo.js" );
var util = require( "util" );

/*:
	This will let us record change history for every document.

	By doing this we can revert changes to the document.
*/
var ChangeSchema = new mongoose.Schema( {
	"reference": {
		"type": String,
		"unique": true,
		"default": shortid.generate
	},

	//: This will be in UTC format.
	"timestamp": {
		"type": Date,
		"required": true
	},

	"log": {
		"namespace": String,
		"event": String,
		"description": String
	},

	"change": String
} );

ChangeSchema.pre( "save", 
	function onSave( next ){
		this.timestamp = this.timestamp || new Date( );

		this.log.description = svo( this.log.namespace, this.log.event, this.change );

		if( typeof this.change == "object" ){
			this.change = lzString.compress( JSON.stringify( this.change ) );
		
		}else{
			this.change = lzString.compress( this.change.toString( ) );
		}

		next( );
	} );

mongoose.model( "Change", ChangeSchema, "change" );

global.ChangeSchema = ChangeSchema;
module.exports = ChangeSchema;