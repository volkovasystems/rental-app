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

		this.setScopes( );

		this.setSearches( );

		this.setDomains( );

	}else{
		return new RoomType( );
	}
};

util.inherits( RoomType, Model );

Responsible( ).compose( RoomType );

RoomType.prototype.add = function add( roomType ){
	var roomTypeData = this.resolveAddData( roomType )
		( {
			"roomTypeID": this.roomTypeID
		} );

	Model.prototype.add.call( this, roomTypeData );

	return this;
};

RoomType.prototype.update = function update( roomType, reference ){
	var roomTypeData = this.resolveUpdateData( roomType )( );

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
	var roomTypeName = shardize( roomType, true );

	RoomType( )
		.set( "mainSelf", this )
		.promise( )
		.clone( )
		.once( "error",
			function onError( error ){
				this.self.flush( ).drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, hasRoomType ){
				if( error ){
					this.self.flush( ).drop( ).mainSelf.result( error );

				}else if( hasRoomType ){
					this.self.drop( ).notify( );

				}else{
					this.self.flush( ).resolve( );
				}
			} )
		.has( roomTypeName, "name" )
		.self
		.wait( )
		.once( "error",
			function onError( error ){
				this.drop( ).mainSelf.result( error );
			} )
		.once( "result",
			function onResult( error, roomType ){
				if( error ){
					this.drop( ).mainSelf.result( error );

				}else{
					this.drop( ).mainSelf.result( null, roomType.referenceID );
				}
			} )
		.pick( "name", roomTypeName )
		.then( function addRoomType( ){
			var roomTypeData = {
				"name": roomTypeName
			};

			this
				.once( "error",
					function onError( error ){
						this.drop( ).mainSelf.result( error );
					} )
				.once( "result",
					function onResult( error, roomType ){
						if( error ){
							this.drop( ).mainSelf.result( error );

						}else{
							this.drop( ).mainSelf.result( null, roomType.referenceID );
						}
					} )
				.createReferenceID( roomTypeData )
				.createRoomTypeID( roomTypeData )
				.add( roomTypeData );
		} );
	
	return this;
};

global.RoomType = RoomType;
module.exports = RoomType;