var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Room = function Room( ){
	if( this instanceof Room ){
		MODEL.call( this, "Room" );

		this.scopes = [ 
			
		];

		this.searches = [ 
			
		];

		this.domains = {

		};

	}else{
		return new Room( );
	}
};

util.inherits( Room, MODEL );

RESPONSIBLE( ).compose( Room );

Room.prototype.add = function add( room ){
	var roomData = _.extend( {
		"roomID": this.roomID,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.add.call( this, roomData );

	return this;
};

Room.prototype.update = function update( room, reference ){
	var roomData = _.extend( {
		

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	MODEL.prototype.update.call( this, roomData, reference );

	return this;
};

Room.prototype.createReferenceID = function createReferenceID( room ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			

		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

Room.prototype.createRoomID = function createRoomID( room ){
	var roomData = JSON.stringify( room );

	var roomID = crypto.createHash( "sha512" )
		.update( roomData )
		.digest( "hex" )
		.toString( );

	this.references.push( roomID );

	this.roomID = roomID;

	return this;
};

global.Room = Room;