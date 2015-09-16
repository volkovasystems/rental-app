var _ = require( "lodash" );
var async = require( "async" );
var crypto = require( "crypto" );
var util = require( "util" );
var shardize = require( "shardize" );
var titlelize = require( "titlelize" );

require( "../model/model.js" );

require( "../utility/responsible.js" );

var RoomType = function RoomType( ){
	if( this instanceof RoomType ){
		Model.call( this, "RoomType" );

	}else{
		return new RoomType( );
	}
};

util.inherits( RoomType, Model );

Responsible( ).compose( RoomType );

RoomType.prototype.add = function add( roomType ){
	var roomTypeData = _.extend( {
		"roomTypeID": this.roomTypeID,

		"name": roomType.name,
		"title": roomType.title,
		"description": roomType.description,

		"scopes": this.scopes,
		"searches": this.searches,
		"domains": this.domains
	}, this.modelData );

	Model.prototype.add.call( this, roomTypeData );

	return this;
};

RoomType.prototype.update = function update( roomType, reference ){
	var roomTypeData = _.extend( {
		"name": roomType.name || null,
		"title": roomType.title || null,
		"description": roomType.description || null,

		"scopes": this.scopes || null,
		"searches": this.searches || null,
		"domains": this.domains || null
	}, this.modelData );

	Model.prototype.update.call( this, roomTypeData, reference );

	return this;
};

RoomType.prototype.createReferenceID = function createReferenceID( roomType ){
	var referenceID = crypto.createHash( "sha512" )
		.update( _.flatten( [
			roomType.name,
			roomType.title,
			roomType.description
		] ).join( "-" ) )
		.digest( "hex" )
		.toString( );

	this.references.push( referenceID );

	this.reference = referenceID;

	this.referenceID = referenceID;

	return this;
};

RoomType.prototype.createRoomTypeID = function createRoomTypeID( roomType ){
	var roomTypeData = JSON.stringify( roomType );

	var roomTypeID = crypto.createHash( "sha512" )
		.update( roomTypeData )
		.digest( "hex" )
		.toString( );

	this.references.push( roomTypeID );

	this.roomTypeID = roomTypeID;

	return this;
};

RoomType.prototype.resolveRoomType = function resolveRoomType( roomType ){
	/*:
		We will search for room types that doesn't have documents.

		Extract them and save them.

		@todo:
			Make the query fast by introducing a custom query
				to get all room types not in the database.
		@end-todo
	*/
	this
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).result( error );
			} )
		.once( "result",
			function onResult( error, hasRoomType ){
				if( error ){
					this.self.flush( ).result( error );

				}else if( hasRoomType ){
					this.self.flush( ).result( );

				}else{
					this.self.notify( );
				}
			} )
		.has( shardize( roomType ), "name" )
		.self
		.wait( )
		.promise( )
		.once( "error",
			function onError( error ){
				this.reject( error );
			} )
		.once( "result",
			function onResult( error, hasRoomType ){
				if( error ){
					this.reject( error );

				}else if( hasRoomType ){
					this.drop( ).result( );

				}else{
					this.resolve( );
				}
			} )
		.has( roomType, "references" )
		.then( function addRoomType( ){
			this
				.once( "error",
					function onError( error ){
						this.result( error );
					} )
				.once( "result",
					function onResult( error, roomType ){
						if( error ){
							this.result( error );

						}else{
							this.result( null, roomType.referenceID );
						}
					} )
				.createReferenceID( roomType )
				.createRoomTypeID( roomType )
				.add( roomType );
		} )
		.hold( function onError( error ){
			this.result( error )
		} );
	
	return this;
};

global.RoomType = RoomType;
module.exports = RoomType;