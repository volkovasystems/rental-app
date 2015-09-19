var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var Room = function Room( ){
	if( this instanceof Room ){
		Model.call( this, "Room" );

		this.setScopes( [
			"buildingNumber",
			"roomNumber",

			"roomType",
			"roomSize",

			"roomItems",

			"occupantLimit"
		] );

		this.setSearches( [
			"buildingNumber",
			"roomNumber",

			"roomType",
			"roomSize",

			"roomItems",

			"occupantLimit"
		] );

		this.setDomains( {

		} );

	}else{
		return new Room( );
	}
};

util.inherits( Room, Model );

Responsible( ).compose( Room );

Room.prototype.add = function add( room ){
	var roomData = this.resolveAddData( room )
		( {
			"roomID": this.roomID,

			"buildingNumber": room.buildingNumber,
			"roomNumber": room.roomNumber,

			"roomType": room.roomType,
			"roomSize": room.roomSize,

			"roomItems": ( room.roomItems || [ ] )
				.map( function onEachRoomItem( roomItem ){
					return {
						"item": roomItem.item,
						"count": roomItem.count
					};
				} ),

			"occupantLimit": room.occupantLimit
		} );

	Model.prototype.add.call( this, roomData );

	return this;
};

Room.prototype.update = function update( room, reference ){
	var roomData = this.resolveUpdateData( room )
		( {
			"buildingNumber": room.buildingNumber,
			"roomNumber": room.roomNumber,

			"roomType": room.roomType,
			"roomSize": room.roomSize,

			"roomItems": ( function resolveRoomItems( room ){
				if( _.isEmpty( room.roomItems ) ){
					return null;
				
				}else{
					return room.roomItems
						.map( function onEachRoomItem( roomItem ){
							return {
								"item": roomItem.item,
								"count": roomItem.count
							};
						} );
				}
			} )( room ),

			"occupantLimit": room.occupantLimit
		} );

	Model.prototype.update.call( this, roomData, reference );

	return this;
};

Room.prototype.createReferenceID = function createReferenceID( room ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			room.buildingNumber,
			room.roomNumber,
			room.roomType
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
module.exports = Room;